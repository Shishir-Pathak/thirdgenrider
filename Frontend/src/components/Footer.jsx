import React from "react";
import { Clock3, Mail, MapPinned, Phone, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useCompanyDetails } from "../hooks/useCompanyDetails";

const Footer = () => {
  const { pathname } = useLocation();
  const { details } = useCompanyDetails();
  const brandName = details?.name || "Please provide CompanyName";
  const about = details?.about || "Please provide company details";
  const location = details?.location || "Please provide location";
  const email = details?.contactEmail || "Please provide email";
  const phone = details?.contactPhone || "Please provide phone number";
  const businessHours = details?.businessHours
    ? details.businessHours
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 5:00 PM",
        "Sunday: Closed",
      ];
  const quickLinks = [
    ["Home", "/"],
    ["About", "/about"],
    ["Bikes", "/bikes"],
    ["Packages", "/package"],
    ["Blog", "/blog"],
    ["Contact", "/contact"],
  ];

  const isActiveLink = (to) => {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(222,135,60,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.1fr] lg:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {brandName}
          </p>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
            About Us
          </h3>
          <p className="mt-4 max-w-md leading-7 text-slate-400">{about}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-5 space-y-1.5">
            {quickLinks.map(([label, to]) => {
              const active = isActiveLink(to);
              return (
              <li key={label}>
                <Link
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className={`group inline-flex w-full max-w-48 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-primary/15 text-primary ring-1 ring-primary/25"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <ChevronRight
                    className={`h-4 w-4 transition ${
                      active
                        ? "text-primary"
                        : "text-slate-600 group-hover:text-primary"
                    }`}
                  />
                  {label}
                </Link>
              </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Business Hours</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            {businessHours.map((line, index) => (
              <li key={`${line}-${index}`} className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Contact Info</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <MapPinned className="h-4 w-4" />
              </span>
              <p className="leading-6">{location}</p>
            </div>
            <a
              href={`mailto:${email}`}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-primary/35 hover:bg-white/[0.06] hover:text-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Mail className="h-4 w-4" />
              </span>
              <span className="leading-6">{email}</span>
            </a>
            <a
              href={`tel:${phone}`}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-primary/35 hover:bg-white/[0.06] hover:text-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Phone className="h-4 w-4" />
              </span>
              <span className="leading-6">{phone}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row">
          <p className="text-center text-sm text-slate-500 md:text-left">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="#"
              className="text-slate-500 transition hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-500 transition hover:text-primary"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
