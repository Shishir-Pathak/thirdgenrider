import { Download, Edit, ExternalLink, QrCode, Trash2 } from "lucide-react";
import DashboardButton from "./DashboardButton";

export default function BikesTable({
  bikes,
  loading,
  onEdit,
  onDelete,
}) {
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
        .replace(/[\\\\/:*?"<>|]+/g, "-")
        .replace(/\\s+/g, "-")
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
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-[#e8eef4] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <th className="px-4 py-3 font-semibold">SN</th>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Model / Plate</th>
              <th className="px-4 py-3 font-semibold">Price/Day</th>
              <th className="px-4 py-3 font-semibold">License</th>
              <th className="px-4 py-3 font-semibold">Bluebook</th>
              <th className="px-4 py-3 font-semibold">QR Code</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  Loading bikes...
                </td>
              </tr>
            ) : bikes.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  No bikes yet. Click &quot;+ Add Bike&quot; to create one.
                </td>
              </tr>
            ) : (
              bikes.map((row, i) => {
                const bluebookImages = Array.isArray(row.blueBookImages)
                  ? row.blueBookImages
                  : row.blueBookImages
                  ? [row.blueBookImages]
                  : [];

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-100 dark:border-slate-800 ${
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50/80 dark:bg-slate-900/80"
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
                          className="h-12 w-16 rounded object-cover"
                        />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="max-w-[280px] px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {row.name}
                    </td>

                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                      <div className="font-medium">{row.model || "-"}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {row.plateNumber || "No plate"}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                      {row.price}
                    </td>

                    {/* License */}
                    <td className="px-4 py-2">
                      {row.licenseImage ? (
                        <a
                          href={row.licenseImage}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative block w-fit"
                        >
                          <img
                            src={row.licenseImage}
                            alt=""
                            className="h-12 w-16 rounded border border-slate-200 object-cover dark:border-slate-700"
                          />

                          <ExternalLink
                            className="absolute right-1 top-1 h-3.5 w-3.5 rounded bg-white/85 p-0.5 text-slate-600 opacity-0 transition group-hover:opacity-100 dark:bg-slate-900/85 dark:text-slate-200"
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Bluebook */}
                    <td className="px-4 py-2">
                      {bluebookImages.length > 0 ? (
                        <div className="flex max-w-[220px] flex-wrap gap-2">
                          {bluebookImages.map((imageUrl, index) => (
                            <a
                              key={index}
                              href={imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="group relative block"
                            >
                              <img
                                src={imageUrl}
                                alt={`Bluebook ${index + 1}`}
                                className="h-12 w-16 rounded border border-slate-200 object-cover dark:border-slate-700"
                              />

                              <ExternalLink
                                className="absolute right-1 top-1 h-3.5 w-3.5 rounded bg-white/85 p-0.5 text-slate-600 opacity-0 transition group-hover:opacity-100 dark:bg-slate-900/85 dark:text-slate-200"
                                aria-hidden="true"
                              />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
                              className="h-16 w-16 rounded border border-slate-200 bg-white object-contain p-1 dark:border-slate-700"
                            />
                          </a>

                          <button
                            type="button"
                            onClick={() => downloadQrCode(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-[var(--color-primary)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            title="Download QR code"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <QrCode className="h-4 w-4" />
                          Missing
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
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