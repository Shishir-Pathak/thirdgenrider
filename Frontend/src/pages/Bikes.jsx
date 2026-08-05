import React from "react";
import TopSection from "../components/TopSection";
import VechileCategories from "../components/VechileCategories";
import ProcessSection from "../components/ProcessSection";

const Bikes = () => {
	const topSectionData = {
		title: "Our Bikes",
		breadcrumb: "Home / Pages / Bikes",
	};
	return (
		<div>
			<section className="bg-gray-100">
				{/* <TopSection data = {topSectionData} /> */}
			</section>
			<section>
				<VechileCategories />
			</section>
			<section>
				<ProcessSection />
			</section>
		</div>
	);
};

export default Bikes;
