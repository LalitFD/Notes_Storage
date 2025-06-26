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

  // Timeout settings increase karo
  acquireTimeout: 60000,      // 60 seconds
  timeout: 60000,             // 60 seconds
  connectTimeout: 60000,      // 60 seconds

  // Connection pool settings
  connectionLimit: 5,         // Render pe zyada connections mat banao
  queueLimit: 0,

  // Reconnection
  reconnect: true,

  // SSL (agar required hai)
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