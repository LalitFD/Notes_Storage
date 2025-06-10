import db from '../config/db.js';

export const createUser = async (firstname, lastname, email, hashedPassword) => {
  const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  return db.execute(query, [firstname, lastname, email, hashedPassword]);
};
