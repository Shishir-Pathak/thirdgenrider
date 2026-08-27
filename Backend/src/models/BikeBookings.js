import { pool } from "../config/db.js";

const BikeBooking = {
  // Get all bike bookings (optionally filtered by owner userId)
  async findAll(userId = null) {
    const conditions = [];
    const params = [];

    if (userId !== null && userId !== undefined) {
      conditions.push("b.userId = ?");
      params.push(userId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        bb.*,
        b.name AS bike_name,
        b.image AS bike_image,
        b.userId AS bike_owner_id,
        u.business_name AS owner_business_name,
        u.first_name AS owner_first_name,
        u.last_name AS owner_last_name
      FROM bike_bookings bb
      LEFT JOIN bikes b 
        ON bb.bike_id = b.id
      LEFT JOIN users u
        ON b.userId = u.id
      ${whereClause}
      ORDER BY bb.created_at DESC
    `;

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Get booking by ID
  async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        bb.*,
        b.name AS bike_name,
        b.image AS bike_image,
        b.userId AS bike_owner_id,
        u.business_name AS owner_business_name,
        u.first_name AS owner_first_name,
        u.last_name AS owner_last_name
      FROM bike_bookings bb
      LEFT JOIN bikes b 
        ON bb.bike_id = b.id
      LEFT JOIN users u
        ON b.userId = u.id
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
        message,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        data.status || "confirmed",
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
        message=?,
        status=?
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
        data.status || "confirmed",
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
