import { pool } from "../config/db.js";

const Package = {
  async findAll() {
    const [packages] = await pool.query(
      `
			SELECT *
			FROM packages
			ORDER BY created_at DESC
			`,
    );
    console.log("Packages found:", packages); // Debugging line
    return packages;

    for (const pkg of packages) {
      const [itinerary] = await pool.query(
        `
				SELECT 
					day_number,
					description
				FROM package_itinerary
				WHERE package_id = ?
				ORDER BY id ASC
				`,
        [pkg.id],
      );

      const [highlights] = await pool.query(
        `
				SELECT highlight
				FROM package_highlights
				WHERE package_id = ?
				ORDER BY id ASC
				`,
        [pkg.id],
      );

      const [inclusions] = await pool.query(
        `
				SELECT inclusion
				FROM package_inclusions
				WHERE package_id = ?
				ORDER BY id ASC
				`,
        [pkg.id],
      );

      pkg.itinerary = itinerary.map((item) => ({
        dayNumber: item.day_number,
        description: item.description,
      }));

      pkg.tripHighlights = highlights.map((item) => item.highlight);

      pkg.inclusions = inclusions.map((item) => item.inclusion);
    }

    return packages;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `
			SELECT *
			FROM packages
			WHERE id = ?
			`,
      [id],
    );
    return rows;

    if (!rows.length) return null;

    const pkg = rows[0];

    const [itinerary] = await pool.query(
      `
			SELECT 
				day_number,
				description
			FROM package_itinerary
			WHERE package_id = ?
			`,
      [id],
    );

    const [highlights] = await pool.query(
      `
			SELECT highlight
			FROM package_highlights
			WHERE package_id = ?
			`,
      [id],
    );

    const [inclusions] = await pool.query(
      `
			SELECT inclusion
			FROM package_inclusions
			WHERE package_id = ?
			`,
      [id],
    );

    pkg.itinerary = itinerary.map((item) => ({
      dayNumber: item.day_number,
      description: item.description,
    }));

    pkg.tripHighlights = highlights.map((item) => item.highlight);

    pkg.inclusions = inclusions.map((item) => item.inclusion);

    return pkg;
  },
  async create(data) {
    const [result] = await pool.query(
      `
      INSERT INTO packages (
        title,
        location,
        duration,
        group_size,
        price,
        itinerary,
        trip_highlights,
        inclusions,
        image,
        package_experience
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.title,
        data.location,
        data.duration,
        data.groupSize,
        data.price,

        JSON.stringify(data.itinerary || []),
        JSON.stringify(data.tripHighlights || []),
        JSON.stringify(data.inclusions || []),

        data.image || "",
        data.packageExperience || "",
      ],
    );

    const id = result.insertId;

    return this.findById(id);
  },

  async update(id, data) {
    await pool.query(
      `
      UPDATE packages SET
        title = ?,
        location = ?,
        duration = ?,
        group_size = ?,
        price = ?,
        itinerary = ?,
        trip_highlights = ?,
        inclusions = ?,
        image = ?,
        package_experience = ?
      WHERE id = ?
    `,
      [
        data.title,
        data.location,
        data.duration,
        data.groupSize,
        data.price,

        JSON.stringify(data.itinerary || []),
        JSON.stringify(data.tripHighlights || []),
        JSON.stringify(data.inclusions || []),

        data.image || "",
        data.packageExperience || "",

        id,
      ],
    );

    return this.findById(id);
  },

  async findAll() {
    const [packages] = await pool.query(`
    SELECT *
    FROM packages
    ORDER BY created_at DESC
  `);

    return packages;
  },

  async insertRelations(id, data) {
    if (data.itinerary?.length) {
      for (const item of data.itinerary) {
        await pool.query(
          `
					INSERT INTO package_itinerary
					(
						package_id,
						day_number,
						description
					)
					VALUES (?,?,?)
					`,
          [id, item.dayNumber, item.description],
        );
      }
    }

    if (data.tripHighlights?.length) {
      for (const item of data.tripHighlights) {
        await pool.query(
          `
					INSERT INTO package_highlights
					(
						package_id,
						highlight
					)
					VALUES (?,?)
					`,
          [id, item],
        );
      }
    }

    if (data.inclusions?.length) {
      for (const item of data.inclusions) {
        await pool.query(
          `
					INSERT INTO package_inclusions
					(
						package_id,
						inclusion
					)
					VALUES (?,?)
					`,
          [id, item],
        );
      }
    }
  },

  async delete(id) {
    const [result] = await pool.query(
      `
			DELETE FROM packages
			WHERE id=?
			`,
      [id],
    );

    return result.affectedRows > 0;
  },
};

export default Package;
