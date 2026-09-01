import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router";
import {
  Car,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Fuel,
  Gauge,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Info,
} from "lucide-react";
import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import { focusFirstFormError, validatePhoneNumber, validateMinText } from "../lib/formValidation";
import { parseApiError } from "../lib/parseApiError";
import LoadingSpinner from "../components/LoadingSpinner";
import ProcessSection from "../components/ProcessSection";

const popularLocations = [
  "Kathmandu - Thamel Branch",
  "Tribhuvan International Airport (TIA)",
  "Pokhara - Lakeside Branch",
  "Chitwan - Sauraha",
  "Lalitpur - Jhamsikhel",
  "Bhaktapur City",
];

export default function CarBooking() {
  const [searchParams] = useSearchParams();
  const preSelectedCarId = searchParams.get("carId") || searchParams.get("car") || "";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [formData, setFormData] = useState({
    carId: "",
    fullName: "",
    email: "",
    phone: "",
    pickupLocation: "Kathmandu - Thamel Branch",
    dropoffLocation: "Kathmandu - Thamel Branch",
    pickupDate: "",
    returnDate: "",
    rentalOption: "self-drive",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Fetch cars list
  useEffect(() => {
    let mounted = true;
    async function loadCars() {
      setLoading(true);
      try {
        const res = await fetch(apiUrl("/api/bikes?isBike=0&public=1"));
        if (!res.ok) throw new Error("Failed to load cars list.");
        const data = await res.json();
        if (mounted) {
          const list = Array.isArray(data) ? data : [];
          setCars(list);

          // If preselected car ID or name is provided in query params
          if (preSelectedCarId && list.length > 0) {
            const matched = list.find(
              (c) =>
                String(c.id) === String(preSelectedCarId) ||
                c.name?.toLowerCase() === preSelectedCarId.toLowerCase()
            );
            if (matched) {
              setFormData((prev) => ({ ...prev, carId: String(matched.id) }));
            } else if (list[0]) {
              setFormData((prev) => ({ ...prev, carId: String(list[0].id) }));
            }
          } else if (list.length > 0 && !formData.carId) {
            setFormData((prev) => ({ ...prev, carId: String(list[0].id) }));
          }
        }
      } catch (err) {
        if (mounted) setFetchError(err.message || "Failed to load cars.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCars();
    return () => {
      mounted = false;
    };
  }, [preSelectedCarId]);

  // Selected car object
  const selectedCar = useMemo(() => {
    return cars.find((c) => String(c.id) === String(formData.carId)) || null;
  }, [cars, formData.carId]);

  // Calculate rental days & estimated total
  const rentalSummary = useMemo(() => {
    if (!formData.pickupDate || !formData.returnDate) {
      return { days: 0, total: 0 };
    }
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const diffTime = end - start;
    if (diffTime < 0) return { days: 0, total: 0 };
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const dailyPrice = Number(selectedCar?.pricePerDay || selectedCar?.price || 0);
    return {
      days: diffDays,
      total: diffDays * dailyPrice,
    };
  }, [formData.pickupDate, formData.returnDate, selectedCar]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.carId) {
      errs.carId = "Please select a car.";
    }
    const nameErr = validateMinText(formData.fullName, "Full name");
    if (nameErr) errs.fullName = nameErr;

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const phoneErr = validatePhoneNumber(formData.phone);
    if (phoneErr) errs.phone = phoneErr;

    if (!formData.pickupLocation.trim()) {
      errs.pickupLocation = "Pickup location is required.";
    }
    if (!formData.dropoffLocation.trim()) {
      errs.dropoffLocation = "Dropoff location is required.";
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (!formData.pickupDate) {
      errs.pickupDate = "Pickup date is required.";
    } else {
      const pickup = new Date(formData.pickupDate);
      if (pickup < todayStart) {
        errs.pickupDate = "Pickup date cannot be in the past.";
      }
    }

    if (!formData.returnDate) {
      errs.returnDate = "Return date is required.";
    } else {
      const returnD = new Date(formData.returnDate);
      if (returnD < todayStart) {
        errs.returnDate = "Return date cannot be in the past.";
      }
    }

    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.returnDate);
      if (dropoff < pickup) {
        errs.returnDate = "Return date must be on or after pickup date.";
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      focusFirstFormError(e.currentTarget);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const combinedMessage = [
        formData.rentalOption ? `[Option: ${formData.rentalOption}]` : "",
        formData.message ? formData.message.trim() : "",
      ]
        .filter(Boolean)
        .join(" ");

      const res = await fetch(apiUrl("/api/bike-bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bike: formData.carId,
          customerName: formData.fullName.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          pickupLocation: formData.pickupLocation.trim(),
          returnLocation: formData.dropoffLocation.trim(),
          pickupDate: formData.pickupDate,
          returnDate: formData.returnDate,
          message: combinedMessage,
        }),
      });

      if (!res.ok) {
        throw new Error(await parseApiError(res));
      }

      const bookedData = await res.json();
      setBookingSuccess({
        ...bookedData,
        carName: selectedCar?.name || "Car",
        carImage: selectedCar?.image || "",
        totalDays: rentalSummary.days,
        estimatedTotal: rentalSummary.total,
      });

      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.message || "Failed to complete car booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(222,135,60,0.25),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              Dedicated Car Booking
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Book Your Car in Nepal
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Reserve premium SUVs, sedans, hatchbacks, and 4x4 vehicles for road trips, family tours, airport pickups, and business travel.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Instant Confirmation
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                Verified Partner Fleet
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-400" />
                24/7 Roadside Assistance
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Booking Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {bookingSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl dark:border-emerald-900/40 dark:bg-slate-900"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              Car Booking Request Submitted!
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Thank you, <span className="font-semibold text-slate-900 dark:text-white">{formData.fullName}</span>. Your car booking request has been recorded. Our team will contact you shortly to confirm your booking and arrange pickup.
            </p>

            {/* Booking Summary Box */}
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-xs dark:border-slate-800 dark:bg-slate-800/50">
              <h3 className="font-bold uppercase tracking-wider text-slate-400">
                Reservation Summary
              </h3>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-slate-500">Reserved Vehicle:</span>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {bookingSuccess.carName}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Booking Reference:</span>
                  <p className="font-mono font-semibold text-slate-900 dark:text-white">
                    #CAR-{bookingSuccess.id || Math.floor(1000 + Math.random() * 9000)}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Pickup Date:</span>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {formData.pickupDate} ({formData.pickupLocation})
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Return Date:</span>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {formData.returnDate} ({formData.dropoffLocation})
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">Customer Contact:</span>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {formData.phone} • {formData.email}
                  </p>
                </div>

                {rentalSummary.days > 0 && (
                  <div>
                    <span className="text-slate-500">Estimated Total:</span>
                    <p className="text-sm font-bold text-[var(--color-primary)]">
                      Rs. {rentalSummary.total.toLocaleString()} ({rentalSummary.days} Days)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setBookingSuccess(null);
                  setFormData((prev) => ({
                    ...prev,
                    fullName: "",
                    email: "",
                    phone: "",
                    message: "",
                    pickupDate: "",
                    returnDate: "",
                  }));
                }}
                className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Book Another Car
              </button>

              <Link
                to="/cars"
                className="rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Explore More Fleet
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left: Car Picker & Specs Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Selected Car Details Box */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    Selected Vehicle
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedCar?.name || "Select a car from below"}
                  </h3>
                  {selectedCar?.model && (
                    <p className="text-xs text-slate-500">
                      {selectedCar.model} {selectedCar.color ? `• ${selectedCar.color}` : ""}
                    </p>
                  )}
                </div>

                <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {selectedCar?.image ? (
                    <img
                      src={getHighResImage(selectedCar.image, 800)}
                      alt={selectedCar?.name || "Car"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <Car className="h-16 w-16" />
                    </div>
                  )}

                  {selectedCar && (
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        Rs. {Number(selectedCar.pricePerDay || selectedCar.price || 0).toLocaleString()} / Day
                      </span>
                    </div>
                  )}
                </div>

                {/* Specs */}
                {selectedCar && (
                  <div className="grid grid-cols-2 gap-3 p-5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-[var(--color-primary)]" />
                      <span>Mileage: {selectedCar.mileage ? `${selectedCar.mileage} km/l` : "Standard"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-[var(--color-primary)]" />
                      <span>Capacity: {selectedCar.engineCapacity ? `${selectedCar.engineCapacity} cc` : "Standard"}</span>
                    </div>
                    {selectedCar.ownerName && (
                      <div className="col-span-2 flex items-center gap-2 text-slate-500">
                        <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                        <span>Managed by: <strong>{selectedCar.ownerName}</strong></span>
                      </div>
                    )}
                    {selectedCar.id && (
                      <div className="col-span-2 pt-1">
                        <Link
                          to={`/bike-details/${selectedCar.id}`}
                          className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
                        >
                          View full car specifications & taken photos
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Car Switcher Grid */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  Available Cars in Fleet ({cars.length})
                </h4>

                {loading ? (
                  <LoadingSpinner label="Loading fleet..." size="sm" />
                ) : fetchError ? (
                  <p className="text-xs text-red-500">{fetchError}</p>
                ) : cars.length === 0 ? (
                  <p className="text-xs text-slate-400">No cars currently available.</p>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {cars.map((car) => {
                      const isSelected = String(car.id) === String(formData.carId);
                      const price = Number(car.pricePerDay || car.price || 0);
                      return (
                        <button
                          key={car.id}
                          type="button"
                          onClick={() => updateField("carId", String(car.id))}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                            isSelected
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 dark:border-[var(--color-primary)]"
                              : "border-slate-100 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                          }`}
                        >
                          <img
                            src={getHighResImage(car.image, 200) || "https://via.placeholder.com/100"}
                            alt={car.name}
                            className="h-12 w-16 object-cover rounded-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {car.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {car.model || "Car"} {car.color ? `• ${car.color}` : ""}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-[var(--color-primary)]">
                              Rs. {price.toLocaleString()}
                            </span>
                            <span className="block text-[10px] text-slate-400">/day</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Booking Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
                <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Car Reservation Form
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Fill in your travel dates and contact information to confirm your car booking.
                  </p>
                </div>

                {submitError && (
                  <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                  {/* Select Car Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Vehicle Selection *
                    </label>
                    <select
                      value={formData.carId}
                      onChange={(e) => updateField("carId", e.target.value)}
                      disabled={submitting || loading}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="" disabled>
                        {loading ? "Loading cars..." : "Choose a car"}
                      </option>
                      {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                          🚗 {car.name} — Rs. {Number(car.pricePerDay || car.price || 0).toLocaleString()}/day
                        </option>
                      ))}
                    </select>
                    {errors.carId && <p className="mt-1 text-xs text-red-500">{errors.carId}</p>}
                  </div>

                  {/* Trip Dates */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Pickup Date *
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) => updateField("pickupDate", e.target.value)}
                          disabled={submitting}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      {errors.pickupDate && (
                        <p className="mt-1 text-xs text-red-500">{errors.pickupDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Return Date *
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          type="date"
                          value={formData.returnDate}
                          onChange={(e) => updateField("returnDate", e.target.value)}
                          disabled={submitting}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      {errors.returnDate && (
                        <p className="mt-1 text-xs text-red-500">{errors.returnDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Pickup & Dropoff Locations */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Pickup Location *
                      </label>
                      <input
                        type="text"
                        value={formData.pickupLocation}
                        onChange={(e) => updateField("pickupLocation", e.target.value)}
                        placeholder="e.g. Thamel, KTM Airport, Pokhara"
                        disabled={submitting}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                      {errors.pickupLocation && (
                        <p className="mt-1 text-xs text-red-500">{errors.pickupLocation}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Dropoff Location *
                      </label>
                      <input
                        type="text"
                        value={formData.dropoffLocation}
                        onChange={(e) => updateField("dropoffLocation", e.target.value)}
                        placeholder="e.g. Same as pickup or Pokhara"
                        disabled={submitting}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                      {errors.dropoffLocation && (
                        <p className="mt-1 text-xs text-red-500">{errors.dropoffLocation}</p>
                      )}
                    </div>
                  </div>

                  {/* Popular location chips */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-slate-400 self-center">Popular:</span>
                    {popularLocations.slice(0, 4).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          updateField("pickupLocation", loc);
                          updateField("dropoffLocation", loc);
                        }}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {loc.split("-")[0].trim()}
                      </button>
                    ))}
                  </div>

                  {/* Personal Contact Details */}
                  <div className="grid gap-4 sm:grid-cols-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="sm:col-span-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Renter Information
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="John Doe"
                        disabled={submitting}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john@example.com"
                        disabled={submitting}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="98XXXXXXXX"
                        disabled={submitting}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Special Requests / Notes */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Special Requests / Travel Plan Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="e.g. Airport flight number, need child seat, destination plans..."
                      disabled={submitting}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Cost & Summary Preview */}
                  {rentalSummary.days > 0 && selectedCar && (
                    <div className="rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-4 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>Total Rental Duration:</span>
                        <span>{rentalSummary.days} {rentalSummary.days === 1 ? "Day" : "Days"}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span>Daily Rate:</span>
                        <span>Rs. {Number(selectedCar.pricePerDay || selectedCar.price || 0).toLocaleString()} / day</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-[var(--color-primary)]/20 pt-2 text-sm font-extrabold text-[var(--color-primary)]">
                        <span>Estimated Total:</span>
                        <span>Rs. {rentalSummary.total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-4 text-base font-bold text-white shadow-lg transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                    >
                      <Car className="h-5 w-5" />
                      {submitting ? "Processing Reservation..." : "Confirm & Reserve Car Now"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Booking Process Section */}
      <ProcessSection />
    </div>
  );
}
