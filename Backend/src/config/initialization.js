import { pool } from "./db.js";

export const userInit = async () => {
  return await pool.query(`
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    role ENUM('none', 'admin', 'superadmin') NOT NULL DEFAULT 'none',

    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    citizenship_number VARCHAR(100) DEFAULT NULL,
    pan_number VARCHAR(100) DEFAULT NULL,
    citizenship_photo VARCHAR(500) DEFAULT NULL,
    pan_photo VARCHAR(500) DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

`);
};

export const bikeInit = async () => {
  return await db.query(`
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
  )
`);
};
