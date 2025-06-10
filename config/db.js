// config/db.js
import mysql from 'mysql2/promise'; 

const db = mysql.createPool({  
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'notesitdown',
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