import { Edit, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import DashboardButton from "./DashboardButton";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm text-slate-700 dark:text-slate-200">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function CompanyDetailsCard({
  details,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Loading company details...
      </div>
    );
  }

  if (!details) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          No company details yet.
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Use the add button to create the single company details record.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-5 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            {details.logo ? (
              <img
                src={details.logo}
                alt={`${details.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-slate-400">
                {details.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {details.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Company details record
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <DashboardButton
            onClick={onEdit}
            variant="primary"
            size="sm"
            icon={Edit}
          >
            Edit
          </DashboardButton>
          <DashboardButton
            onClick={() => onDelete(details)}
            variant="danger"
            size="sm"
            icon={Trash2}
          >
            Delete
          </DashboardButton>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-3">
        <InfoRow icon={Mail} label="Email" value={details.contactEmail} />
        <InfoRow icon={Phone} label="Phone" value={details.contactPhone} />
        <InfoRow icon={Phone} label="WhatsApp" value={details.whatsapp} />
        <InfoRow icon={MapPin} label="Location" value={details.location} />
      </div>

      <div className="border-t border-slate-100 p-5 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Business hours
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
          {details.businessHours || "-"}
        </p>
      </div>

      <div className="border-t border-slate-100 p-5 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          About
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
          {details.about || "-"}
        </p>
      </div>

      <div className="grid gap-4 border-t border-slate-100 p-5 text-sm dark:border-slate-800 md:grid-cols-3">
        <a
          href={details.facebook || undefined}
          target="_blank"
          rel="noreferrer"
          className="break-words text-[var(--color-primary)] hover:underline dark:text-[var(--color-primary)]"
        >
          {details.facebook || "No Facebook link"}
        </a>
        <a
          href={details.tiktok || undefined}
          target="_blank"
          rel="noreferrer"
          className="break-words text-[var(--color-primary)] hover:underline dark:text-[var(--color-primary)]"
        >
          {details.tiktok || "No TikTok link"}
        </a>
        <a
          href={details.instagram || undefined}
          target="_blank"
          rel="noreferrer"
          className="break-words text-[var(--color-primary)] hover:underline dark:text-[var(--color-primary)]"
        >
          {details.instagram || "No Instagram link"}
        </a>
      </div>
    </div>
  );
}
