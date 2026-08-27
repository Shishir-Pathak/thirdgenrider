import { Navigate, Outlet, useLocation } from "react-router";
import {
  getAuthUser,
  isDashboardAuthenticated,
  isSuperAdmin,
} from "../../lib/dashboardAuth";

const SUPERADMIN_ONLY_PATHS = [
  "/dashboard/home",
  "/dashboard/about",
  "/dashboard/service",
  "/dashboard/companyDetails",
  "/dashboard/packages",
  "/dashboard/packageBookings",
  "/dashboard/contact",
  "/dashboard/blogs",
  "/dashboard/agents",
  "/dashboard/agent",
];

export default function DashboardAuthGate() {
  const location = useLocation();

  if (!isDashboardAuthenticated()) {
    return (
      <Navigate to="/dashboard/login" replace state={{ from: location }} />
    );
  }

  const superAdmin = isSuperAdmin();
  const currentPath = location.pathname;

  // If a non-superadmin (agent) tries to access superadmin-only pages, redirect to /dashboard/bikes
  if (!superAdmin && SUPERADMIN_ONLY_PATHS.some((p) => currentPath.startsWith(p))) {
    return <Navigate to="/dashboard/bikes" replace />;
  }

  return <Outlet />;
}
