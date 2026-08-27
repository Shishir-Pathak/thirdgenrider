import { useState, useMemo } from "react";
import { useAgentsAdmin } from "../hooks/useAgentsAdmin";
import AgentsTable from "../components/dashboard/AgentsTable";
import AgentDetailsModal from "../components/dashboard/AgentDetailsModal";
import DeleteAgentModal from "../components/dashboard/DeleteAgentModal";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
} from "lucide-react";

export default function DashboardAgents() {
  const {
    agents,
    stats,
    loading,
    listError,
    loadAgents,
    selectedAgent,
    setSelectedAgent,
    deleteTarget,
    setDeleteTarget,
    actionSubmitting,
    updateAgentStatus,
    confirmDelete,
  } = useAgentsAdmin();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // Tab filter
      if (activeTab === "pending" && agent.status !== "pending") return false;
      if (activeTab === "approved" && agent.status !== "approved") return false;
      if (activeTab === "rejected" && agent.status !== "rejected") return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = `${agent.firstName || agent.first_name || ""} ${agent.lastName || agent.last_name || ""}`.toLowerCase();
      const email = (agent.email || "").toLowerCase();
      const business = (agent.businessName || agent.business_name || "").toLowerCase();
      const pan = (agent.panNumber || agent.pan_number || "").toLowerCase();

      return name.includes(q) || email.includes(q) || business.includes(q) || pan.includes(q);
    });
  }, [agents, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Agents & Vendors Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review agent registration applications, approve or reject vendors, and manage permissions.
          </p>
        </div>

        <button
          onClick={loadAgents}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            activeTab === "all"
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-2 ring-[var(--color-primary)]/20"
              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Agents
            </span>
            <Users className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.total}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            activeTab === "pending"
              ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 dark:bg-amber-950/20"
              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Approval
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.pending}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("approved")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            activeTab === "approved"
              ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 dark:bg-emerald-950/20"
              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Approved Vendors
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.approved}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("rejected")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            activeTab === "rejected"
              ? "border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20 dark:bg-rose-950/20"
              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Rejected
            </span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "all"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "pending"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "approved"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "rejected"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, PAN, business..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      <ListErrorBanner message={listError} onRetry={loadAgents} />

      {/* Agents Table */}
      <AgentsTable
        agents={filteredAgents}
        loading={loading}
        onView={setSelectedAgent}
        onApprove={(id) => updateAgentStatus(id, "approved", "agent")}
        onReject={(id) => updateAgentStatus(id, "rejected")}
        onDelete={setDeleteTarget}
      />

      {/* View/Review Modal */}
      <AgentDetailsModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onApprove={(id) => updateAgentStatus(id, "approved", "agent")}
        onReject={(id) => updateAgentStatus(id, "rejected")}
        actionSubmitting={actionSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAgentModal
        agent={deleteTarget}
        submitting={actionSubmitting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
