import { Edit, Trash2 } from "lucide-react";
import { formatDateTime } from "./BikeBookingsTable";
import DashboardButton from "./DashboardButton";

function getPlainText(html) {
	return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getCommentsLabel(comments) {
	if (!Array.isArray(comments) || comments.length === 0) return "-";
	return comments.join(", ");
}

export default function BlogsTable({ blogs, loading, onEdit, onDelete }) {
	return (
		<div className="mt-6 min-w-0 overflow-x-hidden rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
			<div className="min-w-0 overflow-x-hidden">
				<table className="w-full min-w-0 table-fixed border-collapse text-left text-sm">
					<thead>
						<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								SN
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Title
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Slug
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Image
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Description
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Author
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Comments
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Created At
							</th>
							<th className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={9}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									Loading blog posts...
								</td>
							</tr>
						) : blogs.length === 0 ? (
							<tr>
								<td
									colSpan={9}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									No blogs yet. Click &quot;+ Add Blog&quot; to create one.
								</td>
							</tr>
						) : (
							blogs.map((row, i) => (
								<tr
									key={row.id}
									className="text-slate-600 dark:text-slate-300"
								>
									<td className="w-12 border border-slate-200 px-2 py-4 text-center dark:border-slate-700">
										{i + 1}
									</td>
									<td className="border border-slate-200 px-4 py-4 font-medium break-words text-slate-800 dark:border-slate-700 dark:text-slate-100">
										<span className="line-clamp-2">{row.title}</span>
									</td>
									<td className="border border-slate-200 px-4 py-4 break-words dark:border-slate-700">
										<span className="line-clamp-2">{row.slug}</span>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{row.image ? (
											<img
												src={row.image}
												alt=""
												className="h-12 w-16 rounded object-cover"
											/>
										) : (
											<span className="text-slate-400">-</span>
										)}
									</td>
									<td className="border border-slate-200 px-4 py-4 break-words dark:border-slate-700">
										<span className="line-clamp-2">{getPlainText(row.description)}</span>
									</td>
									<td className="border border-slate-200 px-4 py-4 break-words dark:border-slate-700">
										{row.author}
									</td>
									<td className="border border-slate-200 px-4 py-4 break-words dark:border-slate-700">
										<span className="line-clamp-2">{getCommentsLabel(row.comments)}</span>
									</td>
									<td className="border border-slate-200 px-4 py-4 text-xs break-words leading-snug dark:border-slate-700">
										{formatDateTime(row.createdAt)}
									</td>
									<td className="w-[7.5rem] border border-slate-200 px-3 py-4 dark:border-slate-700">
										<div className="flex flex-col items-start gap-2">
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
