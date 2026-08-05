CREATE TABLE IF NOT EXISTS company_details (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    logo TEXT,

    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),

    whatsapp VARCHAR(50),

    location VARCHAR(255),

    business_hours TEXT,

    about TEXT,

    facebook TEXT,
    tiktok TEXT,
    instagram TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);