import {
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  XCircle,
  Building2,
  FileCheck,
} from "lucide-react";
import DashboardButton from "./DashboardButton";

export default function AgentsTable({
  agents,
  loading,
  onView,
  onApprove,
  onReject,
  onDelete,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle className="h-3.5 w-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-[#e8eef4] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <th className="px-4 py-3 font-semibold">SN</th>
              <th className="px-4 py-3 font-semibold">Applicant Name</th>
              <th className="px-4 py-3 font-semibold">Business / Email</th>
              <th className="px-4 py-3 font-semibold">PAN / Citizenship</th>
              <th className="px-4 py-3 font-semibold">Applied Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  Loading agents...
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  No agents found matching your filter.
                </td>
              </tr>
            ) : (
              agents.map((agent, i) => {
                const fullName = `${agent.firstName || agent.first_name || ""} ${
                  agent.lastName || agent.last_name || ""
                }`.trim() || "—";

                return (
                  <tr
                    key={agent.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 ${
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50/60 dark:bg-slate-900/60"
                    }`}
                  >
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {i + 1}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {fullName}
                      </div>
                      <div className="text-xs text-slate-500">
                        ID: #{agent.id}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {agent.businessName || agent.business_name || "Personal"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {agent.email}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        PAN: <span className="font-mono">{agent.panNumber || agent.pan_number || "—"}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Ctzn: <span className="font-mono">{agent.citizenshipNumber || agent.citizenship_number || "—"}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                      {agent.created_at
                        ? new Date(agent.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-4 py-3.5">
                      {getStatusBadge(agent.status)}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <DashboardButton
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => onView(agent)}
                          title="View Application Details & Documents"
                        >
                          Review
                        </DashboardButton>

                        {agent.status !== "approved" && (
                          <DashboardButton
                            variant="primary"
                            size="sm"
                            icon={CheckCircle}
                            onClick={() => onApprove(agent.id)}
                            title="Approve Agent"
                          >
                            Approve
                          </DashboardButton>
                        )}

                        {agent.status !== "rejected" && (
                          <DashboardButton
                            variant="danger"
                            size="sm"
                            icon={XCircle}
                            onClick={() => onReject(agent.id)}
                            title="Reject Agent"
                          >
                            Reject
                          </DashboardButton>
                        )}

                        <button
                          type="button"
                          onClick={() => onDelete(agent)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                          title="Delete Agent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
