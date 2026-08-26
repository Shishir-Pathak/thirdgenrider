import { pool } from "../config/db.js";

const BikeBooking = {
  // Get all bike bookings
  async findAll() {
    const [rows] = await pool.query(
      `
			SELECT 
				bb.*,
				b.name AS bike_name
			FROM bike_bookings bb
			LEFT JOIN bikes b 
				ON bb.bike_id = b.id
			ORDER BY bb.created_at DESC
			`,
    );

    return rows;
  },

  // Get booking by ID
  async findById(id) {
    const [rows] = await pool.query(
      `
			SELECT 
				bb.*,
				b.name AS bike_name
			FROM bike_bookings bb
			LEFT JOIN bikes b 
				ON bb.bike_id = b.id
			WHERE bb.id = ?
			`,
      [id],
    );

    return rows.length ? rows[0] : null;
  },

  // Create booking
  async create(data) {
    const [result] = await pool.query(
      `
			INSERT INTO bike_bookings
			(
				bike_id,
				customer_name,
				customer_email,
				customer_phone,
				pickup_date,
				return_date,
				pickup_location,
				return_location,
				message
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
      [
        data.bike,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.pickupDate,
        data.returnDate,
        data.pickupLocation,
        data.returnLocation,
        data.message || "",
      ],
    );

    return this.findById(result.insertId);
  },

  // Update booking
  async update(id, data) {
    await pool.query(
      `
			UPDATE bike_bookings SET

				bike_id=?,
				customer_name=?,
				customer_email=?,
				customer_phone=?,
				pickup_date=?,
				return_date=?,
				pickup_location=?,
				return_location=?,
				message=?

			WHERE id=?

			`,
      [
        data.bike,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.pickupDate,
        data.returnDate,
        data.pickupLocation,
        data.returnLocation,
        data.message || "",
        id,
      ],
    );

    return this.findById(id);
  },

  // Delete booking
  async delete(id) {
    const [result] = await pool.query("DELETE FROM bike_bookings WHERE id=?", [
      id,
    ]);

    return result.affectedRows > 0;
  },
};

export default BikeBooking;
