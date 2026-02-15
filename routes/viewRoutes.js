// ============================================
// View Routes - DarkBot (EJS Pages)
// ============================================

const express = require('express');
const router = express.Router();
const { authViewMiddleware, redirectIfAuth, loadUser } = require('../middleware/authMiddleware');
 
// Home / Landing page
router.get('/', loadUser, (req, res) => {
    res.render('home', { 
        title: 'DarkBot - Premium AI Assistant',
        user: req.user
    });
});

router.get('/login', redirectIfAuth, (req, res) => {
    res.render('login', { title: 'Login - DarkBot' });
});

// Signup page
router.get('/signup', redirectIfAuth, (req, res) => {
    res.render('signup', { title: 'Sign Up - DarkBot' });
});

// Chat page (protected)
router.get('/chat', authViewMiddleware, (req, res) => {
    res.render('chat', {
        title: 'DarkBot - AI Assistant',
        user: req.user
    });
});

// Settings page (protected)
router.get('/settings', authViewMiddleware, (req, res) => {
    res.render('settings', {
        title: 'Settings - DarkBot',
        user: req.user
    });
});

module.exports = router;
