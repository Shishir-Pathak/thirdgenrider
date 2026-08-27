import { pool } from "../config/db.js";

const User = {
  // Get all users (agents/admins)
  async findAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        role,
        status,
        first_name,
        last_name,
        email,
        business_name,
        citizenship_number,
        pan_number,
        citizenship_photo,
        pan_photo,
        description,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    return rows.map((u) => ({
      ...u,
      firstName: u.first_name,
      lastName: u.last_name,
      businessName: u.business_name || "",
      citizenshipNumber: u.citizenship_number || "",
      panNumber: u.pan_number || "",
      citizenshipPhoto: u.citizenship_photo || "",
      panPhoto: u.pan_photo || "",
    }));
  },

  // Get user by ID
  async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        role,
        status,
        first_name,
        last_name,
        email,
        business_name,
        citizenship_number,
        pan_number,
        citizenship_photo,
        pan_photo,
        description,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [id],
    );

    if (!rows.length) return null;
    const u = rows[0];
    return {
      ...u,
      firstName: u.first_name,
      lastName: u.last_name,
      businessName: u.business_name || "",
      citizenshipNumber: u.citizenship_number || "",
      panNumber: u.pan_number || "",
      citizenshipPhoto: u.citizenship_photo || "",
      panPhoto: u.pan_photo || "",
    };
  },

  // Get user with password by email (for authentication)
  async findByEmail(email) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email],
    );

    if (!rows.length) return null;
    const u = rows[0];
    return {
      ...u,
      firstName: u.first_name,
      lastName: u.last_name,
      businessName: u.business_name || "",
      citizenshipNumber: u.citizenship_number || "",
      panNumber: u.pan_number || "",
      citizenshipPhoto: u.citizenship_photo || "",
      panPhoto: u.pan_photo || "",
    };
  },

  // Count pending agent requests
  async countPending() {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS count FROM users WHERE status = 'pending'`,
    );
    return rows[0]?.count || 0;
  },

  // Get stats breakdown
  async getStats() {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
      FROM users
    `);
    return {
      total: Number(rows[0]?.total || 0),
      pending: Number(rows[0]?.pending || 0),
      approved: Number(rows[0]?.approved || 0),
      rejected: Number(rows[0]?.rejected || 0),
    };
  },

  // Create user
  async create(data) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO users
        (
          role,
          status,
          first_name,
          last_name,
          email,
          password,
          business_name,
          citizenship_number,
          pan_number,
          citizenship_photo,
          pan_photo,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          data.role || "agent",
          data.status || "pending",
          data.firstName || data.first_name || "",
          data.lastName || data.last_name || "",
          data.email,
          data.password,
          data.businessName || data.business_name || null,
          data.citizenshipNumber || data.citizenship_number || null,
          data.panNumber || data.pan_number || null,
          data.citizenshipPhoto || data.citizenship_photo || null,
          data.panPhoto || data.pan_photo || null,
          data.description || null,
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

  // Update status and role (Superadmin approval / rejection)
  async updateStatus(id, status, role) {
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const updates = ["status = ?"];
    const values = [status];

    if (role) {
      updates.push("role = ?");
      values.push(role);
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  // Update user profile / data
  async update(id, data) {
    try {
      const updates = [];
      const values = [];

      if (data.role !== undefined) {
        updates.push("role = ?");
        values.push(data.role);
      }
      if (data.status !== undefined) {
        updates.push("status = ?");
        values.push(data.status);
      }
      if (data.firstName !== undefined || data.first_name !== undefined) {
        updates.push("first_name = ?");
        values.push(data.firstName || data.first_name);
      }
      if (data.lastName !== undefined || data.last_name !== undefined) {
        updates.push("last_name = ?");
        values.push(data.lastName || data.last_name);
      }
      if (data.email !== undefined) {
        updates.push("email = ?");
        values.push(data.email);
      }
      if (data.businessName !== undefined || data.business_name !== undefined) {
        updates.push("business_name = ?");
        values.push(data.businessName || data.business_name);
      }
      if (data.password !== undefined && data.password) {
        updates.push("password = ?");
        values.push(data.password);
      }
      if (data.citizenshipNumber !== undefined || data.citizenship_number !== undefined) {
        updates.push("citizenship_number = ?");
        values.push(data.citizenshipNumber || data.citizenship_number);
      }
      if (data.panNumber !== undefined || data.pan_number !== undefined) {
        updates.push("pan_number = ?");
        values.push(data.panNumber || data.pan_number);
      }
      if (data.description !== undefined) {
        updates.push("description = ?");
        values.push(data.description);
      }

      if (updates.length === 0) return this.findById(id);

      values.push(id);

      const [result] = await pool.query(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        values,
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

  // Delete user
  async delete(id) {
    // Also delete or unlink any bikes associated with this user
    await pool.query("DELETE FROM bikes WHERE userId = ?", [id]);
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

export default User;
