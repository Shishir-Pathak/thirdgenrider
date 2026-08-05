import { pool } from "../config/db.js";


const CompanyDetails = {


	// Get company details
	async findOne() {


		const [rows] = await pool.query(
			`
			SELECT *
			FROM company_details
			ORDER BY id DESC
			LIMIT 1
			`
		);


		return rows.length ? rows[0] : null;

	},






	// Create company details
	async create(data) {


		const [result] = await pool.query(

			`
			INSERT INTO company_details
			(
				name,
				logo,
				contact_email,
				contact_phone,
				whatsapp,
				location,
				business_hours,
				about,
				facebook,
				tiktok,
				instagram
			)

			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

			`,

			[
				data.name,
				data.logo || "",
				data.contactEmail || "",
				data.contactPhone || "",
				data.whatsapp || "",
				data.location || "",
				data.businessHours || "",
				data.about || "",
				data.facebook || "",
				data.tiktok || "",
				data.instagram || ""
			]

		);



		return this.findById(result.insertId);


	},







	// Find by ID
	async findById(id) {


		const [rows] = await pool.query(

			`
			SELECT *
			FROM company_details
			WHERE id = ?
			`,

			[id]

		);


		return rows.length ? rows[0] : null;


	},







	// Update company details
	async update(id, data) {


		await pool.query(

			`
			UPDATE company_details SET

				name=?,
				logo=?,
				contact_email=?,
				contact_phone=?,
				whatsapp=?,
				location=?,
				business_hours=?,
				about=?,
				facebook=?,
				tiktok=?,
				instagram=?

			WHERE id=?

			`,

			[
				data.name,
				data.logo || "",
				data.contactEmail || "",
				data.contactPhone || "",
				data.whatsapp || "",
				data.location || "",
				data.businessHours || "",
				data.about || "",
				data.facebook || "",
				data.tiktok || "",
				data.instagram || "",
				id
			]

		);



		return this.findById(id);


	}



};


export default CompanyDetails;