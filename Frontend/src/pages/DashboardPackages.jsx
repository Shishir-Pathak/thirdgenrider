import DashboardHeader from "../components/dashboard/DashboardHeader";
import DeletePackageModal from "../components/dashboard/DeletePackageModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import PackageFormModal from "../components/dashboard/PackageFormModal";
import PackagesTable from "../components/dashboard/PackagesTable";
import { usePackagesAdmin } from "../hooks/usePackagesAdmin";

const DashboardPackages = () => {
	const packagesAdmin = usePackagesAdmin();

	return (
		<>
			<DashboardHeader
				title="Packages"
				addLabel="+ Add Package"
				onAdd={packagesAdmin.openAdd}
			/>

			<ListErrorBanner
				message={packagesAdmin.listError}
				onRetry={packagesAdmin.loadPackages}
			/>

			<PackagesTable
				packages={packagesAdmin.packages}
				loading={packagesAdmin.loading}
				onEdit={packagesAdmin.openEdit}
				onDelete={packagesAdmin.setDeleteTarget}
			/>

			<PackageFormModal
				open={Boolean(packagesAdmin.formModal)}
				mode={packagesAdmin.formModal?.mode}
				pkg={packagesAdmin.formModal?.pkg}
				draft={packagesAdmin.draft}
				onDraftChange={packagesAdmin.setDraft}
				formError={packagesAdmin.formError}
				submitting={packagesAdmin.formSubmitting}
				imageInputRef={packagesAdmin.imageInputRef}
				onClose={packagesAdmin.closeForm}
				onSubmit={packagesAdmin.submitForm}
			/>

			<DeletePackageModal
				pkg={packagesAdmin.deleteTarget}
				submitting={packagesAdmin.deleteSubmitting}
				onCancel={() => packagesAdmin.setDeleteTarget(null)}
				onConfirm={packagesAdmin.confirmDelete}
			/>
		</>
	);
};

export default DashboardPackages;
