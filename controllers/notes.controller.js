import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Note } from '../models/notes.model.js';
import { User } from '../models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'public', 'uploads', 'notes');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + Math.floor(Math.random() * 1000000000) + path.extname(file.originalname);
    cb(null, name);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// ✅ Upload Notes
export const uploadNotes = [
  upload.single('notesFile'),
  async (req, res) => {
    try {
      const { title } = req.body;
      const fileName = req.file?.filename;
      const userId = req.session.user?.id;

      if (!userId || !fileName) return res.sendStatus(400);

      await Note.create({
        user_id: userId,
        title,
        file_name: fileName
      });

      res.redirect('/notes/upload');
    } catch (err) {
      console.error('Upload error:', err.message);
      res.sendStatus(500);
    }
  }
];

// ✅ My Notes List
export const getMyNotes = async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.redirect('/log-in');

  try {
    const notes = await Note.find({ user_id: userId }).sort({ upload_date: -1 });
    res.render('myNotes', { notes, user: req.session.user });
  } catch (err) {
    console.error('Notes fetch error:', err);
    res.status(500).render('error', { message: 'Could not load notes' });
  }
};

// ✅ View Single Note
export const viewNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.session.user?.id;

  if (!userId) return res.redirect('/log-in');

  try {
    const note = await Note.findOne({ _id: noteId, user_id: userId });
    if (!note) return res.status(404).render('error', { message: 'Note not found' });

    const filePath = path.join(process.cwd(), 'public/uploads/notes', note.file_name);
    if (!fs.existsSync(filePath)) return res.status(404).render('error', { message: 'File missing' });

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).render('error', { message: 'Could not display note' });
  }
};

// ✅ Get History (Recent 5 Notes)
export const getHistory = async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'User login nahi hai' });

  try {
    const notes = await Note.find({ user_id: userId })
      .sort({ upload_date: -1 })
      .limit(5);

    res.render('history', { notes, user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Account Page Info
export const getAccount = async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.redirect('/log-in');

  try {
    const user = await User.findById(userId);
    const total_notes = await Note.countDocuments({ user_id: userId });

    if (!user) return res.redirect('/log-in');

    const userData = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      total_notes
    };

    res.render('account', {
      user: req.session.user,
      accountData: userData
    });
  } catch (err) {
    console.error('Account fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Delete Note
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    await Note.findByIdAndDelete(noteId);
    res.redirect('/notes/myNotes');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Upload Form Page
export const showUploadForm = (req, res) => {
  res.render('uploadNotes', { user: req.session.user });
};
