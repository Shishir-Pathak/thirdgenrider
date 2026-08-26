/**
 * Build an API URL. In dev, omit VITE_API_URL to use the Vite proxy (`/api` → backend).
 * With VITE_API_URL (e.g. http://localhost:5000), requests go directly to the backend.
 */
export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/";

  if (raw && String(raw).trim()) {
    const base = String(raw).replace(/\/$/, "");

    return `${base}${p}`;
  }

  return p;
}
