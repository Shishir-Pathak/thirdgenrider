import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Car,
  CheckCircle2,
  Clock,
  Search,
  ShieldCheck,
  Fuel,
  Sparkles,
  ChevronRight,
  Gauge,
  SlidersHorizontal,
  RotateCcw,
  Camera,
  X,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import { useBooking } from "../context/BookingContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ProcessSection from "../components/ProcessSection";

const carCapacityOptions = [
  { label: "All Capacities", value: "all" },
  { label: "Under 1,200 cc (Hatchbacks / Compact)", value: "under-1200" },
  { label: "1,200 cc - 1,800 cc (Sedans & Compact SUVs)", value: "1200-1800" },
  { label: "1,800 cc - 2,500 cc (Mid-size SUVs)", value: "1800-2500" },
  { label: "Above 2,500 cc (Heavy 4x4 / Luxury)", value: "above-2500" },
];

const carPriceOptions = [
  { label: "Any Price", value: "all" },
  { label: "Under Rs. 4,000 / day", value: "under-4000" },
  { label: "Rs. 4,000 - Rs. 8,000 / day", value: "4000-8000" },
  { label: "Rs. 8,000 - Rs. 15,000 / day", value: "8000-15000" },
  { label: "Above Rs. 15,000 / day", value: "above-15000" },
];

