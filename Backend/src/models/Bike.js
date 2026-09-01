import { pool } from "../config/db.js";

const Bike = {
  // Get all bikes / cars
  async findAll({ isBike, userId } = {}) {
    const conditions = [];
    const params = [];

    if (isBike !== undefined && isBike !== null) {
      conditions.push("b.isBike = ?");
      params.push(isBike ? 1 : 0);
    }

    if (userId !== undefined && userId !== null) {
      conditions.push("b.userId = ?");
      params.push(userId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        b.*,
        u.first_name,
        u.last_name,
        u.business_name,
        (
          SELECT COUNT(*)
          FROM bike_bookings bb
          WHERE bb.bike_id = b.id
            AND bb.pickup_date <= CURDATE()
            AND bb.return_date >= CURDATE()
        ) AS current_active_bookings,
        (
          SELECT COUNT(*)
          FROM bike_bookings bb
          WHERE bb.bike_id = b.id
        ) AS total_bookings_count
      FROM bikes b
      LEFT JOIN users u ON b.userId = u.id
      ${whereClause}
      ORDER BY b.created_at DESC
    `;

    const [rows] = await pool.query(query, params);

    return rows.map((bike) => ({
      ...bike,
      userId: bike.userId,
      ownerName:
        bike.business_name ||
        (bike.first_name
          ? `${bike.first_name} ${bike.last_name || ""}`.trim()
          : "Admin"),
      ownerBusiness: bike.business_name || "",
      isBooked:
        Number(bike.current_active_bookings || 0) > 0 || !bike.available,
      activeBookingsCount: Number(bike.current_active_bookings || 0),
      totalBookingsCount: Number(bike.total_bookings_count || 0),

      // CamelCase mappings
      pricePerDay: Number(bike.price_per_day),
      available: Boolean(bike.available),
      plateNumber: bike.plate_number || "",
      chassisNumber: bike.chassis_number || "",
      engineNumber: bike.engine_number || "",
      blueBookNumber: bike.blue_book_number || "",
      licenseImage: bike.license_image || "",

      // Parse bluebook images
      blueBookImages: (() => {
        try {
          return bike.blue_book_images ? JSON.parse(bike.blue_book_images) : [];
        } catch {
          return [];
        }
      })(),

      // Parse taken images
      takenImages: (() => {
        try {
          return bike.taken_images ? JSON.parse(bike.taken_images) : [];
        } catch {
          return [];
        }
      })(),
    }));
  },

  // Get single bike
  async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        b.*,
        u.first_name,
        u.last_name,
        u.business_name,
        (
          SELECT COUNT(*)
          FROM bike_bookings bb
          WHERE bb.bike_id = b.id
            AND bb.pickup_date <= CURDATE()
            AND bb.return_date >= CURDATE()
        ) AS current_active_bookings,
        (
          SELECT COUNT(*)
          FROM bike_bookings bb
          WHERE bb.bike_id = b.id
        ) AS total_bookings_count
      FROM bikes b
      LEFT JOIN users u ON b.userId = u.id
      WHERE b.id = ?
      `,
      [id],
    );

    if (rows.length === 0) return null;

    const bike = rows[0];

    return {
      ...bike,
      userId: bike.userId,
      ownerName:
        bike.business_name ||
        (bike.first_name
          ? `${bike.first_name} ${bike.last_name || ""}`.trim()
          : "Admin"),
      ownerBusiness: bike.business_name || "",
      isBooked:
        Number(bike.current_active_bookings || 0) > 0 || !bike.available,
      activeBookingsCount: Number(bike.current_active_bookings || 0),
      totalBookingsCount: Number(bike.total_bookings_count || 0),

      // CamelCase mappings
      pricePerDay: Number(bike.price_per_day),
      available: Boolean(bike.available),
      plateNumber: bike.plate_number || "",
      chassisNumber: bike.chassis_number || "",
      engineNumber: bike.engine_number || "",
      blueBookNumber: bike.blue_book_number || "",
      licenseImage: bike.license_image || "",

      // Parse bluebook images
      blueBookImages: (() => {
        try {
          return bike.blue_book_images ? JSON.parse(bike.blue_book_images) : [];
        } catch {
          return [];
        }
      })(),

      // Parse taken images
      takenImages: (() => {
        try {
          return bike.taken_images ? JSON.parse(bike.taken_images) : [];
        } catch {
          return [];
        }
      })(),
    };
  },

  // Create bike
  async create(data) {
    const [result] = await pool.query(
      `
      INSERT INTO bikes
      (
        userId,
        name,
        price_per_day,
        image,
        model,
        color,
        plate_number,
        chassis_number,
        engine_number,
        mileage,
        available,
        engine_capacity,
        blue_book_number,
        blue_book_images,
        license_image,
        taken_images,
        isBike
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.userId || null,
        data.name,
        data.pricePerDay,
        data.image || "",
        data.model || "",
        data.color || "",
        data.plateNumber || "",
        data.chassisNumber || "",
        data.engineNumber || "",
        data.mileage || 0,
        data.available === undefined ? 1 : data.available ? 1 : 0,
        data.engineCapacity || 0,
        data.blueBookNumber || "",
        JSON.stringify(data.blueBookImages ?? []),
        data.licenseImage || "",
        JSON.stringify(data.takenImages ?? []),
        data.isBike === "true" || data.isBike === true ? 1 : 0,
      ],
    );

    return this.findById(result.insertId);
  },

  // Update bike
  async update(id, data) {
    await pool.query(
      `
      UPDATE bikes SET
        name=?,
        price_per_day=?,
        image=?,
        model=?,
        color=?,
        plate_number=?,
        chassis_number=?,
        engine_number=?,
        mileage=?,
        available=?,
        engine_capacity=?,
        blue_book_number=?,
        blue_book_images=?,
        license_image=?,
        taken_images=?,
        isBike=?
      WHERE id=?
      `,
      [
        data.name,
        data.pricePerDay,
        data.image || "",
        data.model || "",
        data.color || "",
        data.plateNumber || "",
        data.chassisNumber || "",
        data.engineNumber || "",
        data.mileage || 0,
        data.available === undefined ? 1 : data.available ? 1 : 0,
        data.engineCapacity || 0,
        data.blueBookNumber || "",
        JSON.stringify(data.blueBookImages ?? []),
        data.licenseImage || "",
        JSON.stringify(data.takenImages ?? []),
        data.isBike === "true" || data.isBike === true || data.isBike === 1
          ? 1
          : 0,
        id,
      ],
    );

    return this.findById(id);
  },

  // Quick toggle availability (List / Delist)
  async updateAvailability(id, available) {
    await pool.query("UPDATE bikes SET available = ? WHERE id = ?", [
      available ? 1 : 0,
      id,
    ]);
    return this.findById(id);
  },

  // Delete bike
  async delete(id) {
    // Delete bookings first
    await pool.query("DELETE FROM bike_bookings WHERE bike_id = ?", [id]);
    const [result] = await pool.query("DELETE FROM bikes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

export default Bike;
