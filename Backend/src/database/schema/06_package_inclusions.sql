CREATE TABLE IF NOT EXISTS package_inclusions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    package_id INT NOT NULL,

    inclusion TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inclusion_package
        FOREIGN KEY (package_id)
        REFERENCES packages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);