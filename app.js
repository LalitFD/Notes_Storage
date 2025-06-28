import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";

// ✅ Env Config
dotenv.config();

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// ✅ __dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Express App Setup
const app = express();

// ✅ Session Store in MongoDB
app.use(session({
  secret: process.env.SECRET || 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ✅ View Engine & Static
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Body Parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Middleware to protect routes (keep this for individual route protection)
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/log-in");
  }
  next();
};

// ✅ Routes
app.use("/", authRoutes);
app.use("/notes", notesRoutes);

// ✅ Individual protected routes
app.get("/aboutUs", (req, res) => {
  res.render("aboutUs", {
    user: req.session.user || null
  });
});

app.get("/contactUs", (req, res) => {
  res.render("contactUs", {
    user: req.session.user || null
  });
});

app.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/indexPage");
  }
  res.render("register", { user: null });
});

app.get("/log-in", (req, res) => {
  if (req.session.user) {
    return res.redirect("/indexPage");
  }
  res.render("log-in", {
    user: null,
    success: req.query.success
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  console.log("❌ 404 - Route not found:", req.url);
  res.status(404).send("Route not found: " + req.url);
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).send("Something went wrong!");
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});