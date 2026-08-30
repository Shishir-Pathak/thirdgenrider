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
        <div className="mb-6">
          <Link
            to={isCar ? "/cars" : "/bikes"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[var(--color-primary)] transition dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All {isCar ? "Cars" : "Bikes"}
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {bike.image ? (
              <img
                src={bike.image}
                alt={bike.name}
                className="h-[280px] w-full object-cover sm:h-[420px]"
              />
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
                {bike.available ? "Available" : "Unavailable"}
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

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => openBookingForm(bike.name)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--color-primary-dark)]"
              >
                {isCar ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                Book This {typeLabel} Now
              </button>
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
    </section>
  );
}
