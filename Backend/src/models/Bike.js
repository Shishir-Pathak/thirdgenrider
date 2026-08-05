import { pool } from "../config/db.js";

const Bike = {
	// Get all bikes
	async findAll() {
		const [rows] = await pool.query(
			"SELECT * FROM bikes ORDER BY created_at ASC"
		);

		return rows.map((bike) => ({
			...bike,
			pricePerDay: Number(bike.price_per_day),
			available: Boolean(bike.available),
			blueBookImages: (() => {
    try {
        return bike.blue_book_images
            ? JSON.parse(bike.blue_book_images)
            : [];
    } catch {
        return [];
    }
})(),
		}));
	},

	// Get single bike
	async findById(id) {
		const [rows] = await pool.query(
			"SELECT * FROM bikes WHERE id = ?",
			[id]
		);

		if (rows.length === 0) return null;

		const bike = rows[0];

		return {
			...bike,
			pricePerDay: Number(bike.price_per_day),
			available: Boolean(bike.available),
			blueBookImages: (() => {
    try {
        return bike.blue_book_images
            ? JSON.parse(bike.blue_book_images)
            : [];
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
				qr_code
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
				data.available ?? true,
				data.engineCapacity || 0,
				data.blueBookNumber || "",
				JSON.stringify(data.blueBookImages || []),
				data.licenseImage || "",
				data.qrCode || "",
			]
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
				qr_code=?
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
				data.available ?? true,
				data.engineCapacity || 0,
				data.blueBookNumber || "",
				JSON.stringify(data.blueBookImages || []),
				data.licenseImage || "",
				data.qrCode || "",
				id,
			]
		);

		return this.findById(id);
	},

	// Delete bike
	async delete(id) {
		const [result] = await pool.query(
			"DELETE FROM bikes WHERE id = ?",
			[id]
		);

		return result.affectedRows > 0;
	},
};

export default Bike;