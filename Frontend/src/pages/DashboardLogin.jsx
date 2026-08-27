import { useState } from "react";
import { apiUrl } from "../lib/api";
import { ArrowRight, LockKeyhole, AlertCircle, Info } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import {
  getAuthUser,
  isDashboardAuthenticated,
  setAuthSession,
} from "../lib/dashboardAuth";

export default function DashboardLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingNotice, setPendingNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isDashboardAuthenticated()) {
    const user = getAuthUser();
    const destination = user?.role === "superadmin" ? "/dashboard/home" : "/dashboard/bikes";
    return <Navigate to={destination} replace />;
  }

  const fromPath = location.state?.from?.pathname;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPendingNotice("");

    if (!username.trim() || !password.trim()) {
      setError("Enter your username/email and password to continue.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.status === "pending" || response.status === 403) {
          setPendingNotice(data.message || "Your account is pending verification and approval by Superadmin.");
          return;
        }
        throw new Error(data.message || "Invalid credentials.");
      }

      setAuthSession(data.accessToken, data.user);

      // Superadmin goes to /dashboard/home, Agent goes to /dashboard/bikes
      const targetDestination = fromPath && fromPath !== "/dashboard/login"
        ? fromPath
        : data.user?.role === "superadmin"
          ? "/dashboard/home"
          : "/dashboard/bikes";

      navigate(targetDestination, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,185,85,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_26%),linear-gradient(135deg,#08111f_0%,#0f1724_45%,#111827_100%)]" />
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

        <section className="relative w-full max-w-md rounded-4xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            <LockKeyhole className="h-4 w-4" />
            Dashboard Login
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-white">Sign In</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in as Superadmin or an Approved Agent to manage your listings and bookings.
            </p>
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Email or Username
              </span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin or agent@example.com"
                autoComplete="off"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
              />
            </label>

            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {pendingNotice && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-200">
                <Info className="h-5 w-5 shrink-0 text-amber-400" />
                <span>{pendingNotice}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-slate-400">
            Want to become a verified vendor/agent?{" "}
            <Link to="/agent" className="font-semibold text-amber-300 hover:underline">
              Apply here
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
