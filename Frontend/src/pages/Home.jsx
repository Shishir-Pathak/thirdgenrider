import heroImage from "../assets/hero.jpg";
import VechileCategories from "../components/VechileCategories";
import ProcessSection from "../components/ProcessSection";
import { useBooking } from "../context/BookingContext";
import Package from "../components/Packages";
import { useSiteContent } from "../hooks/useSiteContent";

const Home = () => {
	const { openBookingForm } = useBooking();
	const { content } = useSiteContent("homeHero");
	const hero = content.homeHero;
	const heroBackground = hero.imageUrl || heroImage;

	return (
		<>
			<section
				className="relative h-screen bg-cover bg-center"
				style={{
					backgroundImage: `url(${heroBackground})`,
				}}
			>
				<div className="absolute inset-0 bg-black/50"></div>

				<div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
					<h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
						{hero.title}
					</h1>

					<p className="mt-6 text-lg md:text-2xl">{hero.subtitle}</p>

					<button
						type="button"
						onClick={() => openBookingForm()}
						className="mt-8 rounded-2xl bg-white px-8 py-4 text-xl font-semibold text-(--color-primary) transition duration-300 hover:bg-gray-200"
					>
						{hero.buttonText}
					</button>
				</div>
			</section>
			<section>
				<VechileCategories />
			</section>
			<section>
				<Package />
			</section>
			<section>
				<ProcessSection />
			</section>
		</>
	);
};

export default Home;
