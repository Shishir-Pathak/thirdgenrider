CREATE TABLE IF NOT EXISTS bikes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    image TEXT,
    model VARCHAR(100),
    color VARCHAR(100),
    plate_number VARCHAR(100),
    chassis_number VARCHAR(100),
    engine_number VARCHAR(100),
    mileage INT DEFAULT 0,
    available BOOLEAN DEFAULT TRUE,
    engine_capacity INT DEFAULT 0,
    blue_book_number VARCHAR(100),
    blue_book_images JSON,
    license_image TEXT,
    qr_code TEXT,
    isBike BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);