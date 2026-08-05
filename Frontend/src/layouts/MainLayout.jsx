import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Phone, MessageCircleMore } from "lucide-react";
import BookingFormModal from "../components/BookingFormModal";
import PackageBookingFormModal from "../components/PackageBookingFormModal";
import { useCompanyDetails } from "../hooks/useCompanyDetails";

const MainLayout = () => {
  const { details } = useCompanyDetails();
  const phoneNumber = details?.contactPhone || "";
  const whatsappNumber = (details?.whatsapp || "").replace(/\D/g, "");

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* Floating Buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6 sm:flex-row sm:gap-3">
        {phoneNumber && (
          <a
            href={`tel:${phoneNumber}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-(--color-primary-dark) sm:px-6 sm:text-base"
          >
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Call Us</span>
          </a>
        )}

        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-green-600 sm:px-6 sm:text-base"
          >
            <MessageCircleMore className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        )}
      </div>
      <BookingFormModal />
      <PackageBookingFormModal />
      <Footer />
    </div>
  );
};

export default MainLayout;
