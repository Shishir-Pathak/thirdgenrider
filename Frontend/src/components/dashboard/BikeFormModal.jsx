import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import DashboardButton from "./DashboardButton";
import Modal from "./Modal";
import { inputClass, labelClass } from "./bikeFormStyles";

export default function BikeFormModal({
  open,
  mode,
  bike,
  draft,
  onDraftChange,
  formError,
  submitting,
  imageDeleteSubmitting,
  imageDeleteError,
  imageInputRef,
  licenseImageInputRef,
  blueBookImagesInputRefs,
  onClose,
  onSubmit,
  onDeleteLicenseImage,
  onDeleteBlueBookImage,
}) {
  const isAdd = mode === "add";
  const [blueBookImageFieldCount, setBlueBookImageFieldCount] = useState(1);
  const updateDraft = (field, value) =>
    onDraftChange((d) => ({ ...d, [field]: value }));

  useEffect(() => {
    if (open) setBlueBookImageFieldCount(1);
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      titleId="bike-form-title"
      title={isAdd ? "Add bike" : "Edit bike"}
      closeDisabled={submitting}
    >
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        {formError && (
          <p
            data-form-error
            tabIndex={-1}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
          >
            {formError}
          </p>
        )}
        {imageDeleteError && (
          <p
            data-form-error
            tabIndex={-1}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
          >
            {imageDeleteError}
          </p>
        )}

        <div>
          <label htmlFor="bike-name" className={labelClass}>
            Name
          </label>
          <input
            id="bike-name"
            className={inputClass}
            value={draft.name}
            onChange={(e) => updateDraft("name", e.target.value)}
            placeholder="Bike name"
            autoComplete="off"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="bike-price" className={labelClass}>
            Price / day
          </label>
          <input
            id="bike-price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            className={inputClass}
            value={draft.price}
            onChange={(e) => updateDraft("price", e.target.value)}
            placeholder="8000"
            required
            disabled={submitting}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-model" className={labelClass}>
              Model
            </label>
            <input
              id="bike-model"
              className={inputClass}
              value={draft.model}
              onChange={(e) => updateDraft("model", e.target.value)}
              placeholder="Duke 250"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-color" className={labelClass}>
              Color
            </label>
            <input
              id="bike-color"
              className={inputClass}
              value={draft.color}
              onChange={(e) => updateDraft("color", e.target.value)}
              placeholder="Black"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-plate" className={labelClass}>
              Plate number
            </label>
            <input
              id="bike-plate"
              className={inputClass}
              value={draft.plateNumber}
              onChange={(e) => updateDraft("plateNumber", e.target.value)}
              placeholder="BA 00 PA 0000"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-blue-book" className={labelClass}>
              Blue book number
            </label>
            <input
              id="bike-blue-book"
              className={inputClass}
              value={draft.blueBookNumber}
              onChange={(e) => updateDraft("blueBookNumber", e.target.value)}
              placeholder="Blue book number"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-chassis" className={labelClass}>
              Chassis number
            </label>
            <input
              id="bike-chassis"
              className={inputClass}
              value={draft.chassisNumber}
              onChange={(e) => updateDraft("chassisNumber", e.target.value)}
              placeholder="Chassis number"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-engine" className={labelClass}>
              Engine number
            </label>
            <input
              id="bike-engine"
              className={inputClass}
              value={draft.engineNumber}
              onChange={(e) => updateDraft("engineNumber", e.target.value)}
              placeholder="Engine number"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-mileage" className={labelClass}>
              Mileage
            </label>
            <input
              id="bike-mileage"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className={inputClass}
              value={draft.mileage}
              onChange={(e) => updateDraft("mileage", e.target.value)}
              placeholder="35"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-engine-capacity" className={labelClass}>
              Engine capacity
            </label>
            <input
              id="bike-engine-capacity"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className={inputClass}
              value={draft.engineCapacity}
              onChange={(e) => updateDraft("engineCapacity", e.target.value)}
              placeholder="250"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={draft.available}
            onChange={(e) => updateDraft("available", e.target.checked)}
            disabled={submitting}
            className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          Available
        </label>

        <div>
          <label htmlFor="bike-image" className={labelClass}>
            Bike Image{" "}
            {!isAdd && (
              <span className="font-normal text-slate-500">
                (optional — leave empty to keep current)
              </span>
            )}
          </label>
          <input
            id="bike-image"
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className={inputClass}
            disabled={submitting}
          />
          {!isAdd && bike?.image && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Current:{" "}
              <a
                href={bike.image}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
              >
                view image
              </a>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="bike-license-image" className={labelClass}>
            License image{" "}
            {!isAdd && (
              <span className="font-normal text-slate-500">
                (optional - leave empty to keep current)
              </span>
            )}
          </label>
          <input
            id="bike-license-image"
            ref={licenseImageInputRef}
            type="file"
            accept="image/*"
            className={inputClass}
            required={isAdd}
            disabled={submitting}
          />
          {!isAdd && bike?.licenseImage && (
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <a href={bike.licenseImage} target="_blank" rel="noreferrer">
                <img
                  src={bike.licenseImage}
                  alt={`${bike.name} license`}
                  className="h-20 w-28 rounded object-cover"
                />
              </a>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Current license image
                </p>
                <a
                  href={bike.licenseImage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
                >
                  view image
                </a>
              </div>
              <DashboardButton
                type="button"
                onClick={() => onDeleteLicenseImage(bike)}
                disabled={
                  submitting || imageDeleteSubmitting === `${bike.id}-license`
                }
                variant="danger"
                size="sm"
                icon={Trash2}
              >
                {imageDeleteSubmitting === `${bike.id}-license`
                  ? "Deleting..."
                  : "Delete"}
              </DashboardButton>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Bluebook images{" "}
            {!isAdd && (
              <span className="font-normal text-slate-500">
                (optional - selected images will be added)
              </span>
            )}
          </label>
          <div className="space-y-2">
            {Array.from({ length: blueBookImageFieldCount }).map((_, index) => (
              <input
                key={index}
                id={`bike-blue-book-images-${index}`}
                ref={(node) => {
                  blueBookImagesInputRefs.current[index] = node;
                }}
                type="file"
                accept="image/*"
                multiple
                className={inputClass}
                disabled={submitting}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setBlueBookImageFieldCount((count) => count + 1)}
            disabled={submitting}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add bluebook image
          </button>
          {!isAdd && bike?.blueBookImages?.length > 0 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {bike.blueBookImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <a href={imageUrl} target="_blank" rel="noreferrer">
                    <img
                      src={imageUrl}
                      alt={`${bike.name} bluebook ${index + 1}`}
                      className="h-32 w-full object-contain p-2"
                    />
                  </a>
                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2 dark:border-slate-700">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Bluebook {index + 1}
                    </span>
                    <DashboardButton
                      type="button"
                      onClick={() => onDeleteBlueBookImage(index, bike)}
                      disabled={
                        submitting ||
                        imageDeleteSubmitting === `${bike.id}-bluebook-${index}`
                      }
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                    >
                      {imageDeleteSubmitting === `${bike.id}-bluebook-${index}`
                        ? "Deleting..."
                        : "Delete"}
                    </DashboardButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <DashboardButton
            type="button"
            onClick={onClose}
            disabled={submitting}
            variant="secondary"
            icon={X}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="submit"
            disabled={submitting}
            variant="primary"
            icon={Save}
          >
            {submitting ? "Saving…" : isAdd ? "Add bike" : "Save changes"}
          </DashboardButton>
        </div>
      </form>
    </Modal>
  );
}
