const DASHBOARD_AUTH_KEY = "dashboardAuthenticated";
const DASHBOARD_TOKEN_KEY = "dashboardToken";
const DASHBOARD_USER_KEY = "dashboardUser";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(DASHBOARD_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DASHBOARD_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isDashboardAuthenticated() {
  if (typeof window === "undefined") return false;
  try {
    const isAuth = window.localStorage.getItem(DASHBOARD_AUTH_KEY) === "true";
    const hasToken = Boolean(window.localStorage.getItem(DASHBOARD_TOKEN_KEY));
    return isAuth && hasToken;
  } catch {
    return false;
  }
}

export function isSuperAdmin() {
  const user = getAuthUser();
  return user?.role === "superadmin";
}

export function isAgent() {
  const user = getAuthUser();
  return user?.role === "agent" || user?.role === "admin";
}

export function setAuthSession(token, user) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DASHBOARD_AUTH_KEY, "true");
    if (token) {
      window.localStorage.setItem(DASHBOARD_TOKEN_KEY, token);
    }
    if (user) {
      window.localStorage.setItem(DASHBOARD_USER_KEY, JSON.stringify(user));
    }
  } catch {
    // Ignore storage failures
  }
}

export function setDashboardAuthenticated(value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DASHBOARD_AUTH_KEY, value ? "true" : "false");
  } catch {
    // Ignore
  }
}

export function clearDashboardAuthenticated() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DASHBOARD_AUTH_KEY);
    window.localStorage.removeItem(DASHBOARD_TOKEN_KEY);
    window.localStorage.removeItem(DASHBOARD_USER_KEY);
  } catch {
    // Ignore
  }
}
