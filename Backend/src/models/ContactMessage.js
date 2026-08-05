import { pool } from "../config/db.js";


const ContactMessage = {


	// Get all contact messages
	async findAll() {


		const [rows] = await pool.query(

			`
			SELECT *
			FROM contact_messages
			ORDER BY created_at DESC
			`

		);


		return rows;

	},






	// Find message by ID
	async findById(id) {


		const [rows] = await pool.query(

			`
			SELECT *
			FROM contact_messages
			WHERE id = ?
			`,

			[id]

		);


		return rows.length ? rows[0] : null;


	},






	// Create message
	async create(data) {


		const [result] = await pool.query(

			`
			INSERT INTO contact_messages
			(
				name,
				email,
				phone,
				subject,
				message
			)

			VALUES (?, ?, ?, ?, ?)

			`,

			[
				data.name,
				data.email,
				data.phone || "",
				data.subject || "",
				data.message
			]

		);



		return this.findById(result.insertId);


	},






	// Delete message
	async delete(id) {


		const [result] = await pool.query(

			`
			DELETE FROM contact_messages
			WHERE id = ?
			`,

			[id]

		);



		return result.affectedRows > 0;


	}



};


export default ContactMessage;