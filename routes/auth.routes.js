import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);

router.get('/login', (req, res) => {
  res.render('log-in', {
    user: req.session.user || null,
    success: req.query.success || null
  });
});

router.post('/login', loginUser);

router.get('/indexPage', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/log-in');
  }
  res.render('indexPage', { user: req.session.user });
});

router.get('/', (req, res) => {
  res.render('indexPage', { user: req.session.user || null });
});

router.get('/logout', logoutUser);

export default router;
