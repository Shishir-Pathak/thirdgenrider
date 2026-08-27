import {
  Download,
  Edit,
  ExternalLink,
  QrCode,
  Trash2,
  Eye,
  EyeOff,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import DashboardButton from "./DashboardButton";
import { isSuperAdmin } from "../../lib/dashboardAuth";

export default function BikesTable({
  bikes,
  loading,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  const superAdmin = isSuperAdmin();

  const downloadQrCode = async (bike) => {
    if (!bike.qrCode) return;

    try {
      const res = await fetch(bike.qrCode);
      if (!res.ok) throw new Error("Failed to download QR code.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bike.name || "bike"}-qr-code.png`
        .replace(/[\\/:*?"<>|]+/g, "-")
        .replace(/\s+/g, "-")
        .toLowerCase();
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(bike.qrCode, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-[#e8eef4] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <th className="px-4 py-3 font-semibold">SN</th>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Model / Plate</th>
              {superAdmin && <th className="px-4 py-3 font-semibold">Owner / Vendor</th>}
              <th className="px-4 py-3 font-semibold">Price/Day</th>
              <th className="px-4 py-3 font-semibold">Status / Listing</th>
              <th className="px-4 py-3 font-semibold">QR Code</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={superAdmin ? 9 : 8}
                  className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  Loading fleet vehicles...
                </td>
              </tr>
            ) : bikes.length === 0 ? (
              <tr>
                <td
                  colSpan={superAdmin ? 9 : 8}
                  className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  No vehicles yet. Click &quot;+ Add&quot; above to list your vehicle.
                </td>
              </tr>
            ) : (
              bikes.map((row, i) => {
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 ${
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50/60 dark:bg-slate-900/60"
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {i + 1}
                    </td>

                    <td className="px-4 py-2">
                      {row.image ? (
                        <img
                          src={row.image}
                          alt=""
                          className="h-12 w-16 rounded-lg object-cover shadow-sm"
                        />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="max-w-[220px] px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                      {row.name}
                    </td>

                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                      <div className="font-medium">{row.model || "-"}</div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {row.plateNumber || "No plate"}
                      </div>
                    </td>

                    {superAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <User className="h-3 w-3 text-slate-400" />
                          <span>{row.ownerName || "Super Admin"}</span>
                        </div>
                      </td>
                    )}

                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      Rs. {row.price}
                    </td>

                    {/* Listing / Availability Status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            row.available
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {row.available ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {row.available ? "Listed" : "Delisted"}
                        </span>

                        {row.activeBookingsCount > 0 && (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            <Clock className="h-2.5 w-2.5" />
                            Booked ({row.activeBookingsCount})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* QR Code */}
                    <td className="px-4 py-2">
                      {row.qrCode ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={`/bike-details/${row.id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={row.qrCode}
                              alt={`QR code for ${row.name}`}
                              className="h-12 w-12 rounded border border-slate-200 bg-white object-contain p-1 dark:border-slate-700"
                            />
                          </a>

                          <button
                            type="button"
                            onClick={() => downloadQrCode(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            title="Download QR code"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <QrCode className="h-3.5 w-3.5" />
                          None
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* List / Delist quick toggle */}
                        {onToggleAvailability && (
                          <button
                            type="button"
                            onClick={() => onToggleAvailability(row)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                              row.available
                                ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                                : "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                            }`}
                            title={row.available ? "Delist (hide from booking)" : "List (make available for booking)"}
                          >
                            {row.available ? (
                              <>
                                <EyeOff className="h-3.5 w-3.5" />
                                <span>Delist</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3.5 w-3.5" />
                                <span>List</span>
                              </>
                            )}
                          </button>
                        )}

                        <DashboardButton
                          onClick={() => onEdit(row)}
                          variant="primary"
                          size="sm"
                          icon={Edit}
                        >
                          Edit
                        </DashboardButton>

                        <DashboardButton
                          onClick={() => onDelete(row)}
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                        >
                          Delete
                        </DashboardButton>
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