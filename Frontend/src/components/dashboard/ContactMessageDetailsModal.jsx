import { X } from "lucide-react";
import { formatDateTime } from "./BikeBookingsTable";
import DashboardButton from "./DashboardButton";
import Modal from "./Modal";

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

export default function ContactMessageDetailsModal({ message, onClose }) {
	return (
		<Modal
			open={Boolean(message)}
			onClose={onClose}
			titleId="contact-message-details-title"
			title="Contact message"
			panelClassName="max-w-2xl"
		>
			<div className="mt-5 grid gap-5 sm:grid-cols-2">
				<DetailRow label="Name" value={message?.name} />
				<DetailRow label="Email" value={message?.email} />
				<DetailRow label="Phone" value={message?.phone} />
				<DetailRow label="Subject" value={message?.subject} />
				<DetailRow
					label="Created At"
					value={formatDateTime(message?.createdAt)}
				/>
			</div>

			<div className="mt-5">
				<DetailRow label="Message" value={message?.message} />
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