const CarCard = ({ car, onBookNow }) => {
  const rawPrice = car?.price ?? car?.pricePerDay;
  const priceNum = Number(rawPrice);

  const priceDisplay = Number.isFinite(priceNum)
    ? `Rs ${priceNum.toLocaleString()} / Day`
    : "Price unavailable";

  const isBooked = Boolean(
    car?.isBooked || !car?.available || car?.activeBookingsCount > 0
  );
  const isAvailable = Boolean(
    car?.available && !car?.isBooked && car?.activeBookingsCount === 0
  );

  const takenCount = Array.isArray(car?.takenImages) ? car.takenImages.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={
            getHighResImage(car.image, 800) ||
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80"
          }
          alt={car.name}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Live Availability Badge */}
        <div className="absolute left-3 top-3 z-10">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Available Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
              <Clock className="h-3.5 w-3.5" />
              Currently Booked
            </span>
          )}
        </div>

        {/* Badges: Owner / Taken Photos */}
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
          {car.ownerName &&
            car.ownerName !== "Admin" &&
            car.ownerName !== "Super Admin" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-amber-300 shadow-md backdrop-blur-md">
                <ShieldCheck className="h-3 w-3" />
                {car.ownerName}
              </span>
            )}

          {takenCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 shadow-md backdrop-blur-md">
              <Camera className="h-3 w-3" />
              {takenCount} Taken {takenCount === 1 ? "Photo" : "Photos"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {car.name}
            </h3>
            {car.model && (
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                {car.model} {car.color ? `• ${car.color}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Car Specs */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>
              {car.mileage ? `${car.mileage} km/l` : "Standard mileage"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>
              {car.engineCapacity
                ? `${car.engineCapacity} cc`
                : "Standard engine"}
            </span>
          </div>
        </div>

        {/* Price Tag */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Rental Rate
            </span>
            <p className="text-lg font-extrabold text-[var(--color-primary)]">
              {priceDisplay}
            </p>
          </div>

          <Link
            to={`/bike-details/${car.id}`}
            className="text-xs font-semibold text-slate-500 hover:text-[var(--color-primary)] underline transition"
          >
            View Specs
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/bike-details/${car.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Details
          </Link>

          <Link
            to={`/car-booking?carId=${car.id}`}
            className={`inline-flex items-center justify-center rounded-xl py-2.5 px-3 text-xs font-semibold text-white shadow-md transition ${
              isAvailable
                ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isAvailable ? "Book Car" : "Book Dates"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { openBookingForm } = useBooking();

  useEffect(() => {
    let mounted = true;

    async function fetchCars() {
      try {
        const res = await fetch(apiUrl("/api/bikes?isBike=0&public=1"));
        if (!res.ok) throw new Error("Failed to fetch cars");
        const data = await res.json();
        if (mounted) setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCars();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCars = useMemo(() => {
    let list = [...cars];

    // 1. Availability filter
    if (availabilityFilter === "available") {
      list = list.filter(
        (c) => c.available && !c.isBooked && c.activeBookingsCount === 0
      );
    } else if (availabilityFilter === "booked") {
      list = list.filter(
        (c) => c.isBooked || !c.available || c.activeBookingsCount > 0
      );
    }

    // 2. Capacity filter
    if (capacityFilter === "under-1200") {
      list = list.filter((c) => Number(c.engineCapacity || 0) > 0 && Number(c.engineCapacity || 0) < 1200);
    } else if (capacityFilter === "1200-1800") {
      list = list.filter((c) => Number(c.engineCapacity || 0) >= 1200 && Number(c.engineCapacity || 0) <= 1800);
    } else if (capacityFilter === "1800-2500") {
      list = list.filter((c) => Number(c.engineCapacity || 0) > 1800 && Number(c.engineCapacity || 0) <= 2500);
    } else if (capacityFilter === "above-2500") {
      list = list.filter((c) => Number(c.engineCapacity || 0) > 2500);
    }

    // 3. Price filter
    if (priceFilter === "under-4000") {
      list = list.filter((c) => Number(c.pricePerDay || c.price || 0) < 4000);
    } else if (priceFilter === "4000-8000") {
      list = list.filter(
        (c) =>
          Number(c.pricePerDay || c.price || 0) >= 4000 &&
          Number(c.pricePerDay || c.price || 0) <= 8000
      );
    } else if (priceFilter === "8000-15000") {
      list = list.filter(
        (c) =>
          Number(c.pricePerDay || c.price || 0) > 8000 &&
          Number(c.pricePerDay || c.price || 0) <= 15000
      );
    } else if (priceFilter === "above-15000") {
      list = list.filter((c) => Number(c.pricePerDay || c.price || 0) > 15000);
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.model || "").toLowerCase().includes(q) ||
          (c.color || "").toLowerCase().includes(q) ||
          (c.plateNumber || "").toLowerCase().includes(q) ||
          (c.ownerName || "").toLowerCase().includes(q)
      );
    }

    // 5. Sort
    if (sortBy === "price-low") {
      list.sort(
        (a, b) =>
          Number(a.pricePerDay || a.price || 0) -
          Number(b.pricePerDay || b.price || 0)
      );
    } else if (sortBy === "price-high") {
      list.sort(
        (a, b) =>
          Number(b.pricePerDay || b.price || 0) -
          Number(a.pricePerDay || a.price || 0)
      );
    } else if (sortBy === "capacity-high") {
      list.sort(
        (a, b) =>
          Number(b.engineCapacity || 0) - Number(a.engineCapacity || 0)
      );
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [cars, availabilityFilter, capacityFilter, priceFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    availabilityFilter !== "all" ||
    capacityFilter !== "all" ||
    priceFilter !== "all" ||
    sortBy !== "default";

  const clearAllFilters = () => {
    setSearchQuery("");
    setAvailabilityFilter("all");
    setCapacityFilter("all");
    setPriceFilter("all");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-18 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(222,135,60,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              Car Rental Service
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
              Explore Nepal in Comfort
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-xl">
              Rent reliable SUVs, sedans, hatchbacks, and luxury 4x4 cars from verified owners and partners across Nepal.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/car-booking"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[var(--color-primary-dark)]"
              >
                <Car className="h-5 w-5" />
                Book a Car Online
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#fleet"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Browse Fleet ({cars.length})
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fleet Filter & Listing Section */}
      <section id="fleet" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Section Header & Controls */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                Our Car Rental Fleet
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Showing {filteredCars.length} of {cars.length} cars available
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars by name, model..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Availability Tabs */}
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    availabilityFilter === "all"
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  All ({cars.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter("available")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    availabilityFilter === "available"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter("booked")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    availabilityFilter === "booked"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Booked
                </button>
              </div>

              {/* Toggle Filters Button */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  showAdvancedFilters || capacityFilter !== "all" || priceFilter !== "all"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {(capacityFilter !== "all" || priceFilter !== "all") && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>

              {/* Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none focus:border-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="default">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity-high">Engine CC: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Advanced Filter Bar (Collapsible) */}
          {showAdvancedFilters && (
            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 md:grid-cols-3 dark:border-slate-800">
              {/* Engine Capacity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Engine Capacity
                </label>
                <select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {carCapacityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Price Range
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {carPriceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Reset */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Active Filters:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                  &quot;{searchQuery}&quot;
                  <button type="button" onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {availabilityFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Status: {availabilityFilter}
                  <button type="button" onClick={() => setAvailabilityFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {capacityFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  Capacity: {carCapacityOptions.find((c) => c.value === capacityFilter)?.label.split("(")[0]}
                  <button type="button" onClick={() => setCapacityFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {priceFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Price: {carPriceOptions.find((p) => p.value === priceFilter)?.label}
                  <button type="button" onClick={() => setPriceFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-red-500 hover:underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Cars Grid */}
        <div className="mt-10">
          {loading ? (
            <div className="py-24 text-center">
              <LoadingSpinner label="Loading car fleet..." size="lg" />
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <Car className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
                No cars match your filters
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {hasActiveFilters
                  ? "Try loosening your search criteria or resetting filters."
                  : "New cars are being added to our fleet. Check back soon!"}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-xs font-semibold text-white"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onBookNow={openBookingForm}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <ProcessSection />
    </div>
  );
}
