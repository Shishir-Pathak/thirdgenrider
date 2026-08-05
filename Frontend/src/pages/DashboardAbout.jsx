import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import CkEditorField from "../components/dashboard/CkEditorField";
import DashboardButton from "../components/dashboard/DashboardButton";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import Modal from "../components/dashboard/Modal";
import { formatDateTime } from "../components/dashboard/BikeBookingsTable";
import { inputClass, labelClass } from "../components/dashboard/bikeFormStyles";
import { useSiteContentAdmin } from "../hooks/useSiteContentAdmin";

const textFields = [
	{
		key: "heading",
		label: "Heading",
		placeholder: "Third Generation Rider Pvt. Ltd.",
	},
	{ key: "experienceYears", label: "Experience value", placeholder: "5+" },
	{
		key: "experienceLabel",
		label: "Experience label",
		placeholder: "Years Of Experience",
	},
];

const textAreas = [
	{
		key: "description",
		label: "Description",
		placeholder: "About page intro text",
	},
	{ key: "visionText", label: "Vision text", placeholder: "Vision description" },
	{
		key: "missionText",
		label: "Mission text",
		placeholder: "Mission description",
	},
	{
		key: "closingText",
		label: "Closing text",
		placeholder: "Supporting paragraph below mission and vision",
	},
	{
		key: "featuresText",
		label: "Features",
		placeholder: "One feature per line",
	},
];

function getListLabel(items) {
	if (!Array.isArray(items) || items.length === 0) return "-";
	return items.map(getPlainText).join(", ");
}

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

export default function DashboardAbout() {
	const siteContent = useSiteContentAdmin();
	const [editOpen, setEditOpen] = useState(false);
	const [primaryImageFile, setPrimaryImageFile] = useState(null);
	const [secondaryImageFile, setSecondaryImageFile] = useState(null);
	const about = siteContent.content.about;

	const updateAbout = (key, value) => {
		siteContent.setDraft((draft) => ({
			...draft,
			about: { ...draft.about, [key]: value },
		}));
	};

	const openEdit = () => {
		siteContent.resetDraft();
		setPrimaryImageFile(null);
		setSecondaryImageFile(null);
		setEditOpen(true);
	};

	const closeEdit = () => {
		if (siteContent.submitting) return;
		siteContent.resetDraft();
		setPrimaryImageFile(null);
		setSecondaryImageFile(null);
		setEditOpen(false);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const saved = await siteContent.saveDraft(
			"about",
			{
				aboutPrimaryImage: primaryImageFile,
				aboutSecondaryImage: secondaryImageFile,
			},
			e.currentTarget,
		);
		if (saved) setEditOpen(false);
	};

	return (
		<>
			<DashboardHeader title="About Page" />

			<ListErrorBanner
				message={siteContent.listError}
				onRetry={siteContent.loadSiteContent}
			/>

			<div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[1180px] border-collapse text-left text-sm">
						<thead>
							<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
								{[
									"SN",
									"Heading",
									"Description",
									"Vision",
									"Mission",
									"Experience",
									"Features",
									"Primary Image",
									"Secondary Image",
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
										colSpan={11}
										className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
									>
										Loading about page content...
									</td>
								</tr>
							) : (
								<tr className="text-slate-600 dark:text-slate-300">
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										1
									</td>
									<td className="max-w-56 border border-slate-200 px-4 py-4 font-medium text-slate-800 dark:border-slate-700 dark:text-slate-100">
										<p className="line-clamp-2">{about.heading || "-"}</p>
									</td>
									<td className="max-w-72 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-3">
											{getPlainText(about.description) || "-"}
										</p>
									</td>
									<td className="max-w-72 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-2">{getPlainText(about.visionText)}</p>
									</td>
									<td className="max-w-72 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-2">{getPlainText(about.missionText)}</p>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{about.experienceYears} {about.experienceLabel}
									</td>
									<td className="max-w-64 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-3">{getListLabel(about.features)}</p>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<ImagePreview
											src={about.primaryImageUrl}
											alt="About primary"
										/>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<ImagePreview
											src={about.secondaryImageUrl}
											alt="About secondary"
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
				titleId="about-content-form-title"
				title="Edit about page content"
				closeDisabled={siteContent.submitting}
				panelClassName="max-w-3xl"
			>
				<form
					className="mt-4 max-h-[75vh] space-y-4 overflow-y-auto pr-1"
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

					<div className="grid gap-4 sm:grid-cols-2">
						{textFields.map((field) => (
							<div
								key={field.key}
								className={field.key === "heading" ? "sm:col-span-2" : ""}
							>
								<label
									htmlFor={`about-${field.key}`}
									className={labelClass}
								>
									{field.label}
								</label>
								<input
									id={`about-${field.key}`}
									className={inputClass}
									value={siteContent.draft.about[field.key]}
									onChange={(e) => updateAbout(field.key, e.target.value)}
									placeholder={field.placeholder}
									disabled={siteContent.submitting}
								/>
							</div>
						))}
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label
								htmlFor="about-primary-image"
								className={labelClass}
							>
								Primary image
							</label>
							<input
								id="about-primary-image"
								type="file"
								accept="image/*"
								className={inputClass}
								onChange={(e) => setPrimaryImageFile(e.target.files?.[0] || null)}
								disabled={siteContent.submitting}
							/>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
									Current image:
								</p>
								<a
									href={siteContent.draft.about.primaryImageUrl}
									target="_blank"
									rel="noreferrer"
									className="text-xs text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
								>
									view image
								</a>
							</div>
							{/* <div className="text-sm text-slate-600 dark:text-slate-300">
								<p>current image:</p>
								<p>{siteContent.draft.about.primaryImageUrl}</p>
							</div> */}
						</div>

						<div>
							<label
								htmlFor="about-secondary-image"
								className={labelClass}
							>
								Secondary image
							</label>
							<input
								id="about-secondary-image"
								type="file"
								accept="image/*"
								className={inputClass}
								onChange={(e) => setSecondaryImageFile(e.target.files?.[0] || null)}
								disabled={siteContent.submitting}
							/>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
									Current image
								</p>
								<a
									href={siteContent.draft.about.secondaryImageUrl}
									target="_blank"
									rel="noreferrer"
									className="text-xs text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
								>
									view image
								</a>
							</div>
							{/* <div className="text-sm text-slate-600 dark:text-slate-300">
								<p>secondary image:</p>
								<p>{siteContent.draft.about.secondaryImageUrl}</p>
							</div> */}
						</div>
					</div>

					<div className="grid gap-4">
						{textAreas.map((field) => (
							<div key={field.key}>
								<label
									htmlFor={`about-${field.key}`}
									className={labelClass}
								>
									{field.label}
								</label>
								<CkEditorField
									value={siteContent.draft.about[field.key]}
									disabled={siteContent.submitting}
									minHeight={field.key === "featuresText" ? 220 : 260}
									onChange={(value) => updateAbout(field.key, value)}
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
