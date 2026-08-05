import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";

export function useBikeBookingsAdmin() {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [viewTarget, setViewTarget] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);

	const loadBookings = useCallback(async () => {
		setListError("");
		setLoading(true);

		try {
			const res = await fetch(apiUrl("/api/bike-bookings"));

			if (!res.ok) {
				throw new Error(await parseApiError(res));
			}

			const data = await res.json();
			setBookings(Array.isArray(data) ? data : []);
		} catch (err) {
			setListError(err.message || "Failed to load bike bookings.");
			setBookings([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadBookings();
	}, [loadBookings]);

	useEffect(() => {
		if (!viewTarget && !deleteTarget) return;

		const onKey = (e) => {
			if (e.key !== "Escape") return;

			setViewTarget(null);
			setDeleteTarget(null);
		};

		window.addEventListener("keydown", onKey);

		return () => {
			window.removeEventListener("keydown", onKey);
		};
	}, [viewTarget, deleteTarget]);

	const confirmDelete = async () => {
		if (!deleteTarget) return;

		setDeleteSubmitting(true);

		try {
			const res = await fetch(
				apiUrl(`/api/bike-bookings/${deleteTarget.id}`),
				{
					method: "DELETE",
				}
			);

			if (!res.ok) {
				throw new Error(await parseApiError(res));
			}

			await loadBookings();
			setDeleteTarget(null);

		} catch (err) {
			setListError(err.message || "Failed to delete booking.");
			setDeleteTarget(null);

		} finally {
			setDeleteSubmitting(false);
		}
	};

	return {
		bookings,
		loading,
		listError,
		loadBookings,
		viewTarget,
		setViewTarget,
		deleteTarget,
		setDeleteTarget,
		deleteSubmitting,
		confirmDelete,
	};
}