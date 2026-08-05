import { Save, X } from "lucide-react";
import DashboardButton from "./DashboardButton";
import Modal from "./Modal";
import { inputClass, labelClass } from "./bikeFormStyles";

const fieldRows = [
  { key: "name", label: "Company name", placeholder: "Vehicle Rental" },
  { key: "contactEmail", label: "Email", placeholder: "info@example.com" },
  { key: "contactPhone", label: "Phone", placeholder: "+977 1 1234567" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+977 1 1234567" },
  { key: "location", label: "Location", placeholder: "Kathmandu, Nepal" },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/...",
  },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/..." },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/...",
  },
];

export default function CompanyDetailsFormModal({
  open,
  mode,
  details,
  draft,
  onDraftChange,
  formError,
  submitting,
  imageInputRef,
  onClose,
  onSubmit,
}) {
  const isAdd = mode === "add";

  return (
    <Modal
      open={open}
      onClose={onClose}
      titleId="company-details-form-title"
      title={isAdd ? "Add company details" : "Edit company details"}
      closeDisabled={submitting}
      panelClassName="max-w-2xl"
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

        <div className="grid gap-4 sm:grid-cols-2">
          {fieldRows.map((field) => (
            <div
              key={field.key}
              className={field.key === "name" ? "sm:col-span-2" : ""}
            >
              <label htmlFor={`company-${field.key}`} className={labelClass}>
                {field.label}
              </label>
              <input
                id={`company-${field.key}`}
                className={inputClass}
                value={draft[field.key]}
                onChange={(e) =>
                  onDraftChange((d) => ({
                    ...d,
                    [field.key]: e.target.value,
                  }))
                }
                placeholder={field.placeholder}
                type={
                  field.key === "contactEmail"
                    ? "email"
                    : field.key === "contactPhone" || field.key === "whatsapp"
                      ? "tel"
                      : "text"
                }
                inputMode={
                  field.key === "contactPhone" || field.key === "whatsapp"
                    ? "numeric"
                    : undefined
                }
                pattern={
                  field.key === "contactPhone" || field.key === "whatsapp"
                    ? "[0-9]{10}"
                    : undefined
                }
                maxLength={
                  field.key === "contactPhone" || field.key === "whatsapp"
                    ? 10
                    : undefined
                }
                required={field.key === "name"}
                autoComplete="off"
                disabled={submitting}
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="company-business-hours" className={labelClass}>
            Business hours
          </label>
          <textarea
            id="company-business-hours"
            className={`${inputClass} min-h-24 resize-y`}
            value={draft.businessHours}
            onChange={(e) =>
              onDraftChange((d) => ({ ...d, businessHours: e.target.value }))
            }
            placeholder={`Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 10:00 AM - 5:00 PM
Sunday: Closed`}
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="company-about" className={labelClass}>
            About
          </label>
          <textarea
            id="company-about"
            className={`${inputClass} min-h-28 resize-y`}
            value={draft.about}
            onChange={(e) =>
              onDraftChange((d) => ({ ...d, about: e.target.value }))
            }
            placeholder="Short company description"
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="company-logo" className={labelClass}>
            Logo{" "}
            {!isAdd && (
              <span className="font-normal text-slate-500">
                (optional - leave empty to keep current)
              </span>
            )}
          </label>
          <input
            id="company-logo"
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className={inputClass}
            disabled={submitting}
          />
          {!isAdd && details?.logo && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Current:{" "}
              <a
                href={details.logo}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
              >
                view logo
              </a>
            </p>
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
            {submitting ? "Saving..." : isAdd ? "Add details" : "Save changes"}
          </DashboardButton>
        </div>
      </form>
    </Modal>
  );
}
