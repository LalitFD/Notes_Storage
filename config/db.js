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


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  acquireTimeout: 60000,  // 60 seconds
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});


async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL!');
    connection.release();
  } catch (err) {
    console.error('connection error:', err);
  }
}

testConnection();

export default db;