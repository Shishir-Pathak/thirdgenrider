CREATE TABLE IF NOT EXISTS package_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    package_id INT NOT NULL,

    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,

    number_of_people INT NOT NULL,

    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,

    pickup_location VARCHAR(255) NOT NULL,
    return_location VARCHAR(255) NOT NULL,

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_package_booking_package
        FOREIGN KEY (package_id)
        REFERENCES packages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);