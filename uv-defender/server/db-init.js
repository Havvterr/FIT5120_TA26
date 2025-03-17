require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST, // 
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false, 
        }
      : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;

async function initializeDatabase() {
  let connection;

  try {
    // Create connection to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true,
    });

    console.log("Connected to MySQL server");

    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "uv_defender"}`
    );
    console.log(
      `Database ${
        process.env.DB_NAME || "uv_defender"
      } created or already exists`
    );

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || "uv_defender"}`);

    // Create tables
    await connection.query(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        skin_type INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- UV data table
      CREATE TABLE IF NOT EXISTS uv_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location VARCHAR(100) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        uv_index DECIMAL(4, 2) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Sunscreen reminders table
      CREATE TABLE IF NOT EXISTS sunscreen_reminders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        sunscreen_type VARCHAR(10) NOT NULL,
        application_time DATETIME NOT NULL,
        reapplication_time DATETIME NOT NULL,
        activity_level VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image_url VARCHAR(255),
        purchase_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created successfully");

    // Insert sample data
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM products"
    );

    if (rows[0].count === 0) {
      await connection.query(`
        -- Sample products
        INSERT INTO products (name, description, price, category, image_url, purchase_link) VALUES
        ('Ultra Protection SPF 50+', 'Water-resistant, broad-spectrum protection', 24.99, 'sunscreen', 'https://example.com/sunscreen1.jpg', 'https://example.com/buy/sunscreen1'),
        ('Sensitive Skin SPF 30', 'Fragrance-free formula for sensitive skin', 19.99, 'sunscreen', 'https://example.com/sunscreen2.jpg', 'https://example.com/buy/sunscreen2'),
        ('Sport Formula SPF 50+', 'Extra water-resistant for active lifestyles', 27.99, 'sunscreen', 'https://example.com/sunscreen3.jpg', 'https://example.com/buy/sunscreen3'),
        ('UV Protection Hat', 'Wide-brimmed hat with UPF 50+ protection', 34.99, 'clothing', 'https://example.com/hat1.jpg', 'https://example.com/buy/hat1'),
        ('Long Sleeve Rash Guard', 'UPF 50+ protection for water activities', 45.99, 'clothing', 'https://example.com/rashguard1.jpg', 'https://example.com/buy/rashguard1'),
        ('Sun Protection Shirt', 'Lightweight, breathable fabric with UPF 40+', 39.99, 'clothing', 'https://example.com/shirt1.jpg', 'https://example.com/buy/shirt1'),
        ('Polarized UV400 Sunglasses', 'Full UV protection with polarized lenses', 89.99, 'sunglasses', 'https://example.com/sunglasses1.jpg', 'https://example.com/buy/sunglasses1'),
        ('Sport Wrap Sunglasses', 'Wrap-around design for maximum protection', 69.99, 'sunglasses', 'https://example.com/sunglasses2.jpg', 'https://example.com/buy/sunglasses2'),
        ('Fashion UV Protection', 'Stylish frames with 100% UV protection', 59.99, 'sunglasses', 'https://example.com/sunglasses3.jpg', 'https://example.com/buy/sunglasses3');
      `);

      console.log("Sample data inserted successfully");
    } else {
      console.log("Sample data already exists");
    }

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

// Run the initialization
initializeDatabase();
