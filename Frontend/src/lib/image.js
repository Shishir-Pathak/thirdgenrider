export function getHighResImage(url, width = 1200) {
  if (!url || typeof url !== "string") return url;
  try {
    const uploadToken = "/upload/";
    const idx = url.indexOf(uploadToken);
    if (idx === -1) return url;
    const before = url.slice(0, idx + uploadToken.length);
    const after = url.slice(idx + uploadToken.length);
    // insert automatic format/quality and width
    const transform = `q_auto,f_auto,w_${width}/`;
    return `${before}${transform}${after}`;
  } catch (e) {
    return url;
  }
}
