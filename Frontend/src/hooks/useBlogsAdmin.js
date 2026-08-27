import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch, apiUrl } from "../lib/api";
import {
	focusFirstFormError,
	isValidSlug,
	validateImageFile,
	validateMinText,
} from "../lib/formValidation";
import { parseApiError } from "../lib/parseApiError";

export function emptyCommentItem() {
	return "";
}

export function emptyBlogDraft() {
	return {
		title: "",
		slug: "",
		description: "",
		author: "",
		comments: [emptyCommentItem()],
	};
}

export function blogToDraft(blog) {
	return {
		title: blog.title || "",
		slug: blog.slug || "",
		description: blog.description || "",
		author: blog.author || "",
		comments:
			Array.isArray(blog.comments) && blog.comments.length > 0
				? [...blog.comments]
				: [emptyCommentItem()],
	};
}

export function slugify(value) {
	return String(value || "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

function plainTextFromHtml(html) {
	return String(html || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function useBlogsAdmin() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formModal, setFormModal] = useState(null);
	const [draft, setDraft] = useState(emptyBlogDraft);
	const [formError, setFormError] = useState("");
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const imageInputRef = useRef(null);

	const loadBlogs = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/blogs"));
			if (!res.ok) throw new Error(await parseApiError(res));
			setBlogs(await res.json());
		} catch (err) {
			setListError(err.message || "Failed to load blog posts.");
			setBlogs([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadBlogs();
	}, [loadBlogs]);

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
		setDraft(emptyBlogDraft());
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "add" });
	};

	const openEdit = (blog) => {
		setDraft(blogToDraft(blog));
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "edit", blog });
	};

	const closeForm = () => {
		setFormModal(null);
		setFormError("");
	};

	const updateTitle = (title) => {
		setDraft((d) => {
			const next = { ...d, title };
			if (!d.slug || d.slug === slugify(d.title)) {
				next.slug = slugify(title);
			}
			return next;
		});
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const title = draft.title.trim();
		const slug = draft.slug.trim();
		const author = draft.author.trim();
		const comments = draft.comments
			.map((item) => String(item).trim())
			.filter(Boolean);
		const description = draft.description;
		const file = imageInputRef.current?.files?.[0];

		if (!title) {
			setFormError("Title is required.");
			focusFirstFormError(e.currentTarget);
			return;
		}
		if (!slug) {
			setFormError("Slug is required.");
			focusFirstFormError(e.currentTarget);
			return;
		}
		if (!isValidSlug(slug)) {
			setFormError("Slug can only use lowercase letters, numbers, and hyphens.");
			focusFirstFormError(e.currentTarget);
			return;
		}
		if (!author) {
			setFormError("Author is required.");
			focusFirstFormError(e.currentTarget);
			return;
		}
		const descriptionError = validateMinText(
			plainTextFromHtml(description),
			"Description",
		);
		if (descriptionError) {
			setFormError(descriptionError);
			focusFirstFormError(e.currentTarget);
			return;
		}
		const imageError = validateImageFile(file, {
			label: "Blog image",
			required: formModal.mode === "add",
		});
		if (imageError) {
			setFormError(imageError);
			focusFirstFormError(e.currentTarget);
			return;
		}

		const fd = new FormData();
		fd.append("title", title);
		fd.append("slug", slug);
		fd.append("author", author);
		fd.append("description", description);
		fd.append("comments", JSON.stringify(comments));
		if (file) fd.append("image", file);

		setFormSubmitting(true);
		setFormError("");
		try {
			const url =
				formModal.mode === "add"
					? "/api/blogs"
					: `/api/blogs/${formModal.blog.id}`;
			const res = await authFetch(url, {
				method: formModal.mode === "add" ? "POST" : "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadBlogs();
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
			const res = await authFetch(`/api/blogs/${deleteTarget.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadBlogs();
			setDeleteTarget(null);
		} catch (err) {
			setListError(err.message || "Failed to delete blog post.");
			setDeleteTarget(null);
		} finally {
			setDeleteSubmitting(false);
		}
	};

	return {
		blogs,
		loading,
		listError,
		loadBlogs,
		formModal,
		draft,
		setDraft,
		updateTitle,
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
