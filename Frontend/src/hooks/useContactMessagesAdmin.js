import { useCallback, useEffect, useState } from "react";
import { authFetch } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";

export function useContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const loadMessages = useCallback(async () => {
    setListError("");
    setLoading(true);
    try {
      const res = await authFetch("/api/contact-messages");
      if (!res.ok) throw new Error(await parseApiError(res));
      setMessages(await res.json());
    } catch (err) {
      setListError(err.message || "Failed to load contact messages.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!viewTarget && !deleteTarget) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setViewTarget(null);
      setDeleteTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewTarget, deleteTarget]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      const res = await authFetch(
        `/api/contact-messages/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(await parseApiError(res));
      await loadMessages();
      setDeleteTarget(null);
    } catch (err) {
      setListError(err.message || "Failed to delete contact message.");
      setDeleteTarget(null);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return {
    messages,
    loading,
    listError,
    loadMessages,
    viewTarget,
    setViewTarget,
    deleteTarget,
    setDeleteTarget,
    deleteSubmitting,
    confirmDelete,
  };
}
