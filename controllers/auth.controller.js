// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    let { password } = req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('register', {
        error: 'Email already registered'
      });
    }

    // ✅ Hash password
    const saltKey = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, saltKey);

    // ✅ Save new user
    await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword
    });

    res.redirect('/log-in?success=registered');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).render('register', {
      error: 'Something went wrong. Try again.'
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).render('log-in', { error: 'Email not found' });
    }

    // ✅ Check password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(400).render('log-in', { error: 'Incorrect password' });
    }

    // ✅ Store user in session
    req.session.user = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    };

    res.redirect('/indexPage');
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).render('log-in', { error: 'Something went wrong' });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};
