import express from "express";
import bodyParser from 'body-parser';
import session from 'express-session';
import { createRequire } from 'module';
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import notesRoutes from './routes/notes.routes.js';

dotenv.config();

const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);

const app = express();


console.log("MySQL User:", process.env.DB_USER);
console.log("MySQL Password:", process.env.DB_PASSWORD);

// ✅ MySQL Session Store Configuration
const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const sessionStore = new MySQLStore(options);

// ✅ Session Middleware
app.use(session({
    key: 'user_sid',
    secret: process.env.SECRET || 'mySecretKey',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// ✅ Body Parsers & Static Files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// ✅ View Engine
app.set('view engine', 'ejs');

// ✅ Auth Middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/log-in');
    }
    next();
};

// ✅ Routes
app.use('/', authRoutes);
app.use('/notes', notesRoutes);

app.get('/history', requireAuth, (req, res) => {
    res.render('history', { user: req.session.user });
});

app.get('/account', requireAuth, (req, res) => {
    res.render('account', {
        user: req.session.user,
        accountData: null
    });
});

app.get('/aboutUs', (req, res) => {
    res.render('aboutUs', {
        user: req.session.user || null
    });
});

app.get('/contactUs', (req, res) => {
    res.render('contactUs', {
        user: req.session.user || null
    });
});

app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/indexPage');
    }
    res.render('register', { user: null });
});

app.get('/log-in', (req, res) => {
    if (req.session.user) {
        return res.redirect('/indexPage');
    }
    res.render('log-in', {
        user: null,
        success: req.query.success
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

// ✅ Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// ✅ 404 Handler
app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).send('Route not found: ' + req.url);
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
