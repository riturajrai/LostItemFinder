const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    res.status(200).json({ message: 'Welcome to the dashboard', user: { id: req.user._id, email: req.user.email, name: req.user.name } });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;