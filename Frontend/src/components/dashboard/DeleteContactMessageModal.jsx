import { Trash2, X } from "lucide-react";
import DashboardButton from "./DashboardButton";
import Modal from "./Modal";

export default function DeleteContactMessageModal({
	message,
	submitting,
	onCancel,
	onConfirm,
}) {
	return (
		<Modal
			open={Boolean(message)}
			onClose={onCancel}
			onBackdropClick={() => !submitting && onCancel()}
			titleId="delete-contact-message-title"
			title="Delete contact message?"
			panelClassName="max-w-md"
			closeDisabled={submitting}
		>
			<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
				This will remove the contact message from{" "}
				<span className="font-medium text-slate-800 dark:text-slate-100">
					{message?.name}
				</span>
				. This cannot be undone.
			</p>
			<div className="mt-6 flex flex-wrap justify-end gap-2">
				<DashboardButton
					type="button"
					onClick={onCancel}
					disabled={submitting}
					variant="secondary"
					icon={X}
				>
					Cancel
				</DashboardButton>
				<DashboardButton
					type="button"
					onClick={onConfirm}
					disabled={submitting}
					variant="danger"
					icon={Trash2}
				>
					{submitting ? "Deleting..." : "Delete"}
				</DashboardButton>
			</div>
		</Modal>
	);
}
