import { Eye, Trash2 } from "lucide-react";
import DashboardButton from "./DashboardButton";

function formatDate(value) {
	if (!value) return "-";
	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(value));
}

function formatDateTime(value) {
	if (!value) return "-";
	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(value));
}

export { formatDate, formatDateTime };

export default function BikeBookingsTable({
	bookings,
	loading,
	onView,
	onDelete,
}) {
	return (
		<div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[1120px] border-collapse text-left text-sm">
					<thead>
						<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								SN
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Bike
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Full Name
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Email
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Phone
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Pickup
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Dropoff
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Pickup Date
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Return Date
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Message
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Created At
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={12}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									Loading bookings...
								</td>
							</tr>
						) : bookings.length === 0 ? (
							<tr>
								<td
									colSpan={12}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									No bike bookings yet.
								</td>
							</tr>
						) : (
							bookings.map((booking, i) => (
								<tr
									key={booking.id}
									className="text-slate-600 dark:text-slate-300"
								>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{i + 1}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{booking.bikeName || booking.bike?.name || "-"}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{booking.customerName}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{booking.customerEmail}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{booking.customerPhone}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{booking.pickupLocation}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{booking.returnLocation}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{formatDate(booking.pickupDate)}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{formatDate(booking.returnDate)}
									</td>
									<td className="max-w-44 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-3">{booking.message || "-"}</p>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{formatDateTime(booking.createdAt)}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<div className="flex flex-col items-start gap-2">
											<DashboardButton
												onClick={() => onView(booking)}
												variant="primary"
												size="sm"
												icon={Eye}
											>
												View
											</DashboardButton>
											<DashboardButton
												onClick={() => onDelete(booking)}
												variant="danger"
												size="sm"
												icon={Trash2}
											>
												Delete
											</DashboardButton>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
