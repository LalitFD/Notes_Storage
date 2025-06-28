// routes/notes.routes.js

import express from 'express';
import {
  showUploadForm,
  uploadNotes,
  getMyNotes,
  viewNote,
  getHistory,
  getAccount,
  deleteNote
  // updateAccount
} from '../controllers/notes.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; // Fixed: middleware → middlewares

const router = express.Router();

// ✅ All routes protected
router.use(requireAuth);

// Routes
router.get('/upload', showUploadForm);
router.post('/upload', uploadNotes);
router.get('/myNotes', getMyNotes);
router.get('/view/:id', viewNote);
router.get('/delete/:id', deleteNote); // optionally change to router.delete
router.get('/history', getHistory);
router.get('/account', getAccount);

// router.post('/account/update', updateAccount);

export default router;