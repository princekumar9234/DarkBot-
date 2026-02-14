// ============================================
// Auth Routes - DarkBot
// ============================================

const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /auth/signup - Register new user
router.post('/signup', authLimiter, signup);

// POST /auth/login - Login user
router.post('/login', authLimiter, login);

// POST /auth/logout - Logout user
router.post('/logout', logout);

module.exports = router;
