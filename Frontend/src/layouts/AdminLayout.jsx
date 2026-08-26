import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { clearDashboardAuthenticated } from "../lib/dashboardAuth";
import {
  Bike,
  Building2,
  LayoutDashboard,
  Image as ImageIcon,
  Info,
  Wrench,
  Package,
  BookOpen,
  Sparkles,
  MessageSquareQuote,
  Hash,
  CalendarDays,
  Mail,
  MapPin,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  Maximize,
  Minimize,
  ClipboardList,
  Car,
} from "lucide-react";

import AgentButton from "../components/dashboard/AgentButton";

const brandName = "Third Generation Rider Pvt. Ltd.";
const footerYear = new Date().getFullYear();

const navSections = [
  {
    title: "Dashboard",
    items: [
      { label: "Home Page", icon: ImageIcon, to: "/dashboard/home" },
      { label: "About Page", icon: Info, to: "/dashboard/about" },
      { label: "Service Page", icon: Wrench, to: "/dashboard/service" },
      { label: "Bikes", icon: Bike, to: "/dashboard/bikes" },
      {
        label: "Cars",
        icon: Car,
        to: "/dashboard/cars",
      },
      {
        label: "Bike Bookings",
        icon: CalendarDays,
        to: "/dashboard/bikeBookings",
      },
      {
        label: "Company Details",
        icon: Building2,
        to: "/dashboard/companyDetails",
      },
      { label: "Packages", icon: Package, to: "/dashboard/packages" },
      {
        label: "Package Bookings",
        icon: ClipboardList,
        to: "/dashboard/packageBookings",
      },
      {
        label: "Contact Message",
        icon: Mail,
        to: "/dashboard/contact",
      },
      { label: "Blog Posts", icon: BookOpen, to: "/dashboard/blogs" },
    ],
  },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [fs, setFs] = useState(false);

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
          fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-slate-800/80
          bg-[#1a2332] text-slate-300 shadow-xl transition-transform duration-200
          lg:static lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        >
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-(--color-primary)">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-(--color-primary)">
              {brandName}
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-4 text-sm">
            {navSections.map((section) => (
              <div key={section.title}>
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
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-90" />
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
            <Link
              to="/dashboard/login"
              onClick={clearDashboardAuthenticated}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
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
            <div className="flex items-center gap-1 sm:gap-2">
              <AgentButton />
              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setDark((d) => !d)}
                aria-label="Toggle theme"
              >
                {dark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
              >
                {fs ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
              <div className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-[9px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                user
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

          <footer className="shrink-0 border-t border-slate-200/80 bg-white py-3 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            {footerYear} © {brandName}
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
