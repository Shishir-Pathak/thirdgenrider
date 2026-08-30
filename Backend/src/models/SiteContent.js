import { pool } from "../config/db.js";


const SiteContent = {


	// Get complete site content
	async findOne() {


		const content = {};



		// HOME HERO
		const [heroRows] = await pool.query(
			`
			SELECT *
			FROM site_home_hero
			ORDER BY id ASC
			LIMIT 1
			`
		);



		content.homeHero = heroRows.length
			? {
				title: heroRows[0].title || "",
				subtitle: heroRows[0].subtitle || "",
				buttonText: heroRows[0].button_text || "",
				imageUrl: heroRows[0].image_url || ""
			}
			: {};






		// ABOUT

		const [aboutRows] = await pool.query(
			`
			SELECT *
			FROM site_about
			ORDER BY id ASC
			LIMIT 1
			`
		);



		content.about = aboutRows.length
			? {

				heading: aboutRows[0].heading || "",

				description:
					aboutRows[0].description || "",

				visionText:
					aboutRows[0].vision_text || "",

				missionText:
					aboutRows[0].mission_text || "",

				closingText:
					aboutRows[0].closing_text || "",

				experienceYears:
					aboutRows[0].experience_years || "",

				experienceLabel:
					aboutRows[0].experience_label || "",

				primaryImageUrl:
					aboutRows[0].primary_image_url || "",

				secondaryImageUrl:
					aboutRows[0].secondary_image_url || "",

			features: (() => {
    if (!aboutRows[0].features) return [];

    try {
        return JSON.parse(aboutRows[0].features);
    } catch {
        return [aboutRows[0].features];
    }
})()

			}
			: {};






		// PROCESS

		const [processRows] = await pool.query(
			`
			SELECT *
			FROM site_process
			ORDER BY id ASC
			LIMIT 1
			`
		);



		if(processRows.length){


			const processId = processRows[0].id;



			const [steps] = await pool.query(
				`
				SELECT *
				FROM site_process_steps
				WHERE process_id=?
				ORDER BY id ASC
				`,
				[processId]
			);



			content.process = {

				heading:
					processRows[0].heading || "",

				subheading:
					processRows[0].subheading || "",

				description:
					processRows[0].description || "",

				backgroundImageUrl:
					processRows[0].background_image_url || "",

				steps:
					steps.map(step => ({
						number: step.number,
						title: step.title,
						description: step.description
					}))

			};


		}
		else {

			content.process = {};

		}








		// SERVICE

		const [serviceRows] = await pool.query(
			`
			SELECT *
			FROM site_service
			ORDER BY id ASC
			LIMIT 1
			`
		);



		if(serviceRows.length){


			const serviceId =
				serviceRows[0].id;



			const [cards] =
				await pool.query(
					`
					SELECT *
					FROM site_service_cards
					WHERE service_id=?
					`,
					[serviceId]
				);



			const [stats] =
				await pool.query(
					`
					SELECT *
					FROM site_service_stats
					WHERE service_id=?
					`,
					[serviceId]
				);



			const [reviews] =
				await pool.query(
					`
					SELECT *
					FROM site_service_reviews
					WHERE service_id=?
					`,
					[serviceId]
				);



			content.service = {

				heading:
					serviceRows[0].heading || "",

				description:
					serviceRows[0].description || "",


				cards:
					cards.map(card=>({
						icon:card.icon,
						title:card.title,
						description:card.description
					})),


				statsBackgroundImageUrl:
					serviceRows[0].stats_background_image_url || "",


				stats:
					stats.map(stat=>({
						icon:stat.icon,
						number:stat.number,
						label:stat.label
					})),


				reviewsHeading:
					serviceRows[0].reviews_heading || "",


				reviewsDescription:
					serviceRows[0].reviews_description || "",


				reviews:
					reviews.map(review=>({
						name:review.name,
						review:review.review
					}))

			};


		}
		else {

			content.service={};

		}



		return content;
	},

	async update(payload) {
		// ---------------- HOME HERO ----------------
		if (payload.homeHero) {
			const [heroRows] = await pool.query(
				"SELECT id FROM site_home_hero ORDER BY id ASC LIMIT 1"
			);

			if (heroRows.length === 0) {
				await pool.query(
					`
					INSERT INTO site_home_hero
					(title, subtitle, button_text, image_url)
					VALUES (?, ?, ?, ?)
					`,
					[
						payload.homeHero.title || "",
						payload.homeHero.subtitle || "",
						payload.homeHero.buttonText || "",
						payload.homeHero.imageUrl || "",
					]
				);
			} else {
				await pool.query(
					`
					UPDATE site_home_hero
					SET title=?, subtitle=?, button_text=?, image_url=?
					WHERE id=?
					`,
					[
						payload.homeHero.title || "",
						payload.homeHero.subtitle || "",
						payload.homeHero.buttonText || "",
						payload.homeHero.imageUrl || "",
						heroRows[0].id,
					]
				);
			}
		}

		// ---------------- ABOUT ----------------
		if (payload.about) {
			const [aboutRows] = await pool.query(
				"SELECT id FROM site_about ORDER BY id ASC LIMIT 1"
			);

			if (aboutRows.length === 0) {
				await pool.query(
					`
					INSERT INTO site_about
					(
						heading,
						description,
						vision_text,
						mission_text,
						closing_text,
						experience_years,
						experience_label,
						primary_image_url,
						secondary_image_url,
						features
					)
					VALUES (?,?,?,?,?,?,?,?,?,?)
					`,
					[
						payload.about.heading || "",
						payload.about.description || "",
						payload.about.visionText || "",
						payload.about.missionText || "",
						payload.about.closingText || "",
						payload.about.experienceYears || "",
						payload.about.experienceLabel || "",
						payload.about.primaryImageUrl || "",
						payload.about.secondaryImageUrl || "",
						JSON.stringify(payload.about.features || []),
					]
				);
			} else {
				await pool.query(
					`
					UPDATE site_about
					SET
						heading=?,
						description=?,
						vision_text=?,
						mission_text=?,
						closing_text=?,
						experience_years=?,
						experience_label=?,
						primary_image_url=?,
						secondary_image_url=?,
						features=?
					WHERE id=?
					`,
					[
						payload.about.heading || "",
						payload.about.description || "",
						payload.about.visionText || "",
						payload.about.missionText || "",
						payload.about.closingText || "",
						payload.about.experienceYears || "",
						payload.about.experienceLabel || "",
						payload.about.primaryImageUrl || "",
						payload.about.secondaryImageUrl || "",
						JSON.stringify(payload.about.features || []),
						aboutRows[0].id,
					]
				);
			}
		}

		// ---------------- PROCESS ----------------
		if (payload.process) {
			const [processRows] = await pool.query(
				"SELECT id FROM site_process ORDER BY id ASC LIMIT 1"
			);

			let processId;

			if (processRows.length === 0) {
				const [result] = await pool.query(
					`
					INSERT INTO site_process
					(heading, subheading, description, background_image_url)
					VALUES (?, ?, ?, ?)
					`,
					[
						payload.process.heading || "",
						payload.process.subheading || "",
						payload.process.description || "",
						payload.process.backgroundImageUrl || "",
					]
				);
				processId = result.insertId;
			} else {
				processId = processRows[0].id;
				await pool.query(
					`
					UPDATE site_process
					SET heading=?, subheading=?, description=?, background_image_url=?
					WHERE id=?
					`,
					[
						payload.process.heading || "",
						payload.process.subheading || "",
						payload.process.description || "",
						payload.process.backgroundImageUrl || "",
						processId,
					]
				);
				await pool.query(
					"DELETE FROM site_process_steps WHERE process_id=?",
					[processId]
				);
			}

			if (Array.isArray(payload.process.steps)) {
				for (const step of payload.process.steps) {
					await pool.query(
						`
						INSERT INTO site_process_steps
						(process_id, number, title, description)
						VALUES (?, ?, ?, ?)
						`,
						[
							processId,
							step.number || "",
							step.title || "",
							step.description || "",
						]
					);
				}
			}
		}

		// ---------------- SERVICE ----------------
		if (payload.service) {
			const [serviceRows] = await pool.query(
				"SELECT id FROM site_service ORDER BY id ASC LIMIT 1"
			);

			let serviceId;

			if (serviceRows.length === 0) {
				const [result] = await pool.query(
					`
					INSERT INTO site_service
					(
						heading,
						description,
						stats_background_image_url,
						reviews_heading,
						reviews_description
					)
					VALUES (?,?,?,?,?)
					`,
					[
						payload.service.heading || "",
						payload.service.description || "",
						payload.service.statsBackgroundImageUrl || "",
						payload.service.reviewsHeading || "",
						payload.service.reviewsDescription || "",
					]
				);

				serviceId = result.insertId;
			} else {
				serviceId = serviceRows[0].id;

				await pool.query(
					`
					UPDATE site_service
					SET
						heading=?,
						description=?,
						stats_background_image_url=?,
						reviews_heading=?,
						reviews_description=?
					WHERE id=?
					`,
					[
						payload.service.heading || "",
						payload.service.description || "",
						payload.service.statsBackgroundImageUrl || "",
						payload.service.reviewsHeading || "",
						payload.service.reviewsDescription || "",
						serviceId,
					]
				);

				await pool.query(
					"DELETE FROM site_service_cards WHERE service_id=?",
					[serviceId]
				);

				await pool.query(
					"DELETE FROM site_service_stats WHERE service_id=?",
					[serviceId]
				);

				await pool.query(
					"DELETE FROM site_service_reviews WHERE service_id=?",
					[serviceId]
				);
			}

			if (Array.isArray(payload.service.cards)) {
				for (const card of payload.service.cards) {
					await pool.query(
						`
						INSERT INTO site_service_cards
						(service_id, icon, title, description)
						VALUES (?,?,?,?)
						`,
						[
							serviceId,
							card.icon || "",
							card.title || "",
							card.description || "",
						]
					);
				}
			}

			if (Array.isArray(payload.service.stats)) {
				for (const stat of payload.service.stats) {
					await pool.query(
						`
						INSERT INTO site_service_stats
						(service_id, icon, number, label)
						VALUES (?,?,?,?)
						`,
						[
							serviceId,
							stat.icon || "",
							stat.number || "",
							stat.label || "",
						]
					);
				}
			}

			if (Array.isArray(payload.service.reviews)) {
				for (const review of payload.service.reviews) {
					await pool.query(
						`
						INSERT INTO site_service_reviews
						(service_id, name, review)
						VALUES (?,?,?)
						`,
						[
							serviceId,
							review.name || "",
							review.review || "",
						]
					);
				}
			}
		}
	},
};

export default SiteContent;