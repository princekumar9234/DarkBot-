// ============================================
// Chat Routes - DarkBot
// ============================================

const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getChat, deleteChat, clearAllChats } = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimiter');

// All chat routes require authentication
router.use(authMiddleware);

// POST /chat/send - Send message and get AI response
router.post('/send', chatLimiter, sendMessage);

// GET /chat/history - Get all chats
router.get('/history', getChatHistory);

// DELETE /chat/clear/all - Delete all chats
router.delete('/clear/all', clearAllChats);

// GET /chat/:chatId - Get specific chat
router.get('/:chatId', getChat);

// DELETE /chat/:chatId - Delete specific chat
router.delete('/:chatId', deleteChat);

module.exports = router;
