import { Navigate, Outlet, useLocation } from "react-router";
import { isDashboardAuthenticated } from "../../lib/dashboardAuth";

export default function DashboardAuthGate() {
  const location = useLocation();

  if (!isDashboardAuthenticated()) {
    return (
      <Navigate to="/dashboard/login" replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}
