// ============================================
// Auth Middleware - JWT Verification
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect API routes
 * Verifies JWT token from cookies or Authorization header
 */
const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check cookie first, then Authorization header
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Please log in.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please log in again.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please log in again.'
        });
    }
};

/**
 * Middleware to protect view routes (redirects to login)
 */
const authViewMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

/**
 * Middleware: redirect to chat if already logged in
 */
const redirectIfAuth = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.token) {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (user) {
                return res.redirect('/chat');
            }
        }
        next();
    } catch (error) {
        next();
    }
};

/**
 * Middleware: just load user if exists (no redirect)
 */
const loadUser = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.token) {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        next();
    }
};

module.exports = { authMiddleware, authViewMiddleware, redirectIfAuth, loadUser };
