import { pool } from "../config/db.js";

const User = {
  // Get all users
  async findAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        role,
        first_name,
        last_name,
        email,
        citizenship_number,
        pan_number,
        citizenship_photo,
        pan_photo,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    return rows;
  },

  // Get user by ID
  async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        role,
        first_name,
        last_name,
        email,
        citizenship_number,
        pan_number,
        citizenship_photo,
        pan_photo,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [id],
    );

    return rows.length ? rows[0] : null;
  },

  // Get user by email
  // Useful for login / checking existing accounts
  async findByEmail(email) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email],
    );

    return rows.length ? rows[0] : null;
  },

  // Create user
  async create(data) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO users
        (
          role,
          first_name,
          last_name,
          email,
          password,
          citizenship_number,
          pan_number,
          citizenship_photo,
          pan_photo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
        `,
        [
          data.role || "none",
          data.firstName,
          data.lastName,
          data.email,
          data.password,
          data.citizenshipNumber || null,
          data.panNumber || null,
          data.citizenshipPhoto || null,
          data.panPhoto || null,
        ],
      );

      return this.findById(result.insertId);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      throw error;
    }
  },

  // Update user
  async update(id, data) {
    try {
      const [result] = await pool.query(
        `
        UPDATE users
        SET
          role = ?,
          first_name= ?,
          last_name=?,
          email = ?,
          password=?
        WHERE id = ?
        `,
        [
          data.role,
          data.firstName,
          data.lastName,
          data.email,
          data?.password,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      throw error;
    }
  },

  // Update password
  async updatePassword(id, password) {
    const [result] = await pool.query(
      `
      UPDATE users
      SET password = ?
      WHERE id = ?
      `,
      [password, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  // Delete user
  async delete(id) {
    const [result] = await pool.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  },
};

export default User;
