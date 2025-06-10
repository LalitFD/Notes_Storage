import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    // destination: (req, file, cb) => cb(null, 'public', 'uploads', 'notes'),
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

export const uploadNotes = [
    upload.single('notesFile'),
    async (req, res) => {
        try {
            const { title } = req.body;
            const fileName = req.file.filename;
            const userId = req.session.user?.id;

            if (!userId || !fileName) return res.sendStatus(400);

            const query = 'INSERT INTO notes (user_id, title, file_name) VALUES (?, ?, ?)';
            await db.execute(query, [userId, title, fileName]);

            res.redirect('/notes/upload');
        } catch (err) {
            console.error('Upload error:', err.message);
            res.sendStatus(500);
        }
    }
];


export const getMyNotes = async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/log-in');

    try {
        const query = `
      SELECT id, title, file_name, upload_date 
      FROM notes 
      WHERE user_id = ? 
      ORDER BY upload_date DESC
    `;
        const [notes] = await db.execute(query, [userId]);

        res.render('myNotes', { notes, user: req.session.user });
    } catch (err) {
        console.error('Notes fetch error:', err);
        res.status(500).render('error', { message: 'Could not load notes' });
    }
};


export const viewNote = async (req, res) => {

    const noteId = req.params.id;
    const userId = req.session.user?.id;

    if (!userId) {
        console.log('No user ID found, redirecting to login');
        return res.redirect('/log-in');
    }

    try {
        const query = 'SELECT * FROM notes WHERE id = ? AND user_id = ?';
        const [notes] = await db.execute(query, [noteId, userId]);

        if (!notes.length) {
            console.log('No notes found for this user and ID');
            return res.status(404).render('error', { message: 'Note not found' });
        }
        const note = notes[0];
        console.log('Note details:', note);
        const filePath = path.join(process.cwd(), 'public/uploads/notes', note.file_name);

        if (!fs.existsSync(filePath)) {
            return res.status(404).render('error', { message: 'File missing' });
        }
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).render('error', { message: 'Could not display note' });
    }
};



export const getHistory = async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'User login nahi hai' });

    try {
        const query = `
      SELECT id, title, file_name, upload_date 
      FROM notes 
      WHERE user_id = ? 
      ORDER BY upload_date DESC 
      LIMIT 5
    `;
        const [notes] = await db.execute(query, [userId]);

        res.render('history', { notes, user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};



export const getAccount = async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/log-in');

    try {
        const [userRows] = await db.execute(
            'SELECT firstname, lastname, email FROM users WHERE id = ?',
            [userId]
        );

        if (!userRows.length) return res.redirect('/log-in');

        const [notesCount] = await db.execute(
            'SELECT COUNT(*) as total_notes FROM notes WHERE user_id = ?',
            [userId]
        );

        const userData = {
            firstname: userRows[0].firstname,
            lastname: userRows[0].lastname,
            email: userRows[0].email,
            total_notes: notesCount[0].total_notes
        };

        res.render('account', {
            user: req.session.user,
            accountData: userData
        });
    } catch (error) {
        console.error('Account fetch error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteNote = async (request, response) => {
    try {
        let id = parseInt(request.params.id)

        let query = "delete from notes where id = ?"
        const [notes] = await db.execute(query, [id]);
        return response.redirect('/notes/myNotes');
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal sever error" })
    }
}


// export const updateAccount = async (req, res) => {
//     const userId = req.session.user?.id;
//     if (!userId) return res.redirect('/log-in');

//     const { firstname, lastname, email } = req.body;

//     try {
//         await db.execute(
//             'UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?',
//             [firstname, lastname, email, userId]
//         );

//         // Update session info
//         req.session.user = { ...req.session.user, firstname, lastname, email };

//         res.redirect('/account?updated=true');
//     } catch (error) {
//         console.error('Account update error:', error);
//         res.status(500).json({ error: 'Update failed' });
//     }
// };


export const showUploadForm = (req, res) => {
    res.render('uploadNotes', { user: req.session.user });
};