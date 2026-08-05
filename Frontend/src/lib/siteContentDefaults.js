export const defaultSiteContent = {
	homeHero: {
		title: "Rent Your Dream Bike Today",
		subtitle: "Affordable - Reliable - Comfortable",
		buttonText: "Book Now",
		imageUrl: "",
	},
	about: {
		heading: "",
		description: "",
		visionTitle: "Our Vision",
		visionText:
			"To become the most trusted and preferred car rental service provider by continuously improving our services, embracing innovation and building long-term relationships with our customers.",
		missionTitle: "Our Mission",
		missionText:
			"To deliver convenient, affordable, and high-quality bike rental services that exceed customer expectations while ensuring safety, comfort, support and reliability in every ride.",
		closingText:
			"We believe every journey matters. That's why we focus on customer satisfaction, transparent pricing, and maintaining a fleet of vehicles that meet the highest standards. Your comfort and trust drive everything we do.",
		experienceYears: "5+",
		experienceLabel: "Years Of Experience",
		features: [
			"Trusted by thousands",
			"We focus on quality service",
			"Modern vehicles",
			"Transparent pricing",
		],
		primaryImageUrl:
			"https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
		secondaryImageUrl:
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
	},
	process: {
		heading: "Travel Agency",
		subheading: "Process",
		description:
			"Bike rental made easy! Follow our simple 3-step process to get on the road in no time. Choose your bike, book online, and enjoy your ride!",
		backgroundImageUrl:
			"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80",
		steps: [
			{
				number: "01.",
				title: "Come In Contact",
				description:
					"Come in contact with us to get more information about our bike rental services.",
			},
			{
				number: "02.",
				title: "Choose A Bike",
				description: "Browse our fleet and select the perfect bike for your needs.",
			},
			{
				number: "03.",
				title: "Enjoy Riding",
				description:
					"Sit back, relax, and enjoy your journey with our reliable and comfortable bikes.",
			},
		],
	},
	service: {
		heading: "Our Services",
		description:
			"Explore our comprehensive range of car rental services designed to meet your needs. From short-term rentals to long-term leases, we offer flexible options for individuals and businesses alike. Our services include a wide selection of vehicles, competitive pricing, and exceptional customer support to ensure a seamless rental experience.",
		cards: [
			{
				icon: "Car",
				title: "Wide Vehicle Selection",
				description:
					"Choose from a diverse fleet of cars, SUVs, and luxury vehicles for every type of journey.",
			},
			{
				icon: "ShieldCheck",
				title: "Full Insurance Coverage",
				description:
					"Travel with confidence using our comprehensive insurance coverage on every rental.",
			},
			{
				icon: "Headphones",
				title: "24/7 Customer Support",
				description:
					"Our support team is available anytime for bookings, queries, and roadside assistance.",
			},
		],
		statsBackgroundImageUrl:
			"https://media.istockphoto.com/id/1190475811/photo/rush-in-the-city.webp?a=1&b=1&s=612x612&w=0&k=20&c=pgEobykYrVwHxzRyCKixA6TSA4wh4yCyj_aY9TuqLm4=",
		stats: [
			{ icon: "Car", number: "120+", label: "Cars Available" },
			{ icon: "Users", number: "3500+", label: "Happy Customers" },
			{ icon: "MapPin", number: "25+", label: "Cities Covered" },
			{ icon: "Briefcase", number: "25+", label: "Years Experience" },
		],
		reviewsHeading: "Our Clients Reviews",
		reviewsDescription: "Hear what our clients have to say about us!",
		reviews: [
			{ name: "Rudra pratap adhikari", review: "Great service." },
			{ name: "Sanjana", review: "Excellent experience overall" },
			{
				name: "Aayush Sharma",
				review:
					"Great service for a family trip. The SUV was in good condition and the pricing was fair.",
			},
			{
				name: "Pratik Gurung",
				review:
					"Booking was quick and support was helpful when I needed to extend my rental by one day.",
			},
		],
	},
};

export function mergeSiteContent(content) {
	return {
		...defaultSiteContent,
		...(content || {}),
		homeHero: {
			...defaultSiteContent.homeHero,
			...(content?.homeHero || {}),
		},
		about: {
			...defaultSiteContent.about,
			...(content?.about || {}),
			features: content?.about?.features?.length
				? content.about.features
				: defaultSiteContent.about.features,
		},
		process: {
			...defaultSiteContent.process,
			...(content?.process || {}),
			steps: content?.process?.steps?.length
				? content.process.steps.map((step, index) => ({
						number:
							step.number || `${String(index + 1).padStart(2, "0")}.`,
						title: step.title || "",
						description: step.description || "",
					}))
				: defaultSiteContent.process.steps,
		},
		service: {
			...defaultSiteContent.service,
			...(content?.service || {}),
			cards: content?.service?.cards?.length
				? content.service.cards
				: defaultSiteContent.service.cards,
			stats: content?.service?.stats?.length
				? content.service.stats
				: defaultSiteContent.service.stats,
			reviews: content?.service?.reviews?.length
				? content.service.reviews
				: defaultSiteContent.service.reviews,
		},
	};
}
