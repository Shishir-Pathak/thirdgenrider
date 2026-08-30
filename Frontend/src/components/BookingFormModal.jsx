import { useEffect, useState } from "react";
import Modal from "./dashboard/Modal";
import { useBooking } from "../context/BookingContext";
import { apiUrl } from "../lib/api";
import { focusFirstFormError, validatePhoneNumber, validateMinText } from "../lib/formValidation";
import { parseApiError } from "../lib/parseApiError";

const initialForm = {
  bike: "",
  fullName: "",
  email: "",
  phone: "",
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  returnDate: "",
  message: "",
};

function validateBookingForm(values) {
  const errors = {};
  if (!String(values.bike ?? "").trim()) {
    errors.bike = "Please select a vehicle.";
  }
  const nameError = validateMinText(values.fullName, "Full name");
  if (nameError) errors.fullName = nameError;

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const phoneError = validatePhoneNumber(values.phone);
  if (phoneError) errors.phone = phoneError;

  if (!values.pickupLocation.trim()) {
    errors.pickupLocation = "Pickup location is required.";
  }
  if (!values.dropoffLocation.trim()) {
    errors.dropoffLocation = "Dropoff location is required.";
  }
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (!values.pickupDate) {
    errors.pickupDate = "Pickup date is required.";
  } else {
    const pickup = new Date(values.pickupDate);
    if (pickup < todayStart) {
      errors.pickupDate = "Pickup date cannot be in the past.";
    }
  }

  if (!values.returnDate) {
    errors.returnDate = "Return date is required.";
  } else {
    const returnD = new Date(values.returnDate);
    if (returnD < todayStart) {
      errors.returnDate = "Return date cannot be in the past.";
    }
  }

  if (values.pickupDate && values.returnDate) {
    const pickup = new Date(values.pickupDate);
    const dropoff = new Date(values.returnDate);
    if (dropoff < pickup) {
      errors.returnDate = "Return date must be after pickup date.";
    }
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p data-field-error tabIndex={-1} className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

export default function BookingFormModal() {
  const { isBookingOpen, selectedBike, closeBookingForm } = useBooking();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bikeOptions, setBikeOptions] = useState([]);
  const [loadingBikes, setLoadingBikes] = useState(false);

  const carOptions = bikeOptions.filter((b) => !b.isBike);
  const twoWheelerOptions = bikeOptions.filter((b) => b.isBike);

  useEffect(() => {
    if (!isBookingOpen) return;

    setForm({
      ...initialForm,
      bike:
        typeof selectedBike === "string"
          ? selectedBike
          : selectedBike?.id || selectedBike?._id || "",
    });

    setErrors({});
    setSuccessMsg("");
    setSubmitError("");
    setBookingSuccess(false);
  }, [isBookingOpen, selectedBike]);

  useEffect(() => {
    if (!isBookingOpen) return;

    let mounted = true;
    const loadBikes = async () => {
      setLoadingBikes(true);
      try {
        const res = await fetch(apiUrl("/api/bikes?public=1"));
        if (!res.ok) throw new Error("Failed to load vehicles");
        const data = await res.json();
        if (!mounted) return;
        const bikes = Array.isArray(data) ? data : [];
        setBikeOptions(bikes);
        if (selectedBike && typeof selectedBike === "string") {
          const match = bikes.find(
            (b) =>
              b.name?.toLowerCase() === selectedBike.toLowerCase() ||
              String(b.id) === String(selectedBike)
          );

          if (match) {
            setForm((prev) => ({
              ...prev,
              bike: String(match.id || match._id || ""),
            }));
          }
        }
      } catch {
        if (!mounted) return;
        setBikeOptions([]);
      } finally {
        if (mounted) setLoadingBikes(false);
      }
    };

    loadBikes();
    return () => {
      mounted = false;
    };
  }, [isBookingOpen, selectedBike]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateBookingForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstFormError(e.currentTarget);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSuccessMsg("");
    try {
      const res = await fetch(apiUrl("/api/bike-bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bike: form.bike,
          customerName: form.fullName.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
          pickupLocation: form.pickupLocation.trim(),
          returnLocation: form.dropoffLocation.trim(),
          pickupDate: form.pickupDate,
          returnDate: form.returnDate,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      setSuccessMsg(
        "Booking details submitted successfully. We will contact you soon."
      );
      setBookingSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={isBookingOpen}
      onClose={closeBookingForm}
      titleId="booking-form-title"
      title="Book a Vehicle"
      panelClassName="max-w-3xl"
    >
      {bookingSuccess ? (
        <div className="py-10 text-center">
          <p className="text-lg font-semibold text-green-600">
            Booking details submitted successfully.
            <br />
            We will contact you shortly to confirm your reservation.
          </p>

          <button
            type="button"
            onClick={closeBookingForm}
            className="mt-6 rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white"
          >
            OK
          </button>
        </div>
      ) : (
        <form className="mt-4 space-y-4" onSubmit={onSubmit} noValidate>
          {successMsg && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {successMsg}
            </p>
          )}

          {submitError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="booking-bike"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Select Vehicle
              </label>
              <select
                id="booking-bike"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                value={form.bike}
                onChange={(e) => updateField("bike", e.target.value)}
                disabled={submitting}
                required
              >
                <option value="" disabled>
                  {loadingBikes ? "Loading fleet..." : "Choose your vehicle"}
                </option>
                {carOptions.length > 0 && (
                  <optgroup label="Cars & SUVs">
                    {carOptions.map((car) => {
                      const carName = car?.name || "";
                      const carId = String(car?.id || car?._id || carName);
                      const price = car.pricePerDay || car.price;
                      return (
                        <option key={carId} value={carId}>
                          🚗 {carName} {price ? `(Rs. ${Number(price).toLocaleString()}/day)` : ""}
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                {twoWheelerOptions.length > 0 && (
                  <optgroup label="Bikes & Scooters">
                    {twoWheelerOptions.map((bike) => {
                      const bikeName = bike?.name || "";
                      const bikeId = String(bike?.id || bike?._id || bikeName);
                      const price = bike.pricePerDay || bike.price;
                      return (
                        <option key={bikeId} value={bikeId}>
                          🏍️ {bikeName} {price ? `(Rs. ${Number(price).toLocaleString()}/day)` : ""}
                        </option>
                      );
                    })}
                  </optgroup>
                )}
              </select>
              <FieldError message={errors.bike} />
            </div>

            <div>
              <label
                htmlFor="booking-full-name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Full Name
              </label>
              <input
                id="booking-full-name"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Enter your name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                disabled={submitting}
                required
              />
              <FieldError message={errors.fullName} />
            </div>

            <div>
              <label
                htmlFor="booking-email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="booking-email"
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                disabled={submitting}
                required
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <label
                htmlFor="booking-phone"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Phone
              </label>
              <input
                id="booking-phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                disabled={submitting}
                required
              />
              <FieldError message={errors.phone} />
            </div>

            <div>
              <label
                htmlFor="booking-pickup-location"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Pickup Location
              </label>
              <input
                id="booking-pickup-location"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Pickup location"
                value={form.pickupLocation}
                onChange={(e) => updateField("pickupLocation", e.target.value)}
                disabled={submitting}
                required
              />
              <FieldError message={errors.pickupLocation} />
            </div>

            <div>
              <label
                htmlFor="booking-dropoff-location"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Dropoff Location
              </label>
              <input
                id="booking-dropoff-location"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Dropoff location"
                value={form.dropoffLocation}
                onChange={(e) => updateField("dropoffLocation", e.target.value)}
                disabled={submitting}
                required
              />
              <FieldError message={errors.dropoffLocation} />
            </div>

            <div>
              <label
                htmlFor="booking-pickup-date"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Pickup Date
              </label>
              <input
                id="booking-pickup-date"
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                value={form.pickupDate}
                onChange={(e) => updateField("pickupDate", e.target.value)}
                disabled={submitting}
                required
              />
              <FieldError message={errors.pickupDate} />
            </div>

            <div>
              <label
                htmlFor="booking-return-date"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Return Date
              </label>
              <input
                id="booking-return-date"
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                value={form.returnDate}
                onChange={(e) => updateField("returnDate", e.target.value)}
                disabled={submitting}
                required
              />
              <FieldError message={errors.returnDate} />
            </div>
          </div>

          <div>
            <label
              htmlFor="booking-message"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Additional Message / Notes
            </label>
            <textarea
              id="booking-message"
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Any special requests or inquiries..."
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeBookingForm}
              disabled={submitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
            >
              {submitting ? "Submitting..." : "Submit Booking"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
