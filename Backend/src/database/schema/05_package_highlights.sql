CREATE TABLE IF NOT EXISTS package_highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,

    package_id INT NOT NULL,

    highlight TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_highlight_package
        FOREIGN KEY (package_id)
        REFERENCES packages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);