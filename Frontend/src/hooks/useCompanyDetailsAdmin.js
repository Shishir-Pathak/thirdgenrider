import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch, apiUrl } from "../lib/api";
import {
	focusFirstFormError,
	validateImageFile,
	validateOptionalMinText,
	validatePhoneNumber,
} from "../lib/formValidation";
import { parseApiError } from "../lib/parseApiError";

export function emptyCompanyDetailsDraft() {
	return {
		name: "",
		contactEmail: "",
		contactPhone: "",
		whatsapp: "",
		location: "",
		businessHours: "",
		about: "",
		facebook: "",
		tiktok: "",
		instagram: "",
	};
}

export function companyDetailsToDraft(details) {
	return {
		name: details.name || "",
		contactEmail: details.contactEmail || "",
		contactPhone: details.contactPhone || "",
		whatsapp: details.whatsapp || "",
		location: details.location || "",
		businessHours: details.businessHours || "",
		about: details.about || "",
		facebook: details.facebook || "",
		tiktok: details.tiktok || "",
		instagram: details.instagram || "",
	};
}

function validateDraft(draft) {
	if (!draft.name.trim()) return "Company name is required.";
	if (draft.contactPhone.trim()) {
		const phoneError = validatePhoneNumber(draft.contactPhone, {
			label: "Phone",
			required: false,
		});
		if (phoneError) return phoneError;
	}
	if (draft.whatsapp.trim()) {
		const whatsappError = validatePhoneNumber(draft.whatsapp, {
			label: "WhatsApp",
			required: false,
		});
		if (whatsappError) return whatsappError;
	}
	const aboutError = validateOptionalMinText(draft.about, "About");
	if (aboutError) return aboutError;
	return null;
}

export function useCompanyDetailsAdmin() {
	const [details, setDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formModal, setFormModal] = useState(null);
	const [draft, setDraft] = useState(emptyCompanyDetailsDraft);
	const [formError, setFormError] = useState("");
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const imageInputRef = useRef(null);

	const loadCompanyDetails = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/company-details"));
			if (res.status === 404) {
				setDetails(null);
				return;
			}
			if (!res.ok) throw new Error(await parseApiError(res));
			setDetails(await res.json());
		} catch (err) {
			setListError(err.message || "Failed to load company details.");
			setDetails(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadCompanyDetails();
	}, [loadCompanyDetails]);

	useEffect(() => {
		if (!formModal) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				setFormModal(null);
				setFormError("");
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [formModal]);

	useEffect(() => {
		if (!deleteTarget) return;
		const onKey = (e) => {
			if (e.key === "Escape") setDeleteTarget(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [deleteTarget]);

	const resetImageInput = () => {
		if (imageInputRef.current) imageInputRef.current.value = "";
	};

	const openAdd = () => {
		setDraft(emptyCompanyDetailsDraft());
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "add" });
	};

	const openEdit = () => {
		if (!details) return;
		setDraft(companyDetailsToDraft(details));
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "edit", details });
	};

	const closeForm = () => {
		setFormModal(null);
		setFormError("");
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const errMsg = validateDraft(draft);
		if (errMsg) {
			setFormError(errMsg);
			focusFirstFormError(e.currentTarget);
			return;
		}

		const file = imageInputRef.current?.files?.[0];
		const imageError = validateImageFile(file, { label: "Logo" });
		if (imageError) {
			setFormError(imageError);
			focusFirstFormError(e.currentTarget);
			return;
		}

		const fd = new FormData();
		for (const [key, value] of Object.entries(draft)) {
			fd.append(key, value.trim());
		}
		if (file) fd.append("image", file);

		setFormSubmitting(true);
		setFormError("");
		try {
			const isAdd = formModal.mode === "add";
			const url = isAdd
				? "/api/company-details"
				: `/api/company-details/${formModal.details.id}`;
			const res = await authFetch(url, {
				method: isAdd ? "POST" : "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadCompanyDetails();
			closeForm();
		} catch (err) {
			setFormError(err.message || "Something went wrong.");
		} finally {
			setFormSubmitting(false);
		}
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		setDeleteSubmitting(true);
		try {
			const res = await authFetch(`/api/company-details/${deleteTarget.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadCompanyDetails();
			setDeleteTarget(null);
		} catch (err) {
			setListError(err.message || "Failed to delete company details.");
			setDeleteTarget(null);
		} finally {
			setDeleteSubmitting(false);
		}
	};

	return {
		details,
		loading,
		listError,
		loadCompanyDetails,
		formModal,
		draft,
		setDraft,
		formError,
		formSubmitting,
		imageInputRef,
		deleteTarget,
		setDeleteTarget,
		deleteSubmitting,
		openAdd,
		openEdit,
		closeForm,
		submitForm,
		confirmDelete,
	};
}
