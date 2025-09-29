const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in Authorization header or cookie
    let token = req.headers.authorization?.split(' ')[1] || (req.cookies ? req.cookies.token : null);
    console.log(`[${new Date().toISOString()}] Auth Middleware - Token:`, token || 'Absent');
    if (!token) {
      console.log(`[${new Date().toISOString()}] No token provided`);
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_fallback');
    console.log(`[${new Date().toISOString()}] Token decoded:`, decoded);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log(`[${new Date().toISOString()}] User not found for ID:`, decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }
    console.log(`[${new Date().toISOString()}] User authenticated:`, req.user.email);
    next();
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Auth middleware error:`, err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;