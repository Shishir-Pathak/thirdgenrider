import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch, apiUrl } from "../lib/api";
import {
	focusFirstFormError,
	validateImageFile,
	validateMinText,
} from "../lib/formValidation";
import { parseApiError } from "../lib/parseApiError";

export function emptyItineraryDay(index = 0) {
	const n = String(index + 1).padStart(2, "0");
	return { dayNumber: `Day ${n}`, description: "" };
}

export function emptyListItem() {
	return "";
}

export function emptyPackageDraft() {
	return {
		title: "",
		location: "",
		durationDays: "",
		durationNights: "",
		groupSize: "",
		price: "",
		packageExperience: "",
		tripHighlights: [emptyListItem()],
		inclusions: [emptyListItem()],
		itinerary: [emptyItineraryDay(0)],
	};
}

function parseDuration(value) {
	const text = String(value || "");
	const dayMatch = text.match(/(\d+)\s*days?/i);
	const nightMatch = text.match(/(\d+)\s*nights?/i);
	const numbers = text.match(/\d+/g) || [];

	return {
		durationDays: dayMatch?.[1] || numbers[0] || "",
		durationNights: nightMatch?.[1] || numbers[1] || "",
	};
}

function formatDuration(days, nights) {
	const dayCount = Number.parseInt(days, 10);
	const nightCount = Number.parseInt(nights, 10);
	const dayLabel = dayCount === 1 ? "Day" : "Days";
	const nightLabel = nightCount === 1 ? "Night" : "Nights";
	return `${dayCount} ${dayLabel}-${nightCount} ${nightLabel}`;
}

export function packageToDraft(pkg) {
	const duration = parseDuration(pkg.duration);
	return {
		title: pkg.title,
		location: pkg.location,
		durationDays: duration.durationDays,
		durationNights: duration.durationNights,
		groupSize: String(pkg.groupSize),
		price: String(pkg.price),
		packageExperience: pkg.packageExperience || "",
		tripHighlights:
			pkg.tripHighlights?.length > 0 ? [...pkg.tripHighlights] : [emptyListItem()],
		inclusions:
			pkg.inclusions?.length > 0 ? [...pkg.inclusions] : [emptyListItem()],
		itinerary:
			pkg.itinerary?.length > 0
				? pkg.itinerary.map((d) => ({
						dayNumber: d.dayNumber,
						description: d.description,
					}))
				: [emptyItineraryDay(0)],
	};
}

function validateDraft(draft) {
	const title = draft.title.trim();
	const location = draft.location.trim();
	const durationDays = Number.parseInt(draft.durationDays, 10);
	const durationNights = Number.parseInt(draft.durationNights, 10);
	const groupSize = Number.parseInt(draft.groupSize, 10);
	const priceNum = Number.parseFloat(draft.price);
	const packageExperience = draft.packageExperience.trim();
	const itinerary = draft.itinerary
		.map((d) => ({
			dayNumber: d.dayNumber.trim(),
			description: d.description.trim(),
		}))
		.filter((d) => d.dayNumber && d.description);
	const tripHighlights = draft.tripHighlights
		.map((item) => item.trim())
		.filter(Boolean);
	const inclusions = draft.inclusions.map((item) => item.trim()).filter(Boolean);

	if (!title) return "Title is required.";
	if (!location) return "Location is required.";
	if (!Number.isInteger(durationDays) || durationDays < 1) {
		return "Enter a valid number of days.";
	}
	if (!Number.isInteger(durationNights) || durationNights < 0) {
		return "Enter a valid number of nights.";
	}
	if (!Number.isFinite(groupSize) || groupSize < 1) {
		return "Enter a valid group size (at least 1).";
	}
	if (!Number.isFinite(priceNum) || priceNum < 0) {
		return "Enter a valid price.";
	}
	const experienceError = validateMinText(
		packageExperience,
		"Package experience",
	);
	if (experienceError) return experienceError;
	if (itinerary.length === 0) {
		return "Add at least one itinerary day with a description.";
	}
	const shortItineraryDay = itinerary.find(
		(day) => day.description.length < 3,
	);
	if (shortItineraryDay) {
		return "Itinerary descriptions must be at least 3 characters.";
	}
	if (tripHighlights.length === 0) {
		return "Add at least one trip highlight.";
	}
	if (inclusions.length === 0) {
		return "Add at least one inclusion.";
	}
	return null;
}

export function usePackagesAdmin() {
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formModal, setFormModal] = useState(null);
	const [draft, setDraft] = useState(emptyPackageDraft);
	const [formError, setFormError] = useState("");
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const imageInputRef = useRef(null);

	const loadPackages = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/packages"));
			if (!res.ok) throw new Error(await parseApiError(res));
			setPackages(await res.json());
		} catch (err) {
			setListError(err.message || "Failed to load packages.");
			setPackages([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPackages();
	}, [loadPackages]);

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
		setDraft(emptyPackageDraft());
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "add" });
	};

	const openEdit = (pkg) => {
		setDraft(packageToDraft(pkg));
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "edit", pkg });
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
		const imageError = validateImageFile(file, {
			label: "Package image",
			required: formModal.mode === "add",
		});
		if (imageError) {
			setFormError(imageError);
			focusFirstFormError(e.currentTarget);
			return;
		}

		const itinerary = draft.itinerary
			.map((d) => ({
				dayNumber: d.dayNumber.trim(),
				description: d.description.trim(),
			}))
			.filter((d) => d.dayNumber && d.description);
		const tripHighlights = draft.tripHighlights
			.map((item) => item.trim())
			.filter(Boolean);
		const inclusions = draft.inclusions
			.map((item) => item.trim())
			.filter(Boolean);

		const fd = new FormData();
		fd.append("title", draft.title.trim());
		fd.append("location", draft.location.trim());
		fd.append(
			"duration",
			formatDuration(draft.durationDays, draft.durationNights),
		);
		fd.append("groupSize", String(Number.parseInt(draft.groupSize, 10)));
		fd.append("price", String(Number.parseFloat(draft.price)));
		fd.append("itinerary", JSON.stringify(itinerary));
		fd.append("tripHighlights", JSON.stringify(tripHighlights));
		fd.append("inclusions", JSON.stringify(inclusions));
		fd.append("packageExperience", draft.packageExperience.trim());
		if (file) fd.append("image", file);

		setFormSubmitting(true);
		setFormError("");
		try {
			const url =
				formModal.mode === "add"
					? "/api/packages"
					: `/api/packages/${formModal.pkg.id}`;
			const res = await authFetch(url, {
				method: formModal.mode === "add" ? "POST" : "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadPackages();
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
			const res = await authFetch(`/api/packages/${deleteTarget.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadPackages();
			setDeleteTarget(null);
		} catch (err) {
			setListError(err.message || "Failed to delete package.");
			setDeleteTarget(null);
		} finally {
			setDeleteSubmitting(false);
		}
	};

	return {
		packages,
		loading,
		listError,
		loadPackages,
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
