// ============================================
// User Routes - DarkBot
// ============================================

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, updatePreferences, deleteAccount } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authMiddleware);

// GET /user/profile - Get user profile
router.get('/profile', getProfile);

// PUT /user/profile - Update user profile
router.put('/profile', updateProfile);

// PUT /user/password - Change password
router.put('/password', changePassword);

// PUT /user/preferences - Update preferences
router.put('/preferences', updatePreferences);

// DELETE /user/account - Delete account
router.delete('/account', deleteAccount);

module.exports = router;
