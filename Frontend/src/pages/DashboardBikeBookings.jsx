import BikeBookingDetailsModal from "../components/dashboard/BikeBookingDetailsModal";
import BikeBookingsTable from "../components/dashboard/BikeBookingsTable";
import DeleteBikeBookingModal from "../components/dashboard/DeleteBikeBookingModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import { useBikeBookingsAdmin } from "../hooks/useBikeBookingsAdmin";

const DashboardBikeBookings = () => {
	const bookingsAdmin = useBikeBookingsAdmin();

	return (
		<>
			<div>
				<h1 className="text-xl font-semibold text-slate-700 dark:text-slate-100">
					Bookings
				</h1>
			</div>

			<ListErrorBanner
				message={bookingsAdmin.listError}
				onRetry={bookingsAdmin.loadBookings}
			/>

			<BikeBookingsTable
				bookings={bookingsAdmin.bookings}
				loading={bookingsAdmin.loading}
				onView={bookingsAdmin.setViewTarget}
				onDelete={bookingsAdmin.setDeleteTarget}
			/>

			<BikeBookingDetailsModal
				booking={bookingsAdmin.viewTarget}
				onClose={() => bookingsAdmin.setViewTarget(null)}
			/>

			<DeleteBikeBookingModal
				booking={bookingsAdmin.deleteTarget}
				submitting={bookingsAdmin.deleteSubmitting}
				onCancel={() => bookingsAdmin.setDeleteTarget(null)}
				onConfirm={bookingsAdmin.confirmDelete}
			/>
		</>
	);
};

export default DashboardBikeBookings;
