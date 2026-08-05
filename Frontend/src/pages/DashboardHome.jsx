import { useState } from "react";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import DashboardButton from "../components/dashboard/DashboardButton";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import Modal from "../components/dashboard/Modal";
import { formatDateTime } from "../components/dashboard/BikeBookingsTable";
import { inputClass, labelClass } from "../components/dashboard/bikeFormStyles";
import { useSiteContentAdmin } from "../hooks/useSiteContentAdmin";
import heroImage from "../assets/hero.jpg";

const fieldRows = [
	{
		key: "title",
		label: "Hero title",
		placeholder: "Rent Your Dream Bike Today",
	},
	{
		key: "subtitle",
		label: "Hero subtitle",
		placeholder: "Affordable - Reliable - Comfortable",
	},
	{ key: "buttonText", label: "Button text", placeholder: "Book Now" },
];

function ImagePreview({ src, fallbackSrc, alt }) {
	const imageSrc = src || fallbackSrc;
	if (!imageSrc) return <span className="text-slate-400">-</span>;

	return (
		<img
			src={imageSrc}
			alt={alt}
			className="h-16 w-24 rounded object-cover shadow-sm"
		/>
	);
}

export default function DashboardHome() {
	const siteContent = useSiteContentAdmin();
	const [editOpen, setEditOpen] = useState(false);
	const [processEditOpen, setProcessEditOpen] = useState(false);
	const [heroImageFile, setHeroImageFile] = useState(null);
	const [processBackgroundImageFile, setProcessBackgroundImageFile] =
		useState(null);
	const hero = siteContent.content.homeHero;
	const process = siteContent.content.process;
	const currentHeroImage = hero.imageUrl || heroImage;

	const updateHero = (key, value) => {
		siteContent.setDraft((draft) => ({
			...draft,
			homeHero: { ...draft.homeHero, [key]: value },
		}));
	};

	const updateProcess = (key, value) => {
		siteContent.setDraft((draft) => ({
			...draft,
			process: { ...draft.process, [key]: value },
		}));
	};

	const updateProcessStep = (index, key, value) => {
		siteContent.setDraft((draft) => ({
			...draft,
			process: {
				...draft.process,
				steps: draft.process.steps.map((step, stepIndex) =>
					stepIndex === index ? { ...step, [key]: value } : step,
				),
			},
		}));
	};

	const addProcessStep = () => {
		siteContent.setDraft((draft) => ({
			...draft,
			process: {
				...draft.process,
				steps: [
					...draft.process.steps,
					{
						number: `${String(draft.process.steps.length + 1).padStart(2, "0")}.`,
						title: "",
						description: "",
					},
				],
			},
		}));
	};

	const removeProcessStep = (index) => {
		siteContent.setDraft((draft) => ({
			...draft,
			process: {
				...draft.process,
				steps: draft.process.steps.filter((_, stepIndex) => stepIndex !== index),
			},
		}));
	};

	const openEdit = () => {
		siteContent.resetDraft();
		setHeroImageFile(null);
		setEditOpen(true);
	};

	const closeEdit = () => {
		if (siteContent.submitting) return;
		siteContent.resetDraft();
		setHeroImageFile(null);
		setEditOpen(false);
	};

	const openProcessEdit = () => {
		siteContent.resetDraft();
		setProcessBackgroundImageFile(null);
		setProcessEditOpen(true);
	};

	const closeProcessEdit = () => {
		if (siteContent.submitting) return;
		siteContent.resetDraft();
		setProcessBackgroundImageFile(null);
		setProcessEditOpen(false);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const saved = await siteContent.saveDraft("homeHero", {
			homeHeroImage: heroImageFile,
		}, e.currentTarget);
		if (saved) setEditOpen(false);
	};

	const onProcessSubmit = async (e) => {
		e.preventDefault();
		const saved = await siteContent.saveDraft("process", {
			processBackgroundImage: processBackgroundImageFile,
		}, e.currentTarget);
		if (saved) setProcessEditOpen(false);
	};

	return (
		<>
			<DashboardHeader title="Home Page" />

			<ListErrorBanner
				message={siteContent.listError}
				onRetry={siteContent.loadSiteContent}
			/>

			<div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[980px] border-collapse text-left text-sm">
						<thead>
							<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
								{[
									"SN",
									"Section",
									"Title",
									"Subtitle",
									"Button",
									"Image",
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
										colSpan={8}
										className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
									>
										Loading home page content...
									</td>
								</tr>
							) : (
								<>
									<tr className="text-slate-600 dark:text-slate-300">
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											1
										</td>
										<td className="border border-slate-200 px-4 py-4 font-medium text-slate-800 dark:border-slate-700 dark:text-slate-100">
											Hero Section
										</td>
										<td className="max-w-64 border border-slate-200 px-4 py-4 dark:border-slate-700">
											<p className="line-clamp-2">{hero.title}</p>
										</td>
										<td className="max-w-72 border border-slate-200 px-4 py-4 dark:border-slate-700">
											<p className="line-clamp-2">{hero.subtitle}</p>
										</td>
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											{hero.buttonText}
										</td>
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											<ImagePreview
												src={hero.imageUrl}
												fallbackSrc={heroImage}
												alt="Home hero"
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
									<tr className="text-slate-600 dark:text-slate-300">
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											2
										</td>
										<td className="border border-slate-200 px-4 py-4 font-medium text-slate-800 dark:border-slate-700 dark:text-slate-100">
											Process Section
										</td>
										<td className="max-w-64 border border-slate-200 px-4 py-4 dark:border-slate-700">
											<p className="line-clamp-2">
												{process.heading} {process.subheading}
											</p>
										</td>
										<td className="max-w-72 border border-slate-200 px-4 py-4 dark:border-slate-700">
											<p className="line-clamp-2">{process.description}</p>
										</td>
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											{process.steps.length} steps
										</td>
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											<ImagePreview
												src={process.backgroundImageUrl}
												alt="Process background"
											/>
										</td>
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											{formatDateTime(siteContent.content.updatedAt)}
										</td>
										<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
											<DashboardButton
												type="button"
												onClick={openProcessEdit}
												variant="primary"
												size="sm"
												icon={Edit}
											>
												Edit
											</DashboardButton>
										</td>
									</tr>
								</>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal
				open={editOpen}
				onClose={closeEdit}
				titleId="home-content-form-title"
				title="Edit home page hero"
				closeDisabled={siteContent.submitting}
				panelClassName="max-w-2xl"
			>
				<form
					className="mt-4 space-y-4"
					onSubmit={onSubmit}
				>
					{siteContent.formError && (
						<p data-form-error tabIndex={-1} className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
							{siteContent.formError}
						</p>
					)}

					<div className="grid gap-4 sm:grid-cols-2">
						{fieldRows.map((field) => (
							<div
								key={field.key}
								className={
									field.key === "title" || field.key === "imageUrl"
										? "sm:col-span-2"
										: ""
								}
							>
								<label
									htmlFor={`home-${field.key}`}
									className={labelClass}
								>
									{field.label}
								</label>
								<input
									id={`home-${field.key}`}
									className={inputClass}
									value={siteContent.draft.homeHero[field.key]}
									onChange={(e) => updateHero(field.key, e.target.value)}
									placeholder={field.placeholder}
									disabled={siteContent.submitting}
								/>
							</div>
						))}
					</div>

					<div>
						<label
							htmlFor="home-hero-image"
							className={labelClass}
						>
							Background image
						</label>
						<input
							id="home-hero-image"
							type="file"
							accept="image/*"
							className={inputClass}
							onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
							disabled={siteContent.submitting}
						/>

						<div className="text-sm text-slate-600 dark:text-slate-300">
							<p>hero image:</p>
							<p>{siteContent.draft.homeHero.imageUrl}</p>
						</div>
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

			<Modal
				open={processEditOpen}
				onClose={closeProcessEdit}
				titleId="process-content-form-title"
				title="Edit process section"
				closeDisabled={siteContent.submitting}
				panelClassName="max-w-3xl"
			>
				<form
					className="mt-4 max-h-[75vh] space-y-4 overflow-y-auto pr-1"
					onSubmit={onProcessSubmit}
				>
					{siteContent.formError && (
						<p data-form-error tabIndex={-1} className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
							{siteContent.formError}
						</p>
					)}

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="process-heading" className={labelClass}>
								Heading
							</label>
							<input
								id="process-heading"
								className={inputClass}
								value={siteContent.draft.process.heading}
								onChange={(e) => updateProcess("heading", e.target.value)}
								disabled={siteContent.submitting}
							/>
						</div>
						<div>
							<label htmlFor="process-subheading" className={labelClass}>
								Subheading
							</label>
							<input
								id="process-subheading"
								className={inputClass}
								value={siteContent.draft.process.subheading}
								onChange={(e) => updateProcess("subheading", e.target.value)}
								disabled={siteContent.submitting}
							/>
						</div>
					</div>

					<div>
						<label htmlFor="process-description" className={labelClass}>
							Description
						</label>
						<textarea
							id="process-description"
							className={`${inputClass} min-h-24 resize-y`}
							value={siteContent.draft.process.description}
							onChange={(e) => updateProcess("description", e.target.value)}
							disabled={siteContent.submitting}
						/>
					</div>

					<div>
						<label htmlFor="process-background-image" className={labelClass}>
							Background image
						</label>
						<input
							id="process-background-image"
							type="file"
							accept="image/*"
							className={inputClass}
							onChange={(e) =>
								setProcessBackgroundImageFile(e.target.files?.[0] || null)
							}
							disabled={siteContent.submitting}
						/>
						<div className="min-w-0 flex-1">
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
								Current background image
							</p>
							<a
								href={siteContent.draft.process.backgroundImageUrl}
								target="_blank"
								rel="noreferrer"
								className="text-xs text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
							>
								view image
							</a>
						</div>
						{/* <div className="text-sm text-slate-600 dark:text-slate-300">
							<p>current image:</p>
							<p>{siteContent.draft.process.backgroundImageUrl}</p>
						</div> */}
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between gap-3">
							<p className={labelClass}>Steps</p>
							<DashboardButton
								type="button"
								onClick={addProcessStep}
								disabled={siteContent.submitting}
								variant="secondary"
								size="sm"
								icon={Plus}
							>
								Add step
							</DashboardButton>
						</div>
						{siteContent.draft.process.steps.map((step, index) => (
							<div
								key={index}
								className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
										Step {index + 1}
									</p>
									<DashboardButton
										type="button"
										onClick={() => removeProcessStep(index)}
										disabled={siteContent.submitting}
										variant="danger"
										size="sm"
										icon={Trash2}
									>
										Remove
									</DashboardButton>
								</div>
								<div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr]">
									<input
										className={inputClass}
										value={step.number}
										onChange={(e) =>
											updateProcessStep(index, "number", e.target.value)
										}
										placeholder="01."
										disabled={siteContent.submitting}
									/>
									<input
										className={inputClass}
										value={step.title}
										onChange={(e) =>
											updateProcessStep(index, "title", e.target.value)
										}
										placeholder="Step title"
										disabled={siteContent.submitting}
									/>
								</div>
								<div className="mt-3">
									<textarea
										className={`${inputClass} min-h-20 resize-y`}
										value={step.description}
										onChange={(e) =>
											updateProcessStep(index, "description", e.target.value)
										}
										placeholder="Step description"
										disabled={siteContent.submitting}
									/>
								</div>
							</div>
						))}
					</div>

					<div className="flex flex-wrap justify-end gap-2 pt-2">
						<DashboardButton
							type="button"
							onClick={closeProcessEdit}
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
