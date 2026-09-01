import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import {
  clearDashboardAuthenticated,
  getAuthUser,
  isSuperAdmin,
} from "../lib/dashboardAuth";
import {
  Bike,
  Building2,
  LayoutDashboard,
  Image as ImageIcon,
  Info,
  Wrench,
  Package,
  BookOpen,
  CalendarDays,
  Mail,
  LogOut,
  Menu,
  Moon,
  Sun,
  Maximize,
  Minimize,
  ClipboardList,
  Car,
  Users,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import AgentButton from "../components/dashboard/AgentButton";

const brandName = "Third Generation Rider";
const footerYear = new Date().getFullYear();

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [fs, setFs] = useState(false);

  const user = getAuthUser();
  const superAdmin = isSuperAdmin();

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const handleLogout = () => {
    clearDashboardAuthenticated();
    navigate("/dashboard/login", { replace: true });
  };

  // Dynamic Navigation items based on role
  const superAdminNav = [
    {
      title: "Content & Pages",
      items: [
        { label: "Home Page", icon: ImageIcon, to: "/dashboard/home" },
        { label: "About Page", icon: Info, to: "/dashboard/about" },
        { label: "Service Page", icon: Wrench, to: "/dashboard/service" },
        { label: "Company Details", icon: Building2, to: "/dashboard/companyDetails" },
        { label: "Blog Posts", icon: BookOpen, to: "/dashboard/blogs" },
      ],
    },
    {
      title: "Fleet & Bookings",
      items: [
        { label: "All Bikes", icon: Bike, to: "/dashboard/bikes" },
        { label: "All Cars", icon: Car, to: "/dashboard/cars" },
        { label: "Bike Bookings", icon: CalendarDays, to: "/dashboard/bikeBookings" },
        { label: "Car Bookings", icon: Car, to: "/dashboard/carBookings" },
        { label: "Packages", icon: Package, to: "/dashboard/packages" },
        { label: "Package Bookings", icon: ClipboardList, to: "/dashboard/packageBookings" },
        { label: "Contact Messages", icon: Mail, to: "/dashboard/contact" },
      ],
    },
    {
      title: "Administration",
      items: [
        { label: "Agents / Vendors", icon: Users, to: "/dashboard/agents" },
      ],
    },
  ];

  const agentNav = [
    {
      title: "My Fleet Management",
      items: [
        { label: "My Bikes", icon: Bike, to: "/dashboard/bikes" },
        { label: "My Cars", icon: Car, to: "/dashboard/cars" },
        { label: "My Bike Bookings", icon: CalendarDays, to: "/dashboard/bikeBookings" },
        { label: "My Car Bookings", icon: Car, to: "/dashboard/carBookings" },
      ],
    },
  ];

  const navSections = superAdmin ? superAdminNav : agentNav;

  return (
    <div className={`relative min-h-screen antialiased ${dark ? "dark" : ""}`}>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-800/80
          bg-[#1a2332] text-slate-300 shadow-xl transition-transform duration-200
          lg:static lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[var(--color-primary)]">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="text-base font-bold tracking-tight text-[var(--color-primary)]">
                {brandName}
              </span>
            </div>
          </div>

          {/* User info banner in sidebar */}
          <div className="border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                {superAdmin ? <ShieldCheck className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {user?.name || (superAdmin ? "Super Admin" : "Agent")}
                </p>
                <p className="truncate text-[10px] uppercase tracking-wider text-[var(--color-primary)]">
                  {superAdmin ? "Superadmin" : "Approved Agent"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-4 text-sm">
            {navSections.map((section) => (
              <div key={section.title} className="mb-4">
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                              isActive
                                ? "bg-white/10 text-white font-medium shadow-sm"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-90 text-[var(--color-primary)]" />
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/10 p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100 dark:bg-slate-950">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {superAdmin && <AgentButton />}

              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setDark((d) => !d)}
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
              >
                {fs ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>

              <div className="ml-1 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>{user?.name || (superAdmin ? "Super Admin" : "Agent")}</span>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

          <footer className="shrink-0 border-t border-slate-200/80 bg-white py-3 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            {footerYear} © {brandName} Pvt. Ltd.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
