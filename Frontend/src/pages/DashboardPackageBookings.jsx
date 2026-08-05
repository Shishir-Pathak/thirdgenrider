import DeletePackageBookingModal from "../components/dashboard/DeletePackageBookingModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import PackageBookingDetailsModal from "../components/dashboard/PackageBookingDetailsModal";
import PackageBookingsTable from "../components/dashboard/PackageBookingsTable";
import { usePackageBookingsAdmin } from "../hooks/usePackageBookingsAdmin";

const DashboardPackageBookings = () => {
	const bookingsAdmin = usePackageBookingsAdmin();

	return (
		<>
			<div>
				<h1 className="text-xl font-semibold text-slate-700 dark:text-slate-100">
					Package Bookings
				</h1>
			</div>

			<ListErrorBanner
				message={bookingsAdmin.listError}
				onRetry={bookingsAdmin.loadBookings}
			/>

			<PackageBookingsTable
				bookings={bookingsAdmin.bookings}
				loading={bookingsAdmin.loading}
				onView={bookingsAdmin.setViewTarget}
				onDelete={bookingsAdmin.setDeleteTarget}
			/>

			<PackageBookingDetailsModal
				booking={bookingsAdmin.viewTarget}
				onClose={() => bookingsAdmin.setViewTarget(null)}
			/>

			<DeletePackageBookingModal
				booking={bookingsAdmin.deleteTarget}
				submitting={bookingsAdmin.deleteSubmitting}
				onCancel={() => bookingsAdmin.setDeleteTarget(null)}
				onConfirm={bookingsAdmin.confirmDelete}
			/>
		</>
	);
};

export default DashboardPackageBookings;
