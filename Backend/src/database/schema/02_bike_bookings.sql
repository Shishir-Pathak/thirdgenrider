CREATE TABLE IF NOT EXISTS bike_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT NOT NULL,

    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,

    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,

    pickup_location VARCHAR(255) NOT NULL,
    return_location VARCHAR(255) NOT NULL,

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_bike_booking_bike
        FOREIGN KEY (bike_id)
        REFERENCES bikes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);