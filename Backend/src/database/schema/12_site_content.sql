CREATE TABLE IF NOT EXISTS site_home_hero (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255),
    subtitle TEXT,
    button_text VARCHAR(255),
    image_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS site_about (
    id INT AUTO_INCREMENT PRIMARY KEY,

    heading VARCHAR(255),
    description TEXT,

    vision_text TEXT,
    mission_text TEXT,

    closing_text TEXT,

    experience_years VARCHAR(50),
    experience_label VARCHAR(255),

    primary_image_url TEXT,
    secondary_image_url TEXT,

    features JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS site_process (
    id INT AUTO_INCREMENT PRIMARY KEY,

    heading VARCHAR(255),
    subheading TEXT,
    description TEXT,

    background_image_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS site_process_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,

    process_id INT NOT NULL,

    number VARCHAR(50),
    title VARCHAR(255),
    description TEXT,

    FOREIGN KEY (process_id)
        REFERENCES site_process(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS site_service (
    id INT AUTO_INCREMENT PRIMARY KEY,

    heading VARCHAR(255),
    description TEXT,

    stats_background_image_url TEXT,

    reviews_heading VARCHAR(255),
    reviews_description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS site_service_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,

    service_id INT NOT NULL,

    icon VARCHAR(255),
    title VARCHAR(255),
    description TEXT,

    FOREIGN KEY (service_id)
        REFERENCES site_service(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS site_service_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,

    service_id INT NOT NULL,

    icon VARCHAR(255),
    number VARCHAR(100),
    label VARCHAR(255),

    FOREIGN KEY (service_id)
        REFERENCES site_service(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS site_service_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,

    service_id INT NOT NULL,

    name VARCHAR(255),
    review TEXT,

    FOREIGN KEY (service_id)
        REFERENCES site_service(id)
        ON DELETE CASCADE
);