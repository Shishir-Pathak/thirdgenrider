export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

export function getDigits(value) {
	return String(value || "").replace(/\D/g, "");
}

export function validateImageFile(file, { label = "Image", required = false } = {}) {
	if (!file) return required ? `${label} is required.` : "";
	if (!file.type?.startsWith("image/")) return `${label} must be an image file.`;
	if (file.size > MAX_IMAGE_BYTES) return `${label} must be 6 MB or smaller.`;
	return "";
}

export function validateMinText(value, label, minLength = 3) {
	const text = String(value || "").trim();
	if (!text) return `${label} is required.`;
	if (text.length < minLength) {
		return `${label} must be at least ${minLength} characters.`;
	}
	return "";
}

export function validateOptionalMinText(value, label, minLength = 3) {
	const text = String(value || "").trim();
	if (!text) return "";
	if (text.length < minLength) {
		return `${label} must be at least ${minLength} characters.`;
	}
	return "";
}

export function validatePhoneNumber(
	value,
	{ label = "Phone", required = true } = {},
) {
	const text = String(value || "").trim();
	if (!text) return required ? `${label} is required.` : "";
	return getDigits(text).length === 10 ? "" : `${label} must be 10 digits.`;
}

export function isValidSlug(value) {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ""));
}

export function focusFirstFormError(form) {
	if (!form) return;

	window.requestAnimationFrame(() => {
		const target = form.querySelector(
			"[data-field-error], [data-form-error], [aria-invalid='true'], :invalid",
		);
		if (!target) return;

		target.scrollIntoView({ behavior: "smooth", block: "center" });
		if (typeof target.focus === "function") {
			target.focus({ preventScroll: true });
		}
	});
}
