import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import { useBooking } from "../context/BookingContext";
import LoadingSpinner from "./LoadingSpinner";

const VehicleCard = ({ vehicle, onBookNow }) => {
  const rawPrice = vehicle?.price ?? vehicle?.pricePerDay;
  const priceNum = Number(rawPrice);

  const priceDisplay = Number.isFinite(priceNum)
    ? `Rs ${priceNum.toLocaleString()} / Day`
    : "Price unavailable";

  const isBooked = Boolean(vehicle?.isBooked || !vehicle?.available || vehicle?.activeBookingsCount > 0);
  const isAvailable = Boolean(vehicle?.available && !vehicle?.isBooked && vehicle?.activeBookingsCount === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={
            getHighResImage(vehicle.image, 800) ||
            "https://via.placeholder.com/800x533?text=No+Image"
          }
          alt={vehicle.name}
          className="h-72 w-full object-cover transition duration-300 hover:scale-105"
        />

        {/* Live Booking / Availability Badge */}
        <div className="absolute left-3 top-3 z-10">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
              <Clock className="h-3.5 w-3.5" />
              Currently Booked
            </span>
          )}
        </div>

        {/* Owner / Vendor info badge if available */}
        {vehicle.ownerName && vehicle.ownerName !== "Admin" && vehicle.ownerName !== "Super Admin" && (
          <div className="absolute right-3 top-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-amber-300 shadow-md backdrop-blur-md">
              <ShieldCheck className="h-3 w-3" />
              {vehicle.ownerName}
            </span>
          </div>
        )}
      </div>

      <div className="px-2 pt-4 pb-2 text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {vehicle.name}
        </h3>

        {vehicle.model && (
          <p className="mt-1 text-xs font-medium text-slate-500">
            {vehicle.model} {vehicle.plateNumber ? `• ${vehicle.plateNumber}` : ""}
          </p>
        )}

        <div className="mx-auto mt-3 max-w-72 rounded-full bg-slate-100 px-4 py-1.5 text-base font-bold text-[var(--color-primary)] dark:bg-slate-800">
          {priceDisplay}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => onBookNow(vehicle?.name || "")}
            className={`w-full rounded-xl py-2.5 px-6 font-semibold text-white shadow-md transition duration-300 ${
              isAvailable
                ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isAvailable ? "Book Now" : "Book for Upcoming Dates"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const VechileCategories = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { openBookingForm } = useBooking();

  useEffect(() => {
    let mounted = true;

    async function fetchBikes() {
      try {
        const res = await fetch(apiUrl("/api/bikes?public=1"));
        if (!res.ok) throw new Error("Failed to fetch bikes");
        const data = await res.json();
        if (mounted) setBikes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBikes();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-white">
            Vehicle Categories
          </h2>

          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Browse our selection of verified vehicles from our team and approved partner agents.
          </p>
        </div>

        {/* Navigation Buttons and Swiper Carousel */}
        <div className="relative mt-10">
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-xl hover:bg-[var(--color-primary-dark)] transition-all duration-300"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-xl hover:bg-[var(--color-primary-dark)] transition-all duration-300"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>

          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={24}
            observer={true}
            observeParents={true}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                if (swiper?.navigation) {
                  swiper.navigation.destroy?.();
                  swiper.navigation.init?.();
                  swiper.navigation.update?.();
                }
              }, 0);
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {loading ? (
              <SwiperSlide>
                <LoadingSpinner label="Loading fleet..." className="py-12" />
              </SwiperSlide>
            ) : bikes.length === 0 ? (
              <SwiperSlide>
                <div className="py-12 text-center text-slate-500">
                  No vehicles currently available.
                </div>
              </SwiperSlide>
            ) : (
              bikes.map((vehicle) => (
                <SwiperSlide
                  key={vehicle.id || vehicle.name}
                  className="h-auto pb-4"
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onBookNow={openBookingForm}
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default VechileCategories;