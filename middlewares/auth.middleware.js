// middleware/auth.middleware.js

export const requireAuth = (req, res, next) => {
  // Check if user is authenticated via session
  if (!req.session.user) {
    return res.redirect("/log-in");
  }
  next();
};

export default requireAuth;