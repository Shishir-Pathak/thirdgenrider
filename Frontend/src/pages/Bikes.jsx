import React from "react";
import VechileCategories from "../components/VechileCategories";
import ProcessSection from "../components/ProcessSection";

const Bikes = () => {
	return (
		<div>
			<section>
				<VechileCategories
					initialCategory="bikes"
					title="Our Motorbikes & Scooters Fleet"
					subtitle="Rent high-performance motorbikes, dirt bikes, and city scooters for mountain trails and daily rides across Nepal."
				/>
			</section>
			<section>
				<ProcessSection />
			</section>
		</div>
	);
};

export default Bikes;
