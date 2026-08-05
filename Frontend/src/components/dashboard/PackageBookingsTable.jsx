import { Eye, Trash2 } from "lucide-react";
import { formatDate, formatDateTime } from "./BikeBookingsTable";
import DashboardButton from "./DashboardButton";

export default function PackageBookingsTable({
	bookings,
	loading,
	onView,
	onDelete,
}) {
	return (
		<div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[1200px] border-collapse text-left text-sm">
					<thead>
						<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
							{[
								"SN",
								"Package",
								"Full Name",
								"Email",
								"Phone",
								"People",
								"Pickup",
								"Dropoff",
								"Pickup Date",
								"Return Date",
								"Message",
								"Created At",
								"Actions",
							].map((heading) => (
								<th
									key={heading}
									className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700"
								>
									{heading}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={13}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									Loading package bookings...
								</td>
							</tr>
						) : bookings.length === 0 ? (
							<tr>
								<td
									colSpan={13}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									No package bookings yet.
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
										{booking.packageTitle || booking.package?.title || "-"}
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
										{booking.numberOfPeople}
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
