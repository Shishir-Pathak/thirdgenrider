import React from "react";
import { Link, NavLink } from "react-router";
import { useCompanyDetails } from "../hooks/useCompanyDetails";
import { useBooking } from "../context/BookingContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Bikes", to: "/bikes" },
  { label: "Cars", to: "/cars" },
  { label: "Package", to: "/package" },
  { label: "Service", to: "/service" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { details } = useCompanyDetails();
  const { openBookingForm } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brandName = details?.name || "Third Generation Rider Pvt. Ltd.";
  const logoUrl = details?.logo || "/ThirdGenRider.png";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="w-full border-b border-slate-200 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logoUrl}
            alt={brandName}
            className="h-14 w-auto shrink-0 max-w-[200px] object-contain"
          />
        </Link>

        {/* Nav Links */}
        <ul className="hidden lg:flex items-center gap-8 xl:gap-10 text-[16px] xl:text-[18px] font-medium">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `transition ${
                    isActive
                      ? "text-(--color-primary) hover:text-(--color-primary-dark)"
                      : "text-black hover:text-(--color-primary)"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <button
            type="button"
            onClick={() => openBookingForm()}
            className="inline-flex items-center justify-center rounded-full bg-(--color-primary) px-6 py-3 font-semibold text-white transition hover:bg-(--color-primary-dark)"
          >
            Book Now
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-slate-900 shadow-sm transition hover:bg-slate-50 lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-background lg:hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
            <ul className="grid gap-3 text-base font-medium text-slate-900">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 transition ${
                        isActive
                          ? "bg-primary/10 text-(--color-primary)"
                          : "hover:bg-slate-50 hover:text-(--color-primary)"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                openBookingForm();
              }}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-(--color-primary) px-6 py-3 font-semibold text-white transition hover:bg-(--color-primary-dark)"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
