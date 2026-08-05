const DASHBOARD_AUTH_KEY = "dashboardAuthenticated";

function readDashboardAuth() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(DASHBOARD_AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function isDashboardAuthenticated() {
  return readDashboardAuth();
}

export function setDashboardAuthenticated(value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(DASHBOARD_AUTH_KEY, value ? "true" : "false");
  } catch {
    // Ignore storage failures and fall back to the current session.
  }
}

export function clearDashboardAuthenticated() {
  setDashboardAuthenticated(false);
}
