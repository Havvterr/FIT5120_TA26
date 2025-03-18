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
      
      -- SKINTONE table
      CREATE TABLE IF NOT EXISTS SKINTONE (
        id INT AUTO_INCREMENT PRIMARY KEY,
        skin_tone VARCHAR(50) NOT NULL
      );
      
      -- UV table
      CREATE TABLE IF NOT EXISTS UV (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uv_index INT NOT NULL,
        description VARCHAR(100),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- ADVICE table
      CREATE TABLE IF NOT EXISTS ADVICE (
        id INT AUTO_INCREMENT PRIMARY KEY,
        skin_tone_id INT NOT NULL,
        uv_id INT NOT NULL,
        recommendation_type VARCHAR(50),
        advice TEXT NOT NULL,
        FOREIGN KEY (skin_tone_id) REFERENCES SKINTONE(id),
        FOREIGN KEY (uv_id) REFERENCES UV(id)
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

      console.log("Sample products inserted successfully");
    } else {
      console.log("Sample products already exists");
    }

    // Check if SKINTONE table is empty
    const [skinToneRows] = await connection.query(
      "SELECT COUNT(*) as count FROM SKINTONE"
    );

    if (skinToneRows[0].count === 0) {
      await connection.query(`
        -- Sample skin tones
        INSERT INTO SKINTONE (id, skin_tone) VALUES
        (1, 'Type I - Very fair, always burns, never tans'),
        (2, 'Type II - Fair, burns easily, tans minimally'),
        (3, 'Type III - Medium, sometimes burns, gradually tans'),
        (4, 'Type IV - Olive, rarely burns, tans well'),
        (5, 'Type V - Brown, very rarely burns, tans darkly'),
        (6, 'Type VI - Dark brown to black, never burns');
      `);

      console.log("Sample skin tones inserted successfully");
    }

    // Check if UV table is empty
    const [uvRows] = await connection.query("SELECT COUNT(*) as count FROM UV");

    if (uvRows[0].count === 0) {
      await connection.query(`
        -- Sample UV indices
        INSERT INTO UV (id, uv_index, description) VALUES
        (1, 1, 'Low'),
        (2, 2, 'Low'),
        (3, 3, 'Moderate'),
        (4, 4, 'Moderate'),
        (5, 5, 'Moderate'),
        (6, 6, 'High'),
        (7, 7, 'High'),
        (8, 8, 'Very High'),
        (9, 9, 'Very High'),
        (10, 10, 'Extreme'),
        (11, 11, 'Extreme');
      `);

      console.log("Sample UV indices inserted successfully");
    }

    // Check if ADVICE table is empty
    const [adviceRows] = await connection.query(
      "SELECT COUNT(*) as count FROM ADVICE"
    );

    if (adviceRows[0].count === 0) {
      await connection.query(`
        -- Sample advice (basic examples - you should expand this with real advice from dermatologists)
        INSERT INTO ADVICE (skin_tone_id, uv_id, recommendation_type, advice) VALUES
        (1, 1, 'general', 'With your very fair skin and the current low UV index, you are at minimal risk. However, it\'s still advisable to use SPF 15+ sunscreen for extended outdoor activities.'),
        (1, 3, 'general', 'Your very fair skin is sensitive to the current moderate UV levels. Apply SPF 30+ sunscreen, wear a hat, and seek shade during peak hours (10am-2pm).'),
        (1, 6, 'general', 'High alert! Your skin type is extremely vulnerable to the current high UV levels. Use SPF 50+ sunscreen, reapply every 1-2 hours, wear protective clothing, and limit direct sun exposure.'),
        (1, 8, 'general', 'Extreme caution required for your skin type under these very high UV conditions. Use maximum sun protection and minimize outdoor activities between 10am-4pm.'),
        
        (2, 1, 'general', 'With your fair skin and the current low UV index, you have low risk. Basic protection with SPF 15+ is recommended for extended outdoor periods.'),
        (2, 3, 'general', 'Your fair skin requires good protection at this moderate UV level. Use SPF 30+ sunscreen and consider wearing a hat when outdoors for more than 30 minutes.'),
        (2, 6, 'general', 'Your fair skin is at high risk with the current UV levels. Apply SPF 50+ generously, wear protective clothing, and limit direct exposure during peak hours.'),
        (2, 8, 'general', 'Your skin type is at very high risk in these UV conditions. Maximum protection is essential - use SPF 50+, reapply frequently, and minimize outdoor time.'),
        
        (3, 1, 'general', 'Your medium skin tone provides some natural protection at this low UV level, but SPF 15+ is still recommended for extended outdoor activities.'),
        (3, 3, 'general', 'With your medium skin tone and these moderate UV levels, use SPF 15-30 sunscreen for outdoor activities lasting more than an hour.'),
        (3, 6, 'general', 'Your medium skin requires good protection at this high UV level. Use SPF 30+ sunscreen, wear a hat, and take breaks in the shade.'),
        (3, 8, 'general', 'Despite your medium skin tone, these very high UV levels pose significant risk. Use SPF 50, protective clothing, and limit direct exposure.'),
        
        (4, 1, 'general', 'Your olive skin provides good natural protection at this low UV level, but consider SPF 15 for extended outdoor periods.'),
        (4, 3, 'general', 'With your olive skin and these moderate UV levels, basic sun protection is advised for extended outdoor activities.'),
        (4, 6, 'general', 'Your olive skin still needs protection at this high UV level. Use SPF 15-30 and take sensible precautions during peak hours.'),
        (4, 8, 'general', 'Even with your naturally more protected olive skin, these very high UV levels require SPF 30+, protective clothing, and limited direct exposure.'),
        
        (5, 1, 'general', 'Your brown skin has substantial natural protection at this low UV level. Basic precautions are sufficient for very long exposures.'),
        (5, 3, 'general', 'With your brown skin and these moderate UV levels, consider basic protection for extended outdoor periods.'),
        (5, 6, 'general', 'Despite your brown skin\'s natural protection, these high UV levels still pose some risk. Use SPF 15+ for extended exposure.'),
        (5, 8, 'general', 'Even with your well-protected brown skin, these very high UV levels require some precautions. Use SPF 15-30 for extended exposure.'),
        
        (6, 1, 'general', 'Your dark skin provides excellent natural protection at this low UV level. Basic awareness is sufficient.'),
        (6, 3, 'general', 'With your dark skin and these moderate UV levels, you have good natural protection, but extended exposure may still require basic precautions.'),
        (6, 6, 'general', 'Your dark skin provides significant protection, but these high UV levels still warrant basic sun safety practices for very long exposures.'),
        (6, 8, 'general', 'Even with your highly protected dark skin, these extreme UV levels call for some precautions during extended exposure.');
      `);

      console.log("Sample advice inserted successfully");
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
