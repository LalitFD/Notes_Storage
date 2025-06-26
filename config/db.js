// config/db.js
import mysql from 'mysql2/promise';
import dotenv from "dotenv"
dotenv.config();

const db = mysql.createPool({
  host: 'localhost',
  user: process.env.user,
  password: process.env.password,
  database: process.env.databases,
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