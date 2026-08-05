import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { focusFirstFormError, validateMinText } from "../lib/formValidation";
import { parseApiError } from "../lib/parseApiError";
import { mergeSiteContent } from "../lib/siteContentDefaults";

function htmlToText(value) {
	return String(value || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function featuresToEditorHtml(features) {
	if (!Array.isArray(features) || features.length === 0) return "";
	return `<ul>${features.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function featuresEditorHtmlToArray(value) {
	const html = String(value || "").trim();
	if (!html) return [];

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	const itemNodes = doc.body.querySelectorAll("li");
	const nodes = itemNodes.length ? itemNodes : doc.body.querySelectorAll("p");
	const items = Array.from(nodes)
		.map((node) => node.innerHTML.trim())
		.filter((item) => htmlToText(item));

	if (items.length) return items;

	return html
		.split(/\r?\n/)
		.map((item) => item.trim())
		.filter(Boolean);
}

function validateImageFiles(files) {
	for (const file of Object.values(files)) {
		if (!file) continue;
		if (!file.type?.startsWith("image/")) {
			return "Choose a valid image file.";
		}
		if (file.size > 5 * 1024 * 1024) {
			return "Image must be 5 MB or smaller.";
		}
	}
	return null;
}

function validateProcessSteps(steps) {
	const filledSteps = steps.filter(
		(step) =>
			String(step.number || "").trim() ||
			String(step.title || "").trim() ||
			String(step.description || "").trim(),
	);

	if (filledSteps.length === 0) {
		return "Add at least one process step.";
	}

	for (const [index, step] of filledSteps.entries()) {
		if (!String(step.title || "").trim()) {
			return `Step ${index + 1} title is required.`;
		}
		if (!String(step.description || "").trim()) {
			return `Step ${index + 1} description is required.`;
		}
		if (String(step.description || "").trim().length < 3) {
			return `Step ${index + 1} description must be at least 3 characters.`;
		}
	}

	return null;
}

function validateServiceListItems(items, listName, fields) {
	if (items.length === 0) return `Add at least one ${listName}.`;

	for (const [index, item] of items.entries()) {
		for (const [field, label] of fields) {
			const value = String(item[field] || "").trim();
			if (!value) {
				return `${listName} ${index + 1} ${label} is required.`;
			}
			if ((field === "description" || field === "review") && value.length < 3) {
				return `${listName} ${index + 1} ${label} must be at least 3 characters.`;
			}
		}
	}

	return null;
}

function validateSectionDraft(section, draft, files) {
	const fileError = validateImageFiles(files);
	if (fileError) return fileError;

	if (section === "homeHero") {
		if (!draft.homeHero.title.trim()) return "Hero title is required.";
		if (!draft.homeHero.subtitle.trim()) return "Hero subtitle is required.";
		if (!draft.homeHero.buttonText.trim()) return "Button text is required.";
		return null;
	}

	if (section === "process") {
		if (!draft.process.heading.trim()) return "Process heading is required.";
		if (!draft.process.subheading.trim()) {
			return "Process subheading is required.";
		}
		if (!draft.process.description.trim()) {
			return "Process description is required.";
		}
		const processDescriptionError = validateMinText(
			draft.process.description,
			"Process description",
		);
		if (processDescriptionError) return processDescriptionError;
		return validateProcessSteps(draft.process.steps);
	}

	if (section === "about") {
		if (!draft.about.heading.trim()) return "About heading is required.";
		const aboutDescriptionError = validateMinText(
			htmlToText(draft.about.description),
			"About description",
		);
		if (aboutDescriptionError) return aboutDescriptionError;
		if (!htmlToText(draft.about.visionText)) return "Vision text is required.";
		if (!htmlToText(draft.about.missionText)) return "Mission text is required.";
		if (!htmlToText(draft.about.closingText)) return "Closing text is required.";
		if (!draft.about.experienceYears.trim()) {
			return "Experience value is required.";
		}
		if (!draft.about.experienceLabel.trim()) {
			return "Experience label is required.";
		}
		if (featuresEditorHtmlToArray(draft.about.featuresText).length === 0) {
			return "Add at least one feature.";
		}
		return null;
	}

	if (section === "service") {
		if (!draft.service.heading.trim()) return "Service heading is required.";
		const serviceDescriptionError = validateMinText(
			htmlToText(draft.service.description),
			"Service description",
		);
		if (serviceDescriptionError) return serviceDescriptionError;
		const cardsError = validateServiceListItems(draft.service.cards, "card", [
			["icon", "icon"],
			["title", "title"],
			["description", "description"],
		]);
		if (cardsError) return cardsError;
		const statsError = validateServiceListItems(draft.service.stats, "stat", [
			["icon", "icon"],
			["number", "number"],
			["label", "label"],
		]);
		if (statsError) return statsError;
		if (!draft.service.reviewsHeading.trim()) {
			return "Reviews heading is required.";
		}
		if (!draft.service.reviewsDescription.trim()) {
			return "Reviews description is required.";
		}
		return validateServiceListItems(draft.service.reviews, "review", [
			["name", "name"],
			["review", "text"],
		]);
	}

	return null;
}

function toDraft(content) {
	const merged = mergeSiteContent(content);
	return {
		homeHero: { ...merged.homeHero },
		about: {
			...merged.about,
			featuresText: featuresToEditorHtml(merged.about.features),
		},
		process: {
			...merged.process,
			steps: merged.process.steps.map((step) => ({ ...step })),
		},
		service: {
			...merged.service,
			cards: merged.service.cards.map((card) => ({ ...card })),
			stats: merged.service.stats.map((stat) => ({ ...stat })),
			reviews: merged.service.reviews.map((review) => ({ ...review })),
		},
	};
}

function draftToPayload(draft) {
	return {
		homeHero: { ...draft.homeHero },
		about: {
			...draft.about,
			features: featuresEditorHtmlToArray(draft.about.featuresText),
		},
		process: {
			...draft.process,
			steps: draft.process.steps
				.map((step, index) => ({
					number:
						step.number.trim() || `${String(index + 1).padStart(2, "0")}.`,
					title: step.title.trim(),
					description: step.description.trim(),
				}))
				.filter((step) => step.number || step.title || step.description),
		},
		service: {
			...draft.service,
			cards: draft.service.cards
				.map((card) => ({
					icon: card.icon.trim(),
					title: card.title.trim(),
					description: card.description.trim(),
				}))
				.filter((card) => card.icon || card.title || card.description),
			stats: draft.service.stats
				.map((stat) => ({
					icon: stat.icon.trim(),
					number: stat.number.trim(),
					label: stat.label.trim(),
				}))
				.filter((stat) => stat.icon || stat.number || stat.label),
			reviews: draft.service.reviews
				.map((review) => ({
					name: review.name.trim(),
					review: review.review.trim(),
				}))
				.filter((review) => review.name || review.review),
		},
	};
}

export function useSiteContentAdmin() {
	const [content, setContent] = useState(() => mergeSiteContent(null));
	const [draft, setDraft] = useState(() => toDraft(null));
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formError, setFormError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const loadSiteContent = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/site-content"));
			if (!res.ok) throw new Error(await parseApiError(res));
			const nextContent = mergeSiteContent(await res.json());
			setContent(nextContent);
			setDraft(toDraft(nextContent));
		} catch (err) {
			setListError(err.message || "Failed to load page content.");
			const fallback = mergeSiteContent(null);
			setContent(fallback);
			setDraft(toDraft(fallback));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadSiteContent();
	}, [loadSiteContent]);

	const resetDraft = () => {
		setDraft(toDraft(content));
		setFormError("");
	};

	const saveDraft = async (section, files = {}, form) => {
		const validationError = validateSectionDraft(section, draft, files);
		if (validationError) {
			setFormError(validationError);
			focusFirstFormError(form);
			return false;
		}

		setSubmitting(true);
		setFormError("");
		try {
			const payload = draftToPayload(draft);
			const fd = new FormData();
			fd.append(
				"content",
				JSON.stringify({
					...content,
					...payload,
					[section]: payload[section],
				}),
			);
			for (const [field, file] of Object.entries(files)) {
				if (file) fd.append(field, file);
			}
			const res = await fetch(apiUrl("/api/site-content"), {
				method: "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			const nextContent = mergeSiteContent(await res.json());
			setContent(nextContent);
			setDraft(toDraft(nextContent));
			return true;
		} catch (err) {
			setFormError(err.message || "Failed to save page content.");
			return false;
		} finally {
			setSubmitting(false);
		}
	};

	return {
		content,
		draft,
		setDraft,
		loading,
		listError,
		formError,
		submitting,
		loadSiteContent,
		resetDraft,
		saveDraft,
	};
}
