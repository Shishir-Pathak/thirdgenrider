import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  Bike,
  Car,
  Calendar,
  CheckCircle2,
  Gauge,
  Hash,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  Fuel,
  Camera,
  Maximize2,
  X,
  Sparkles,
} from "lucide-react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";
import LoadingSpinner from "../components/LoadingSpinner";
import { useBooking } from "../context/BookingContext";

const detailLabels = {
  model: "Model",
  color: "Color",
  plateNumber: "Plate number",
  chassisNumber: "Chassis number",
  engineNumber: "Engine number",
  mileage: "Mileage",
  engineCapacity: "Engine capacity",
  blueBookNumber: "Blue book number",
};

function formatDetail(key, value) {
  if (value === "" || value === null || value === undefined) return "-";
  if (key === "mileage") return `${value} km/l`;
  if (key === "engineCapacity") return `${value} cc`;
  return value;
}

export default function BikeDetails() {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const { openBookingForm } = useBooking();

  useEffect(() => {
    let cancelled = false;

    async function loadBike() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(apiUrl(`/api/bikes/${bikeId}`));
        if (!res.ok) throw new Error(await parseApiError(res));
        const data = await res.json();
        if (!cancelled) setBike(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load vehicle details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBike();
    return () => {
      cancelled = true;
    };
  }, [bikeId]);

  const details = useMemo(() => {
    if (!bike) return [];
    return Object.entries(detailLabels).map(([key, label]) => ({
      key,
      label,
      value: formatDetail(key, bike[key]),
    }));
  }, [bike]);

  const isCar = bike && !bike.isBike;
  const typeLabel = isCar ? "Car" : "Bike";

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-20 dark:bg-slate-950">
        <LoadingSpinner label={`Loading ${typeLabel.toLowerCase()} details...`} size="lg" />
      </section>
    );
  }

  if (error || !bike) {
    return (
      <section className="min-h-[60vh] bg-slate-50 px-4 py-20 text-center dark:bg-slate-950">
        <p className="text-lg font-semibold text-slate-800 dark:text-white">Vehicle details unavailable</p>
        <p className="mt-2 text-sm text-slate-500">{error || "Vehicle not found."}</p>
        <Link
          to={isCar ? "/cars" : "/bikes"}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {isCar ? "Cars" : "Bikes"}
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-8 sm:py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={isCar ? "/cars" : "/bikes"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[var(--color-primary)] transition dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All {isCar ? "Cars" : "Bikes"}
          </Link>

          {isCar && (
            <Link
              to={`/car-booking?carId=${bike.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              Open Dedicated Car Booking Page
            </Link>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {bike.image ? (
              <div className="relative group cursor-pointer" onClick={() => setPreviewImage({ url: bike.image, title: bike.name })}>
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="h-[280px] w-full object-cover sm:h-[420px] transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 backdrop-blur-sm">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center bg-slate-100 text-slate-400 sm:h-[420px] dark:bg-slate-800">
                {isCar ? (
                  <Car className="h-16 w-16" aria-hidden="true" />
                ) : (
                  <Bike className="h-16 w-16" aria-hidden="true" />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                  bike.available
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                }`}
              >
                {bike.available ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                )}
                {bike.available ? "Available Now" : "Unavailable"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {isCar ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                {typeLabel}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3.5 py-1 text-sm font-bold text-[var(--color-primary)]">
                Rs. {bike.price} / day
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl dark:text-white">
              {bike.name}
            </h1>

            {bike.ownerName && bike.ownerName !== "Admin" && bike.ownerName !== "Super Admin" && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                Provided by: <span className="font-semibold">{bike.ownerName}</span>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {details.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                  <div className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking action buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openBookingForm(bike.name)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--color-primary-dark)]"
              >
                {isCar ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                Quick Book {typeLabel}
              </button>

              {isCar && (
                <Link
                  to={`/car-booking?carId=${bike.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/10 px-5 py-3.5 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/20"
                >
                  Full Booking Page
                </Link>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Hash className="h-4 w-4" aria-hidden="true" />
                ID: #{bike.id}
              </span>
              {bike.createdAt && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Added {new Date(bike.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Taken Photos Section (Extra Public Photo Gallery) */}
        {bike.takenImages && bike.takenImages.length > 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[var(--color-primary)]" />
                  <h2 className="text-xl font-bold tracking-normal text-slate-950 dark:text-white">
                    Taken Photos ({bike.takenImages.length})
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Real photos taken of this {typeLabel.toLowerCase()} from different angles. Click any image to view in full resolution.
                </p>
              </div>
              <span className="self-start sm:self-center inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Verified Condition Photos
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bike.takenImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  onClick={() => setPreviewImage({ url: imageUrl, title: `${bike.name} - Taken Photo ${index + 1}` })}
                  className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <img
                    src={imageUrl}
                    alt={`${bike.name} taken photo ${index + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                    <span>Photo #{index + 1}</span>
                    <Maximize2 className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* License Document */}
        {bike.licenseImage && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold tracking-normal text-slate-950 dark:text-white">
              License Document
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              <a href={bike.licenseImage} target="_blank" rel="noreferrer">
                <img
                  src={bike.licenseImage}
                  alt={`${bike.name} license`}
                  className="h-72 w-full object-contain p-3"
                />
              </a>
            </div>
          </div>
        )}

        {/* Bluebook Documents */}
        {bike.blueBookImages?.length > 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold tracking-normal text-slate-950 dark:text-white">
              Bluebook Documents
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {bike.blueBookImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800"
                >
                  <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                    Bluebook Page {index + 1}
                  </div>
                  <a href={imageUrl} target="_blank" rel="noreferrer">
                    <img
                      src={imageUrl}
                      alt={`${bike.name} bluebook ${index + 1}`}
                      className="h-72 w-full object-contain p-3"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Image Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-black"
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.title || "Full Preview"}
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
            {previewImage.title && (
              <p className="bg-black/80 py-2 text-center text-xs font-semibold text-white">
                {previewImage.title}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
