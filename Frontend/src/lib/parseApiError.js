export async function parseApiError(res) {
	const text = await res.text();
	if (!text) return `Request failed (${res.status})`;
	try {
		const j = JSON.parse(text);
		if (j && typeof j.message === "string") return j.message;
	} catch {
		/* ignore */
	}
	return text.length > 180 ? `${text.slice(0, 180)}…` : text;
}
