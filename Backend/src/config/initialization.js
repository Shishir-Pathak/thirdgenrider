import { pool } from "./db.js";

export const userInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      role VARCHAR(50) NOT NULL DEFAULT 'agent',
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      business_name VARCHAR(255) DEFAULT NULL,
      citizenship_number VARCHAR(100) DEFAULT NULL,
      pan_number VARCHAR(100) DEFAULT NULL,
      citizenship_photo VARCHAR(500) DEFAULT NULL,
      pan_photo VARCHAR(500) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
  `);

  // Safe migrations for users
  try {
    await pool.query(`ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'agent'`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN business_name VARCHAR(255) DEFAULT NULL`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN description TEXT DEFAULT NULL`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'`);
  } catch {}
};

export const bikeInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bikes (
      id INT(11) NOT NULL AUTO_INCREMENT,
      userId INT(11) DEFAULT NULL,
      name VARCHAR(255) NOT NULL,
      price_per_day DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      image VARCHAR(500) DEFAULT '',
      model VARCHAR(100) DEFAULT '',
      color VARCHAR(50) DEFAULT '',
      plate_number VARCHAR(50) DEFAULT '',
      chassis_number VARCHAR(100) DEFAULT '',
      engine_number VARCHAR(100) DEFAULT '',
      mileage INT(11) DEFAULT 0,
      available TINYINT(1) DEFAULT 1,
      engine_capacity INT(11) DEFAULT 0,
      blue_book_number VARCHAR(100) DEFAULT '',
      blue_book_images LONGTEXT DEFAULT NULL,
      license_image VARCHAR(500) DEFAULT '',
      qr_code VARCHAR(500) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      isBike TINYINT(1) DEFAULT 1,
      PRIMARY KEY (id)
    );
  `);

  try {
    await pool.query(`ALTER TABLE bikes ADD COLUMN userId INT(11) DEFAULT NULL`);
  } catch {}
  try {
    await pool.query(`ALTER TABLE bikes ADD COLUMN available TINYINT(1) DEFAULT 1`);
  } catch {}
};

export const bookingInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bike_bookings (
      id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      bike_id INT(10) UNSIGNED NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      pickup_date DATE NOT NULL,
      return_date DATE NOT NULL,
      pickup_location VARCHAR(255) NOT NULL,
      return_location VARCHAR(255) NOT NULL,
      message TEXT,
      status VARCHAR(50) DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
  `);

  try {
    await pool.query(`ALTER TABLE bike_bookings ADD COLUMN status VARCHAR(50) DEFAULT 'confirmed'`);
  } catch {}
};

export const initAll = async () => {
  await userInit();
  await bikeInit();
  await bookingInit();
};
