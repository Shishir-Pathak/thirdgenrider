import CompanyDetailsCard from "../components/dashboard/CompanyDetailsCard";
import CompanyDetailsFormModal from "../components/dashboard/CompanyDetailsFormModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DeleteCompanyDetailsModal from "../components/dashboard/DeleteCompanyDetailsModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import { useCompanyDetailsAdmin } from "../hooks/useCompanyDetailsAdmin";

const DashboardCompanyDetails = () => {
	const companyAdmin = useCompanyDetailsAdmin();

	return (
		<>
			<DashboardHeader
				title="Company Details"
				addLabel="+ Add Details"
				onAdd={companyAdmin.openAdd}
			/>

			<ListErrorBanner
				message={companyAdmin.listError}
				onRetry={companyAdmin.loadCompanyDetails}
			/>

			<CompanyDetailsCard
				details={companyAdmin.details}
				loading={companyAdmin.loading}
				onEdit={companyAdmin.openEdit}
				onDelete={companyAdmin.setDeleteTarget}
			/>

			<CompanyDetailsFormModal
				open={Boolean(companyAdmin.formModal)}
				mode={companyAdmin.formModal?.mode}
				details={companyAdmin.formModal?.details}
				draft={companyAdmin.draft}
				onDraftChange={companyAdmin.setDraft}
				formError={companyAdmin.formError}
				submitting={companyAdmin.formSubmitting}
				imageInputRef={companyAdmin.imageInputRef}
				onClose={companyAdmin.closeForm}
				onSubmit={companyAdmin.submitForm}
			/>

			<DeleteCompanyDetailsModal
				details={companyAdmin.deleteTarget}
				submitting={companyAdmin.deleteSubmitting}
				onCancel={() => companyAdmin.setDeleteTarget(null)}
				onConfirm={companyAdmin.confirmDelete}
			/>
		</>
	);
};

export default DashboardCompanyDetails;
