import { useState, useEffect } from "react";
import { authFetch } from "../../lib/api";
import { Link } from "react-router";
import { Users } from "lucide-react";

export default function AgentButton() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchPending = async () => {
      try {
        const res = await authFetch("/api/agent/stats");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.pending !== undefined) {
            setPendingCount(Number(data.pending || 0));
          }
        }
      } catch (e) {
        // Ignore
      }
    };

    fetchPending();
    const interval = setInterval(fetchPending, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Link
      to="/dashboard/agents"
      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] active:scale-95"
    >
      <Users className="h-3.5 w-3.5" />
      <span>Agents</span>
      {pendingCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[var(--color-primary)]">
          {pendingCount}
        </span>
      )}
    </Link>
  );
}
