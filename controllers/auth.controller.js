// controllers/auth.controller.js
import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    let { password } = req.body;

    let saltKey = bcrypt.genSaltSync(12);
    password = bcrypt.hashSync(password, saltKey);

    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length) {
      return res.status(400).render('register', {
        error: 'Email already registered'
      });
    }

    await db.query(
      'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
      [firstname, lastname, email, password]
    );

    res.redirect('/login?success=registered');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).render('register', {
      error: 'Something went wrong. Try again.'
    });
  }
};



export const loginUser = async (req, res) => {
  let { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!rows.length) {
      return res.status(400).render('log-in', { error: 'Email not found' });
    }

    const user = rows[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch) {

      req.session.user = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      };

      return res.redirect('/indexPage');
    } else {
      return res.status(400).render('log-in', { error: 'Incorrect password' });

    }

  } catch (e) {
    console.log('Login failed:', e);
    return res.status(500).render('log-in', { error: 'Something went wrong' });
  }
};



export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};