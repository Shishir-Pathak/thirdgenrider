import { pool } from "../config/db.js";


const PackageBooking = {


	// Get all package bookings
	async findAll() {

		const [rows] = await pool.query(
			`
			SELECT 
				pb.*,
				p.title AS package_title

			FROM package_bookings pb

			LEFT JOIN packages p
				ON pb.package_id = p.id

			ORDER BY pb.created_at DESC
			`
		);


		return rows;

	},





	// Get package booking by ID
	async findById(id) {

		const [rows] = await pool.query(
			`
			SELECT 
				pb.*,
				p.title AS package_title

			FROM package_bookings pb

			LEFT JOIN packages p
				ON pb.package_id = p.id

			WHERE pb.id = ?
			`,
			[id]
		);



		return rows.length ? rows[0] : null;

	},






	// Create package booking
	async create(data) {


		const [result] = await pool.query(
			`
			INSERT INTO package_bookings
			(
				package_id,
				customer_name,
				customer_email,
				customer_phone,
				number_of_people,
				pickup_date,
				return_date,
				pickup_location,
				return_location,
				message
			)

			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

			`,
			[
				data.package,
				data.customerName,
				data.customerEmail,
				data.customerPhone,
				data.numberOfPeople,
				data.pickupDate,
				data.returnDate,
				data.pickupLocation,
				data.returnLocation,
				data.message || ""
			]
		);



		return this.findById(result.insertId);

	},






	// Update package booking
	async update(id,data) {


		await pool.query(
			`
			UPDATE package_bookings SET

				package_id=?,
				customer_name=?,
				customer_email=?,
				customer_phone=?,
				number_of_people=?,
				pickup_date=?,
				return_date=?,
				pickup_location=?,
				return_location=?,
				message=?

			WHERE id=?

			`,
			[
				data.package,
				data.customerName,
				data.customerEmail,
				data.customerPhone,
				data.numberOfPeople,
				data.pickupDate,
				data.returnDate,
				data.pickupLocation,
				data.returnLocation,
				data.message || "",
				id
			]
		);



		return this.findById(id);

	},







	// Delete package booking
	async delete(id) {


		const [result] = await pool.query(
			`
			DELETE FROM package_bookings
			WHERE id=?
			`,
			[id]
		);



		return result.affectedRows > 0;

	}


};



export default PackageBooking;