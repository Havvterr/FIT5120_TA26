const mysql = require('mysql2');

// Google Cloud SQL connection configuration
const pool = mysql.createPool({
  // Replace these values with your Cloud SQL instance details
  host: process.env.DB_HOST || 'YOUR_CLOUD_SQL_IP',
  user: process.env.DB_USER || 'YOUR_DB_USER',
  password: process.env.DB_PASSWORD || 'YOUR_DB_PASSWORD',
  database: process.env.DB_NAME || 'uv_defender',
  // SSL configuration for secure connection
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = {
  pool: promisePool,
  async query(sql, params) {
    try {
      const [rows] = await promisePool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
};