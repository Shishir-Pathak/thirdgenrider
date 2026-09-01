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

  try {
    await pool.query(
      `ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'agent'`,
    );
  } catch {}
  try {
    await pool.query(
      `ALTER TABLE users ADD COLUMN business_name VARCHAR(255) DEFAULT NULL`,
    );
  } catch {}
  try {
    await pool.query(
      `ALTER TABLE users ADD COLUMN description TEXT DEFAULT NULL`,
    );
  } catch {}
  try {
    await pool.query(
      `ALTER TABLE users ADD COLUMN status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'`,
    );
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
    
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      isBike TINYINT(1) DEFAULT 1,
      PRIMARY KEY (id)
    );
  `);

  try {
    await pool.query(
      `ALTER TABLE bikes ADD COLUMN userId INT(11) DEFAULT NULL`,
    );
  } catch {}
  try {
    await pool.query(
      `ALTER TABLE bikes ADD COLUMN available TINYINT(1) DEFAULT 1`,
    );
  } catch {}
  try {
    await pool.query(
      `ALTER TABLE bikes ADD COLUMN isBike TINYINT(1) DEFAULT 1`,
    );
  } catch {}
};

export const bookingInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bike_bookings (
      id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      bike_id INT(10) NOT NULL,
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
    await pool.query(
      `ALTER TABLE bike_bookings ADD COLUMN status VARCHAR(50) DEFAULT 'confirmed'`,
    );
  } catch {}
};

export const companyDetailsInit = async () => {
  await pool.query(`
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM company_details",
  );
  if (rows[0].count === 0) {
    await pool.query(
      `
      INSERT INTO company_details
      (name, contact_email, contact_phone, whatsapp, location, business_hours, about)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        "Third Generation Rider Pvt. Ltd.",
        "info@thirdgenrider.com",
        "+977 981234567",
        "+977 981234567",
        "Kathmandu, Nepal",
        "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 5:00 PM\nSunday: Closed",
        "We provide premium bike & car rentals for travelers, tourists, and locals exploring Nepal. Affordable, reliable, and comfortable vehicles.",
      ],
    );
  }
};

export const siteContentInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_home_hero (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      subtitle TEXT,
      button_text VARCHAR(255),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_process (
      id INT AUTO_INCREMENT PRIMARY KEY,
      heading VARCHAR(255),
      subheading TEXT,
      description TEXT,
      background_image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_process_steps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      process_id INT NOT NULL,
      number VARCHAR(50),
      title VARCHAR(255),
      description TEXT,
      FOREIGN KEY (process_id) REFERENCES site_process(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_service (
      id INT AUTO_INCREMENT PRIMARY KEY,
      heading VARCHAR(255),
      description TEXT,
      stats_background_image_url TEXT,
      reviews_heading VARCHAR(255),
      reviews_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_service_cards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      service_id INT NOT NULL,
      icon VARCHAR(255),
      title VARCHAR(255),
      description TEXT,
      FOREIGN KEY (service_id) REFERENCES site_service(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_service_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      service_id INT NOT NULL,
      icon VARCHAR(255),
      number VARCHAR(100),
      label VARCHAR(255),
      FOREIGN KEY (service_id) REFERENCES site_service(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_service_reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      service_id INT NOT NULL,
      name VARCHAR(255),
      review TEXT,
      FOREIGN KEY (service_id) REFERENCES site_service(id) ON DELETE CASCADE
    );
  `);

  // Seed default home hero
  const [heroRows] = await pool.query(
    "SELECT COUNT(*) AS count FROM site_home_hero",
  );
  if (heroRows[0].count === 0) {
    await pool.query(
      `
      INSERT INTO site_home_hero (title, subtitle, button_text, image_url)
      VALUES (?, ?, ?, ?)
    `,
      [
        "Rent Your Dream Bike & Car Today",
        "Affordable • Reliable • Comfortable Rental Fleet",
        "Book Now",
        "",
      ],
    );
  }

  // Seed default about
  const [aboutRows] = await pool.query(
    "SELECT COUNT(*) AS count FROM site_about",
  );
  if (aboutRows[0].count === 0) {
    await pool.query(
      `
      INSERT INTO site_about (heading, description, vision_text, mission_text, closing_text, experience_years, experience_label, primary_image_url, secondary_image_url, features)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        "Third Generation Rider Pvt. Ltd.",
        "<p>We are the premier vehicle rental service offering top-grade bikes, scooters, and cars for your travel experiences across Nepal.</p>",
        "<p>To become the most reliable and trusted vehicle rental network nationwide.</p>",
        "<p>Empowering travelers and commuters with clean, well-maintained, and verified vehicles at honest rates.</p>",
        "<p>Join thousands of happy riders who trust Third Generation Rider for their road adventures.</p>",
        "5+",
        "Years Of Experience",
        "",
        "",
        JSON.stringify([
          "Verified Fleet & Regular Maintenance",
          "24/7 Roadside Assistance",
          "Flexible Hourly & Daily Bookings",
          "Zero Hidden Charges",
        ]),
      ],
    );
  }

  // Seed default process
  const [processRows] = await pool.query(
    "SELECT COUNT(*) AS count FROM site_process",
  );
  if (processRows[0].count === 0) {
    const [res] = await pool.query(
      `
      INSERT INTO site_process (heading, subheading, description, background_image_url)
      VALUES (?, ?, ?, ?)
    `,
      [
        "Our Easy Booking Process",
        "Fast, Transparent & Reliable",
        "Rent your dream bike or car in just 3 simple steps.",
        "",
      ],
    );
    const processId = res.insertId;
    await pool.query(
      `
      INSERT INTO site_process_steps (process_id, number, title, description) VALUES
      (?, '01.', 'Choose Vehicle', 'Browse our wide fleet of verified bikes and cars.'),
      (?, '02.', 'Book & Confirm', 'Select your dates and pickup/dropoff locations.'),
      (?, '03.', 'Ride Away', 'Collect your keys and enjoy your journey.')
    `,
      [processId, processId, processId],
    );
  }

  // Seed default service
  const [serviceRows] = await pool.query(
    "SELECT COUNT(*) AS count FROM site_service",
  );
  if (serviceRows[0].count === 0) {
    const [res] = await pool.query(
      `
      INSERT INTO site_service (heading, description, stats_background_image_url, reviews_heading, reviews_description)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        "Our Services & Fleet Features",
        "<p>Everything you need for a comfortable, stress-free road trip and daily commute.</p>",
        "",
        "What Our Clients Say",
        "Real stories from riders and drivers across Nepal.",
      ],
    );
    const serviceId = res.insertId;
    await pool.query(
      `
      INSERT INTO site_service_cards (service_id, icon, title, description) VALUES
      (?, 'Car', 'Bike & Car Rentals', 'Wide selection of well-maintained motorbikes, scooters, and cars.'),
      (?, 'ShieldCheck', 'Fully Insured Fleet', 'All vehicles covered with comprehensive insurance and safety checks.'),
      (?, 'Headphones', '24/7 Support', 'Dedicated customer care and roadside assistance whenever you need it.')
    `,
      [serviceId, serviceId, serviceId],
    );

    await pool.query(
      `
      INSERT INTO site_service_stats (service_id, icon, number, label) VALUES
      (?, 'Car', '50+', 'Vehicles in Fleet'),
      (?, 'Users', '2500+', 'Happy Customers'),
      (?, 'Briefcase', '100+', 'Tour Packages'),
      (?, 'MapPin', '15+', 'Service Locations')
    `,
      [serviceId, serviceId, serviceId, serviceId],
    );

    await pool.query(
      `
      INSERT INTO site_service_reviews (service_id, name, review) VALUES
      (?, 'Rohan Shrestha', 'Amazing service! The bike was in top condition and made our Mustang trip unforgettable.'),
      (?, 'Priya Sharma', 'Renting a car for our family tour was super smooth and affordable. Highly recommended!')
    `,
      [serviceId, serviceId],
    );
  }
};

