import { useState } from "react";
import { motion } from "framer-motion";
import {
	Briefcase,
	Car,
	Headphones,
	MapPin,
	Quote,
	ShieldCheck,
	Star,
	Users,
} from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import LoadingSpinner from "../components/LoadingSpinner";

const iconMap = {
	Briefcase,
	Car,
	Headphones,
	MapPin,
	ShieldCheck,
	Users,
};

function ServiceIcon({ name, className }) {
	const Icon = iconMap[name] || Car;
	return <Icon className={className} />;
}

function RichText({ html, className = "" }) {
	if (!html) return null;

	return (
		<div
			className={`rich-content ${className}`}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

const Service = () => {
	const { content, loading } = useSiteContent("service");
	const service = content.service;
	const reviewsPerPage = 2;
	const reviewPages = Array.from(
		{ length: Math.ceil(service.reviews.length / reviewsPerPage) },
		(_, index) =>
			service.reviews.slice(
				index * reviewsPerPage,
				index * reviewsPerPage + reviewsPerPage,
			),
	);
	const [activeReviewPage, setActiveReviewPage] = useState(0);
	const activeReviews = reviewPages[activeReviewPage] || [];

	if (loading) {
		return (
			<section className="min-h-[60vh] bg-white px-6 py-16">
				<div className="mx-auto flex max-w-7xl items-center justify-center">
					<LoadingSpinner label="Loading service page..." size="lg" />
				</div>
			</section>
		);
	}

	return (
		<div className="bg-white">
			<motion.section
				className="bg-white py-16"
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
			>
				<div className="mx-auto max-w-7xl px-6 text-center">
					<h2 className="text-4xl font-bold tracking-wide text-slate-950 md:text-5xl">
						{service.heading}
					</h2>

					<RichText
						html={service.description}
						className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 [&_a]:text-[#1d2c57] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
					/>
				</div>
			</motion.section>

			<section className="bg-gray-100 p-10">
				<div className="item mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
					{service.cards.map((item, index) => (
						<motion.div
							key={`${item.title}-${index}`}
							className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:shadow-xl"
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
							whileHover={{ y: -6, scale: 1.02 }}
						>
							<div className="mb-4 flex justify-center">
								<ServiceIcon
									name={item.icon}
									className="h-10 w-10 text-[var(--color-primary)]"
								/>
							</div>

							<h3 className="mb-4 text-2xl font-semibold text-gray-900">
								{item.title}
							</h3>

							<p className="leading-relaxed text-gray-600">
								{item.description}
							</p>
						</motion.div>
					))}
				</div>
			</section>

			<section
				className="h-[350px] bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${service.statsBackgroundImageUrl})`,
				}}
			>
				<div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 pt-32 text-center md:grid-cols-4">
					{service.stats.map((item, index) => (
						<div
							key={`${item.label}-${index}`}
							className="text-white"
						>
							<div className="mb-4 flex justify-center text-white">
								<ServiceIcon
									name={item.icon}
									className="h-8 w-8 text-white"
								/>
							</div>

							<h2 className="mb-2 text-4xl font-bold">{item.number}</h2>

							<p className="text-lg">{item.label}</p>
						</div>
					))}
				</div>
			</section>

			<section className="bg-gray-100 py-24">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-20 text-center">
						<h2 className="mb-4 text-5xl font-bold text-slate-900">
							{service.reviewsHeading}
						</h2>

						<p className="text-lg text-gray-500">
							{service.reviewsDescription}
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						{activeReviews.map((item, index) => (
							<div
								key={`${item.name}-${index}`}
								className="relative rounded-2xl border border-[var(--color-primary)] bg-white"
							>
								<div className="absolute -top-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-lg">
									<Quote className="h-8 w-8 text-white" />
								</div>

								<div className="px-12 pb-6 pt-10">
									<h3 className="mb-4 text-4xl font-medium text-slate-800 md:text-[38px]">
										{item.name}
									</h3>

									<div className="flex items-center gap-1">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-5 w-5 fill-slate-800 text-slate-800"
											/>
										))}
									</div>
								</div>

								<div className="border-t border-gray-200" />

								<div className="px-8 py-8">
									<p className="text-lg text-gray-500">{item.review}</p>
								</div>
							</div>
						))}
					</div>

					{reviewPages.length > 1 && (
						<div className="mt-24 flex items-center justify-center gap-6">
							{reviewPages.map((_, index) => (
								<button
									key={index}
									type="button"
									onClick={() => setActiveReviewPage(index)}
									aria-label={`Show review page ${index + 1}`}
									className={`h-7 w-7 rounded-full border-[6px] border-[var(--color-primary)] transition ${
										activeReviewPage === index
											? "border-[var(--color-primary-dark)] bg-[var(--color-primary)]"
											: "bg-transparent"
									}`}
								/>
							))}
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default Service;
