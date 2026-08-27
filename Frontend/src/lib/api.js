import { getAuthToken } from "./dashboardAuth";

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

/**
 * Helper to build auth headers including Bearer token if present
 */
export function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  const headers = { ...extraHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch wrapper that automatically adds Authorization header
 */
export async function authFetch(path, options = {}) {
  const url = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : apiUrl(path);

  const headers = getAuthHeaders(options.headers || {});
  return fetch(url, {
    ...options,
    headers,
  });
}
