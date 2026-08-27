import { useCallback, useEffect, useState } from "react";
import { authFetch, apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";

export function useAgentsAdmin() {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const loadAgents = useCallback(async () => {
    setListError("");
    setLoading(true);
    try {
      const res = await authFetch("/api/agent");
      if (!res.ok) throw new Error(await parseApiError(res));
      const data = await res.json();
      setAgents(Array.isArray(data.agents) ? data.agents : []);

      const statsRes = await authFetch("/api/agent/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      setListError(err.message || "Failed to load agents.");
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const updateAgentStatus = async (agentId, newStatus, newRole = "agent") => {
    setActionSubmitting(true);
    try {
      const res = await authFetch(`/api/agent/${agentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, role: newRole }),
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      await loadAgents();
      if (selectedAgent && selectedAgent.id === agentId) {
        setSelectedAgent((prev) => (prev ? { ...prev, status: newStatus, role: newRole } : null));
      }
    } catch (err) {
      setListError(err.message || `Failed to update agent to ${newStatus}.`);
    } finally {
      setActionSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionSubmitting(true);
    try {
      const res = await authFetch(`/api/agent/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      await loadAgents();
      setDeleteTarget(null);
    } catch (err) {
      setListError(err.message || "Failed to delete agent.");
    } finally {
      setActionSubmitting(false);
    }
  };

  return {
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
  };
}
