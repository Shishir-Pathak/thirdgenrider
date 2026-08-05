import { X } from "lucide-react";
import DashboardButton from "./DashboardButton";
import Modal from "./Modal";
import { formatDate, formatDateTime } from "./BikeBookingsTable";

function DetailRow({ label, value }) {
	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
				{label}
			</p>
			<p className="mt-1 break-words text-sm text-slate-700 dark:text-slate-200">
				{value || "-"}
			</p>
		</div>
	);
}

export default function PackageBookingDetailsModal({ booking, onClose }) {
	return (
		<Modal
			open={Boolean(booking)}
			onClose={onClose}
			titleId="package-booking-details-title"
			title="Package booking details"
			panelClassName="max-w-2xl"
		>
			<div className="mt-5 grid gap-5 sm:grid-cols-2">
				<DetailRow
					label="Package"
					value={booking?.packageTitle || booking?.package?.title}
				/>
				<DetailRow label="Full Name" value={booking?.customerName} />
				<DetailRow label="Email" value={booking?.customerEmail} />
				<DetailRow label="Phone" value={booking?.customerPhone} />
				<DetailRow label="People" value={booking?.numberOfPeople} />
				<DetailRow label="Pickup" value={booking?.pickupLocation} />
				<DetailRow label="Dropoff" value={booking?.returnLocation} />
				<DetailRow
					label="Pickup Date"
					value={formatDate(booking?.pickupDate)}
				/>
				<DetailRow
					label="Return Date"
					value={formatDate(booking?.returnDate)}
				/>
				<DetailRow
					label="Created At"
					value={formatDateTime(booking?.createdAt)}
				/>
			</div>

			<div className="mt-5">
				<DetailRow label="Message" value={booking?.message} />
			</div>

			<div className="mt-6 flex justify-end">
				<DashboardButton
					type="button"
					onClick={onClose}
					variant="secondary"
					icon={X}
				>
					Close
				</DashboardButton>
			</div>
		</Modal>
	);
}
