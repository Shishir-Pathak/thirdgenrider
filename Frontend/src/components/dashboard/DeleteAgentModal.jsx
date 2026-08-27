import Modal from "./Modal";
import DashboardButton from "./DashboardButton";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteAgentModal({
  agent,
  submitting,
  onCancel,
  onConfirm,
}) {
  if (!agent) return null;

  return (
    <Modal
      open={Boolean(agent)}
      onClose={onCancel}
      titleId="delete-agent-modal-title"
      title="Delete Agent / Admin"
      panelClassName="max-w-md"
    >
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm font-medium">
            Warning: This action will permanently remove this agent and delete all their listed vehicles and bookings.
          </p>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900 dark:text-white">
            {agent.firstName || agent.first_name} {agent.lastName || agent.last_name}
          </strong>{" "}
          ({agent.email})?
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
          <DashboardButton
            onClick={onConfirm}
            variant="danger"
            disabled={submitting}
            icon={Trash2}
          >
            {submitting ? "Deleting..." : "Confirm Delete"}
          </DashboardButton>
        </div>
      </div>
    </Modal>
  );
}
