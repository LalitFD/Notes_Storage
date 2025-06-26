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
    
    // Timeout settings bahut zyada increase karo
    acquireTimeout: 120000,     // 2 minutes
    timeout: 120000,            // 2 minutes
    connectTimeout: 120000,     // 2 minutes
    
    // Connection pool minimal rakho
    connectionLimit: 2,         // Sirf 2 connections
    queueLimit: 0,
    
    // Reconnection settings
    reconnect: true,
    maxReconnects: 3,
    
    // SSL disable kar ke try karo
    ssl: false,
    
    // Additional settings
    dateStrings: true,
    multipleStatements: false
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