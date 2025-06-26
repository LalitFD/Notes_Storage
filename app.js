import express from "express";
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes.js';
import session from 'express-session';
import notesRoutes from './routes/notes.routes.js';
import userRoutes from './routes/notes.routes.js';
import dotenv from "dotenv"
dotenv.config()

const app = express();



app.use(session({
    secret: process.env.secret
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.set('view engine', 'ejs');


app.use('/uploads', express.static('public/uploads'));


const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/log-in');
    }
    next();
};


app.use('/', authRoutes);

app.use('/notes', notesRoutes);


app.get('/history', requireAuth, (req, res) => {
    res.render('history', {
        user: req.session.user
    });
});

app.get('/account', requireAuth, (req, res) => {
    res.render('account', {
        user: req.session.user
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
    res.render('register', {
        user: null
    });
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

// app.js mein add kar
app.get('/account', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/log-in');
    }

    res.render('account', {
        user: req.session.user,
        accountData: null
    });
});



app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).send('Route not found: ' + req.url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});