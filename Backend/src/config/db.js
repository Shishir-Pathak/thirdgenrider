import mysql from "mysql2/promise";

// Old mysql2 connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    // Test mysql2 connection
    const connection = await pool.getConnection();
    connection.release();

    console.log("MySQL Connected");
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    process.exit(1);
  }
};

export { pool };
export default connectDB;
