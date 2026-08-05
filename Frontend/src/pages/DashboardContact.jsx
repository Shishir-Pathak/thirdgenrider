import ContactMessageDetailsModal from "../components/dashboard/ContactMessageDetailsModal";
import ContactMessagesTable from "../components/dashboard/ContactMessagesTable";
import DeleteContactMessageModal from "../components/dashboard/DeleteContactMessageModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import { useContactMessagesAdmin } from "../hooks/useContactMessagesAdmin";

const DashboardContact = () => {
	const contactAdmin = useContactMessagesAdmin();

	return (
		<>
			<div>
				<h1 className="text-xl font-semibold text-slate-700 dark:text-slate-100">
					Contact Messages
				</h1>
			</div>

			<ListErrorBanner
				message={contactAdmin.listError}
				onRetry={contactAdmin.loadMessages}
			/>

			<ContactMessagesTable
				messages={contactAdmin.messages}
				loading={contactAdmin.loading}
				onView={contactAdmin.setViewTarget}
				onDelete={contactAdmin.setDeleteTarget}
			/>

			<ContactMessageDetailsModal
				message={contactAdmin.viewTarget}
				onClose={() => contactAdmin.setViewTarget(null)}
			/>

			<DeleteContactMessageModal
				message={contactAdmin.deleteTarget}
				submitting={contactAdmin.deleteSubmitting}
				onCancel={() => contactAdmin.setDeleteTarget(null)}
				onConfirm={contactAdmin.confirmDelete}
			/>
		</>
	);
};

export default DashboardContact;
