import { useState } from "react";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import CkEditorField from "../components/dashboard/CkEditorField";
import DashboardButton from "../components/dashboard/DashboardButton";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import Modal from "../components/dashboard/Modal";
import { formatDateTime } from "../components/dashboard/BikeBookingsTable";
import { inputClass, labelClass } from "../components/dashboard/bikeFormStyles";
import { useSiteContentAdmin } from "../hooks/useSiteContentAdmin";

const iconOptions = [
	"Car",
	"ShieldCheck",
	"Headphones",
	"Users",
	"MapPin",
	"Briefcase",
];

function getPlainText(html) {
	return String(html || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function ImagePreview({ src, alt }) {
	if (!src) return <span className="text-slate-400">-</span>;

	return (
		<img
			src={src}
			alt={alt}
			className="h-16 w-24 rounded object-cover shadow-sm"
		/>
	);
}

export default function DashboardService() {
	const siteContent = useSiteContentAdmin();
	const [editOpen, setEditOpen] = useState(false);
	const [statsBackgroundImageFile, setStatsBackgroundImageFile] = useState(null);
	const service = siteContent.content.service;

	const updateService = (key, value) => {
		siteContent.setDraft((draft) => ({
			...draft,
			service: { ...draft.service, [key]: value },
		}));
	};

	const updateListItem = (listKey, index, key, value) => {
		siteContent.setDraft((draft) => ({
			...draft,
			service: {
				...draft.service,
				[listKey]: draft.service[listKey].map((item, itemIndex) =>
					itemIndex === index ? { ...item, [key]: value } : item,
				),
			},
		}));
	};

	const addListItem = (listKey, item) => {
		siteContent.setDraft((draft) => ({
			...draft,
			service: {
				...draft.service,
				[listKey]: [...draft.service[listKey], item],
			},
		}));
	};

	const removeListItem = (listKey, index) => {
		siteContent.setDraft((draft) => ({
			...draft,
			service: {
				...draft.service,
				[listKey]: draft.service[listKey].filter(
					(_, itemIndex) => itemIndex !== index,
				),
			},
		}));
	};

	const openEdit = () => {
		siteContent.resetDraft();
		setStatsBackgroundImageFile(null);
		setEditOpen(true);
	};

	const closeEdit = () => {
		if (siteContent.submitting) return;
		siteContent.resetDraft();
		setStatsBackgroundImageFile(null);
		setEditOpen(false);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const saved = await siteContent.saveDraft(
			"service",
			{
				serviceStatsBackgroundImage: statsBackgroundImageFile,
			},
			e.currentTarget,
		);
		if (saved) setEditOpen(false);
	};

	return (
		<>
			<DashboardHeader title="Service Page" />

			<ListErrorBanner
				message={siteContent.listError}
				onRetry={siteContent.loadSiteContent}
			/>

			<div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[1100px] border-collapse text-left text-sm">
						<thead>
							<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
								{[
									"SN",
									"Heading",
									"Description",
									"Cards",
									"Stats",
									"Reviews",
									"Stats Background",
									"Updated At",
									"Actions",
								].map((heading) => (
									<th
										key={heading}
										className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700"
									>
										{heading}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{siteContent.loading ? (
								<tr>
									<td
										colSpan={9}
										className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
									>
										Loading service page content...
									</td>
								</tr>
							) : (
								<tr className="text-slate-600 dark:text-slate-300">
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										1
									</td>
									<td className="max-w-56 border border-slate-200 px-4 py-4 font-medium text-slate-800 dark:border-slate-700 dark:text-slate-100">
										<p className="line-clamp-2">{service.heading || "-"}</p>
									</td>
									<td className="max-w-72 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-3">
											{getPlainText(service.description) || "-"}
										</p>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{service.cards.length} cards
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{service.stats.length} stats
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{service.reviews.length} reviews
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<ImagePreview
											src={service.statsBackgroundImageUrl}
											alt="Service stats background"
										/>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{formatDateTime(siteContent.content.updatedAt)}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<DashboardButton
											type="button"
											onClick={openEdit}
											variant="primary"
											size="sm"
											icon={Edit}
										>
											Edit
										</DashboardButton>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal
				open={editOpen}
				onClose={closeEdit}
				titleId="service-content-form-title"
				title="Edit service page content"
				closeDisabled={siteContent.submitting}
				panelClassName="max-w-4xl"
			>
				<form
					className="mt-4 max-h-[75vh] space-y-5 overflow-y-auto pr-1"
					onSubmit={onSubmit}
				>
					{siteContent.formError && (
						<p
							data-form-error
							tabIndex={-1}
							className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
						>
							{siteContent.formError}
						</p>
					)}

					<div>
						<label
							htmlFor="service-heading"
							className={labelClass}
						>
							Heading
						</label>
						<input
							id="service-heading"
							className={inputClass}
							value={siteContent.draft.service.heading}
							onChange={(e) => updateService("heading", e.target.value)}
							disabled={siteContent.submitting}
						/>
					</div>

					<div>
						<label className={labelClass}>Description</label>
						<CkEditorField
							value={siteContent.draft.service.description}
							disabled={siteContent.submitting}
							minHeight={220}
							onChange={(value) => updateService("description", value)}
						/>
					</div>

					<div>
						<label
							htmlFor="service-stats-background-image"
							className={labelClass}
						>
							Stats background image
						</label>
						<input
							id="service-stats-background-image"
							type="file"
							accept="image/*"
							className={inputClass}
							onChange={(e) =>
								setStatsBackgroundImageFile(e.target.files?.[0] || null)
							}
							disabled={siteContent.submitting}
						/>
						<div className="min-w-0 flex-1">
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
								Current stats background image
							</p>
							<a
								href={siteContent.draft.service.statsBackgroundImageUrl}
								target="_blank"
								rel="noreferrer"
								className="text-xs text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
							>
								view image
							</a>
						</div>
						{/* <div className="text-sm text-slate-600 dark:text-slate-300">
							<p>current image:</p>
							<p>{siteContent.draft.service.statsBackgroundImageUrl}</p>
						</div> */}
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between gap-3">
							<p className={labelClass}>Service cards</p>
							<DashboardButton
								type="button"
								onClick={() =>
									addListItem("cards", {
										icon: "Car",
										title: "",
										description: "",
									})
								}
								disabled={siteContent.submitting}
								variant="secondary"
								size="sm"
								icon={Plus}
							>
								Add card
							</DashboardButton>
						</div>
						{siteContent.draft.service.cards.map((card, index) => (
							<div
								key={index}
								className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
										Card {index + 1}
									</p>
									<DashboardButton
										type="button"
										onClick={() => removeListItem("cards", index)}
										disabled={siteContent.submitting}
										variant="danger"
										size="sm"
										icon={Trash2}
									>
										Remove
									</DashboardButton>
								</div>
								<div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
									<select
										className={inputClass}
										value={card.icon}
										onChange={(e) =>
											updateListItem("cards", index, "icon", e.target.value)
										}
										disabled={siteContent.submitting}
									>
										{iconOptions.map((icon) => (
											<option
												key={icon}
												value={icon}
											>
												{icon}
											</option>
										))}
									</select>
									<input
										className={inputClass}
										value={card.title}
										onChange={(e) =>
											updateListItem("cards", index, "title", e.target.value)
										}
										placeholder="Card title"
										disabled={siteContent.submitting}
									/>
								</div>
								<textarea
									className={`${inputClass} mt-3 min-h-20 resize-y`}
									value={card.description}
									onChange={(e) =>
										updateListItem("cards", index, "description", e.target.value)
									}
									placeholder="Card description"
									disabled={siteContent.submitting}
								/>
							</div>
						))}
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between gap-3">
							<p className={labelClass}>Stats</p>
							<DashboardButton
								type="button"
								onClick={() =>
									addListItem("stats", {
										icon: "Car",
										number: "",
										label: "",
									})
								}
								disabled={siteContent.submitting}
								variant="secondary"
								size="sm"
								icon={Plus}
							>
								Add stat
							</DashboardButton>
						</div>
						{siteContent.draft.service.stats.map((stat, index) => (
							<div
								key={index}
								className="grid gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-[150px_1fr_1fr_auto]"
							>
								<select
									className={inputClass}
									value={stat.icon}
									onChange={(e) =>
										updateListItem("stats", index, "icon", e.target.value)
									}
									disabled={siteContent.submitting}
								>
									{iconOptions.map((icon) => (
										<option
											key={icon}
											value={icon}
										>
											{icon}
										</option>
									))}
								</select>
								<input
									className={inputClass}
									value={stat.number}
									onChange={(e) =>
										updateListItem("stats", index, "number", e.target.value)
									}
									placeholder="120+"
									disabled={siteContent.submitting}
								/>
								<input
									className={inputClass}
									value={stat.label}
									onChange={(e) =>
										updateListItem("stats", index, "label", e.target.value)
									}
									placeholder="Cars Available"
									disabled={siteContent.submitting}
								/>
								<DashboardButton
									type="button"
									onClick={() => removeListItem("stats", index)}
									disabled={siteContent.submitting}
									variant="danger"
									size="sm"
									icon={Trash2}
								>
									Remove
								</DashboardButton>
							</div>
						))}
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label
								htmlFor="service-reviews-heading"
								className={labelClass}
							>
								Reviews heading
							</label>
							<input
								id="service-reviews-heading"
								className={inputClass}
								value={siteContent.draft.service.reviewsHeading}
								onChange={(e) => updateService("reviewsHeading", e.target.value)}
								disabled={siteContent.submitting}
							/>
						</div>
						<div>
							<label
								htmlFor="service-reviews-description"
								className={labelClass}
							>
								Reviews description
							</label>
							<input
								id="service-reviews-description"
								className={inputClass}
								value={siteContent.draft.service.reviewsDescription}
								onChange={(e) => updateService("reviewsDescription", e.target.value)}
								disabled={siteContent.submitting}
							/>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between gap-3">
							<p className={labelClass}>Reviews</p>
							<DashboardButton
								type="button"
								onClick={() => addListItem("reviews", { name: "", review: "" })}
								disabled={siteContent.submitting}
								variant="secondary"
								size="sm"
								icon={Plus}
							>
								Add review
							</DashboardButton>
						</div>
						{siteContent.draft.service.reviews.map((review, index) => (
							<div
								key={index}
								className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
										Review {index + 1}
									</p>
									<DashboardButton
										type="button"
										onClick={() => removeListItem("reviews", index)}
										disabled={siteContent.submitting}
										variant="danger"
										size="sm"
										icon={Trash2}
									>
										Remove
									</DashboardButton>
								</div>
								<input
									className={`${inputClass} mt-3`}
									value={review.name}
									onChange={(e) =>
										updateListItem("reviews", index, "name", e.target.value)
									}
									placeholder="Client name"
									disabled={siteContent.submitting}
								/>
								<textarea
									className={`${inputClass} mt-3 min-h-20 resize-y`}
									value={review.review}
									onChange={(e) =>
										updateListItem("reviews", index, "review", e.target.value)
									}
									placeholder="Review text"
									disabled={siteContent.submitting}
								/>
							</div>
						))}
					</div>

					<div className="flex flex-wrap justify-end gap-2 pt-2">
						<DashboardButton
							type="button"
							onClick={closeEdit}
							disabled={siteContent.submitting}
							variant="secondary"
							icon={X}
						>
							Cancel
						</DashboardButton>
						<DashboardButton
							type="submit"
							disabled={siteContent.submitting}
							variant="primary"
							icon={Save}
						>
							{siteContent.submitting ? "Saving..." : "Save changes"}
						</DashboardButton>
					</div>
				</form>
			</Modal>
		</>
	);
}
