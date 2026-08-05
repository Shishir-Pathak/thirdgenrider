CREATE TABLE IF NOT EXISTS package_itinerary (
    id INT AUTO_INCREMENT PRIMARY KEY,

    package_id INT NOT NULL,

    day_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_itinerary_package
        FOREIGN KEY (package_id)
        REFERENCES packages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);