export const packagesInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS packages (
      id INT AUTO_INCREMENT PRIMARY KEY,

      title VARCHAR(255) NOT NULL,
      description TEXT,

      location VARCHAR(255),
      duration VARCHAR(100),

      group_size INT,
      price DECIMAL(10,2),

      itinerary JSON,
      trip_highlights JSON,
      inclusions JSON,

      package_experience TEXT,
      image TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    );
  `);
};

export const packageBookingsInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS package_bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,

      package_id INT NOT NULL,

      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,

      num_people INT DEFAULT 1,

      pickup_date DATE NOT NULL,
      return_date DATE NOT NULL,

      pickup_location VARCHAR(255) NOT NULL,
      return_location VARCHAR(255) NOT NULL,

      message TEXT,

      status VARCHAR(50) DEFAULT 'confirmed',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY (package_id)
        REFERENCES packages(id)
        ON DELETE CASCADE
    );
  `);
};

export const blogsInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      content LONGTEXT,
      excerpt TEXT,
      author VARCHAR(255) DEFAULT 'Admin',
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      blog_id INT NOT NULL,
      author_name VARCHAR(255) NOT NULL,
      author_email VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const contactMessagesInit = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const initAll = async () => {
  await userInit();
  await bikeInit();
  await bookingInit();
  await companyDetailsInit();
  await siteContentInit();
  await packagesInit();
  await blogsInit();
  await contactMessagesInit();
  await packageBookingsInit();
};
