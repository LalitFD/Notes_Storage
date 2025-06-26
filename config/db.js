// config/db.js
import mysql from 'mysql2/promise';
import dotenv from "dotenv"
dotenv.config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    
    // Correct MySQL2 options
    connectTimeout: 60000,          // Connection timeout (60 seconds)
    acquireTimeout: 60000,          // Pool acquire timeout (60 seconds)
    waitForConnections: true,       // Wait for available connection
    connectionLimit: 10,            // Max connections in pool
    queueLimit: 0,                  // No limit on queued requests
    
    // SSL settings
    ssl: {
        rejectUnauthorized: false
    }
});


async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error);
    return false;
  }
}

testConnection();

export default pool;