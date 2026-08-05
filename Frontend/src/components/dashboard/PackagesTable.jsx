import { Edit, Trash2 } from "lucide-react";
import DashboardButton from "./DashboardButton";

export default function PackagesTable({ packages, loading, onEdit, onDelete }) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-[#e8eef4] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <th className="whitespace-nowrap px-4 py-3 font-semibold">SN</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Image
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Title
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Location
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Duration
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Group
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Price
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Days
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  Loading packages...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  No packages yet. Click &quot;+ Add Package&quot; to create
                  one.
                </td>
              </tr>
            ) : (
              packages.map((row, i) => (
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
                  <td className="max-w-[220px] px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                    {row.title}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                    {row.location}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                    {row.duration}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                    {row.groupSize}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                    Rs. {row.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                    {row.itinerary?.length ?? 0}
                  </td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
