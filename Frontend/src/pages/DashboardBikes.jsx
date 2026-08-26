import BikesTable from "../components/dashboard/BikesTable";
import BikeFormModal from "../components/dashboard/BikeFormModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DeleteBikeModal from "../components/dashboard/DeleteBikeModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import { useBikesAdmin } from "../hooks/useBikesAdmin";
import { Link, useLocation } from "react-router";
import { Bike, Car } from "lucide-react";
const DashboardBikes = ({ type = "bike" }) => {
  const location = useLocation();

  const isBike = location.pathname === "/dashboard/bikes";
  console.log(isBike);
  const bikesAdmin = useBikesAdmin(isBike);

  return (
    <>
      <DashboardHeader
        title={
          <div className="flex gap-2">
            <Link
              to="/dashboard/bikes"
              className={
                isBike
                  ? "text-[var(--color-primary)]"
                  : "hover:text-[var(--color-primary)] duration-75 transition-all ease"
              }
            >
              <Bike />
            </Link>{" "}
            |{" "}
            <Link
              to="/dashboard/cars"
              className={
                !isBike
                  ? "text-[var(--color-primary)]"
                  : "hover:text-[var(--color-primary)] duration-75 transition-all ease"
              }
            >
              <Car />
            </Link>
          </div>
        }
        addLabel={isBike ? "+ Add Bike" : "+ Add Cars"}
        onAdd={bikesAdmin.openAdd}
      />

      <ListErrorBanner
        message={bikesAdmin.listError}
        onRetry={bikesAdmin.loadBikes}
      />
      <ListErrorBanner
        message={bikesAdmin.imageDeleteError}
        onRetry={bikesAdmin.loadBikes}
      />

      <BikesTable
        bikes={bikesAdmin.bikes}
        loading={bikesAdmin.loading}
        onEdit={bikesAdmin.openEdit}
        onDelete={bikesAdmin.setDeleteTarget}
      />

      <BikeFormModal
        open={Boolean(bikesAdmin.formModal)}
        mode={bikesAdmin.formModal?.mode}
        bike={bikesAdmin.formModal?.bike}
        draft={bikesAdmin.draft}
        onDraftChange={bikesAdmin.setDraft}
        formError={bikesAdmin.formError}
        submitting={bikesAdmin.formSubmitting}
        imageDeleteSubmitting={bikesAdmin.imageDeleteSubmitting}
        imageDeleteError={bikesAdmin.imageDeleteError}
        imageInputRef={bikesAdmin.imageInputRef}
        licenseImageInputRef={bikesAdmin.licenseImageInputRef}
        blueBookImagesInputRefs={bikesAdmin.blueBookImagesInputRefs}
        onClose={bikesAdmin.closeForm}
        onSubmit={bikesAdmin.submitForm}
        onDeleteLicenseImage={bikesAdmin.deleteLicenseImage}
        onDeleteBlueBookImage={bikesAdmin.deleteBlueBookImage}
        isBike={isBike}
      />

      <DeleteBikeModal
        bike={bikesAdmin.deleteTarget}
        submitting={bikesAdmin.deleteSubmitting}
        onCancel={() => bikesAdmin.setDeleteTarget(null)}
        onConfirm={bikesAdmin.confirmDelete}
      />
    </>
  );
};

export default DashboardBikes;
