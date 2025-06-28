import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';

const router = express.Router();

// ✅ Register
router.post('/register', registerUser);

// ✅ Login GET (renders page)
router.get('/login', (req, res) => {
  res.render('log-in', {
    user: req.session.user || null,
    success: req.query.success || null
  });
});

// ✅ Login POST
router.post('/login', loginUser);

// ✅ Index Page (auth-protected)
router.get('/indexPage', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/log-in');
  }
  res.render('indexPage', { user: req.session.user });
});

// ✅ Home route (optional user info)
router.get('/', (req, res) => {
  res.render('indexPage', { user: req.session.user || null });
});

// ✅ Logout
router.get('/logout', logoutUser);

export default router;
