import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "../lib/api";
import { mergeSiteContent } from "../lib/siteContentDefaults";

export function useSiteContent(section) {
	const defaultContent = useMemo(() => mergeSiteContent(null), []);
	const [content, setContent] = useState(defaultContent);
	const [loading, setLoading] = useState(true);

	const loadSiteContent = useCallback(async () => {
		setLoading(true);

		try {
			// Always fetch the complete site content
			const res = await fetch(apiUrl("/api/site-content"));

			if (!res.ok) {
				throw new Error("Failed to load site content.");
			}

			const data = await res.json();
			const mergedContent = mergeSiteContent(data);

			if (section) {
				setContent((prev) => ({
					...prev,
					[section]: mergedContent[section],
				}));
			} else {
				setContent(mergedContent);
			}
		} catch (error) {
			console.error("Failed to load site content:", error);

			if (section) {
				setContent((prev) => ({
					...prev,
					[section]: defaultContent[section],
				}));
			} else {
				setContent(defaultContent);
			}
		} finally {
			setLoading(false);
		}
	}, [section, defaultContent]);

	useEffect(() => {
		loadSiteContent();
	}, [loadSiteContent]);

	return {
		content,
		loading,
		loadSiteContent,
	};
}