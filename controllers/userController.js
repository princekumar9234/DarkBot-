// ============================================
// User Controller - DarkBot
// ============================================

const User = require('../models/User');

/**
 * @route   GET /user/profile
 * @desc    Get user profile
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /user/profile
 * @desc    Update user profile
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user._id;

        // Check if email is being changed and if it already exists
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already in use.'
                });
            }
        }

        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true
        }).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /user/password
 * @desc    Change user password
 */
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters.'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match.'
            });
        }

        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect.'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /user/preferences
 * @desc    Update user preferences (theme, accent color, AI provider)
 */
exports.updatePreferences = async (req, res, next) => {
    try {
        const { theme, accentColor, aiProvider } = req.body;
        const userId = req.user._id;

        const updates = {};
        if (theme) updates['preferences.theme'] = theme;
        if (accentColor) updates['preferences.accentColor'] = accentColor;
        if (aiProvider) updates['preferences.aiProvider'] = aiProvider;

        const user = await User.findByIdAndUpdate(userId, { $set: updates }, {
            new: true,
            runValidators: true
        }).select('-password');

        res.status(200).json({
            success: true,
            message: 'Preferences updated.',
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /user/account
 * @desc    Delete user account and all data
 */
exports.deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const Chat = require('../models/Chat');

        // Delete all chats
        await Chat.deleteMany({ userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Account deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};
