import Modal from "./Modal";
import {
  Building2,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  Mail,
  User,
  XCircle,
  Shield,
} from "lucide-react";
import DashboardButton from "./DashboardButton";

export default function AgentDetailsModal({
  agent,
  onClose,
  onApprove,
  onReject,
  actionSubmitting,
}) {
  if (!agent) return null;

  const statusColor =
    agent.status === "approved"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
      : agent.status === "rejected"
        ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300"
        : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300";

  return (
    <Modal
      open={Boolean(agent)}
      onClose={onClose}
      titleId="agent-details-title"
      title={
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[var(--color-primary)]" />
          <span>Agent / Vendor Application Details</span>
        </div>
      }
      panelClassName="max-w-3xl"
    >
      <div className="mt-4 space-y-6">
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Current Application Status
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusColor}`}
              >
                {agent.status === "approved" && <CheckCircle className="h-3.5 w-3.5" />}
                {agent.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                {agent.status}
              </span>
              <span className="text-xs text-slate-500">
                (Role: {agent.role || "agent"})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {agent.status !== "approved" && (
              <DashboardButton
                variant="primary"
                size="sm"
                icon={CheckCircle}
                disabled={actionSubmitting}
                onClick={() => onApprove(agent.id)}
              >
                Approve Agent
              </DashboardButton>
            )}

            {agent.status !== "rejected" && (
              <DashboardButton
                variant="danger"
                size="sm"
                icon={XCircle}
                disabled={actionSubmitting}
                onClick={() => onReject(agent.id)}
              >
                Reject Agent
              </DashboardButton>
            )}
          </div>
        </div>

        {/* Personal & Business Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <User className="h-4 w-4 text-[var(--color-primary)]" />
              Personal Info
            </h4>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="text-slate-500">Full Name:</span>{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {agent.firstName || agent.first_name}{" "}
                  {agent.lastName || agent.last_name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500">Email:</span>{" "}
                <a
                  href={`mailto:${agent.email}`}
                  className="font-medium text-[var(--color-primary)] hover:underline"
                >
                  {agent.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500">PAN Number:</span>{" "}
                <span className="font-mono font-medium text-slate-900 dark:text-slate-200">
                  {agent.panNumber || agent.pan_number || "—"}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Citizenship Number:</span>{" "}
                <span className="font-mono font-medium text-slate-900 dark:text-slate-200">
                  {agent.citizenshipNumber || agent.citizenship_number || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
              Business Info
            </h4>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="text-slate-500">Business Name:</span>{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {agent.businessName || agent.business_name || "Not provided"}
                </span>
              </div>
              {agent.created_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-500">Applied on:</span>{" "}
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(agent.created_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Description */}
        {agent.description && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <FileText className="h-4 w-4 text-[var(--color-primary)]" />
              Business Description / Note
            </h4>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
              {agent.description}
            </p>
          </div>
        )}

        {/* Uploaded Documents */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Shield className="h-4 w-4 text-[var(--color-primary)]" />
            Verification Documents
          </h4>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* Citizenship Photo */}
            <div>
              <span className="mb-2 block text-xs font-medium text-slate-500">
                Citizenship Document Photo
              </span>
              {agent.citizenshipPhoto || agent.citizenship_photo ? (
                <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  <img
                    src={agent.citizenshipPhoto || agent.citizenship_photo}
                    alt="Citizenship"
                    className="h-48 w-full object-contain p-2 transition group-hover:scale-105"
                  />
                  <a
                    href={agent.citizenshipPhoto || agent.citizenship_photo}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2 top-2 rounded bg-black/70 p-1.5 text-white hover:bg-black"
                    title="Open Full Image"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                  No citizenship photo uploaded
                </div>
              )}
            </div>

            {/* PAN Photo */}
            <div>
              <span className="mb-2 block text-xs font-medium text-slate-500">
                PAN Document Photo
              </span>
              {agent.panPhoto || agent.pan_photo ? (
                <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  <img
                    src={agent.panPhoto || agent.pan_photo}
                    alt="PAN Document"
                    className="h-48 w-full object-contain p-2 transition group-hover:scale-105"
                  />
                  <a
                    href={agent.panPhoto || agent.pan_photo}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2 top-2 rounded bg-black/70 p-1.5 text-white hover:bg-black"
                    title="Open Full Image"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                  No PAN photo uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
