import express from 'express';
import {
    showUploadForm,
    uploadNotes,
    getMyNotes,
    viewNote,
    getHistory,
    getAccount
    , deleteNote
} from '../controllers/notes.controller.js';

const router = express.Router();

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/log-in');
    }
    next();
};

router.use(requireAuth);

router.get('/upload', showUploadForm);

router.post('/upload', uploadNotes);

router.get('/myNotes', getMyNotes);

router.get('/view/:id', viewNote);

router.get('/delete/:id', deleteNote);

router.get('/history', getHistory);

router.get('/account', getAccount);

// router.post('/account/update', updateAccount);

export default router;
