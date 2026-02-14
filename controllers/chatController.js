// ============================================
// Chat Controller - DarkBot
// ============================================

const Chat = require('../models/Chat');
const { callOpenAI, callGemini } = require('../services/aiService');

const pdfParse = require('pdf-parse');

/**
 * @route   POST /chat/send
 * @desc    Send a message and get AI response
 */
exports.sendMessage = async (req, res, next) => {
    try {
        // Add logging to debug req.body issue
        console.log('--- New Message Request ---');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);
        
        const body = req.body || {};
        const { message, chatId, aiProvider } = body;
        const userId = req.user._id;
        const files = req.files || [];

        if ((!message || !message.trim()) && files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message or file is required.'
            });
        }

        // Process attachments
        const attachments = [];
        let additionalContext = "";

        for (const file of files) {
            if (file.mimetype.startsWith('image/')) {
                attachments.push({
                    mimeType: file.mimetype,
                    data: file.buffer.toString('base64')
                });
            } else if (file.mimetype === 'application/pdf') {
                try {
                    const data = await pdfParse(file.buffer);
                    additionalContext += `\n\nContent from PDF (${file.originalname}):\n${data.text}`;
                } catch (pdfErr) {
                    console.error('PDF Parse Error:', pdfErr);
                }
            } else if (file.mimetype === 'text/plain') {
                additionalContext += `\n\nContent from file (${file.originalname}):\n${file.buffer.toString()}`;
            }
        }

        const finalMessage = message + additionalContext;

        // Determine AI provider
        const provider = aiProvider || req.user.preferences.aiProvider || 'gemini';

        let chat;

        if (chatId) {
            // Continue existing chat
            chat = await Chat.findOne({ _id: chatId, userId });
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found.'
                });
            }
        } else {
            // Create new chat
            chat = new Chat({
                userId,
                aiProvider: provider,
                messages: []
            });
        }

        // Add user message
        chat.messages.push({
            role: 'user',
            content: message.trim(),
            timestamp: new Date()
        });

        // Build conversation context
        const contextMessages = chat.messages.slice(-20).map(m => ({
            role: m.role,
            content: m.content
        }));

        // For the last user message, we might want to use the full message (including file text)
        // while keeping the stored message clean.
        const lastContextMsg = contextMessages[contextMessages.length - 1];
        lastContextMsg.content = finalMessage;

        // Call AI provider
        let aiResponse;
        try {
            if (provider === 'openai') {
                aiResponse = await callOpenAI(contextMessages);
            } else {
                aiResponse = await callGemini(contextMessages, attachments);
            }
        } catch (aiError) {
            console.error('AI API Error:', aiError.message);
            aiResponse = `⚠️ AI Error: ${aiError.message}`;
        }

        // Add AI response
        chat.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
        });

        // Generate title from first message
        if (chat.messages.filter(m => m.role === 'user').length === 1) {
            chat.generateTitle();
        }

        chat.aiProvider = provider;
        await chat.save();

        res.status(200).json({
            success: true,
            chatId: chat._id,
            title: chat.title,
            response: aiResponse,
            provider
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /chat/history
 * @desc    Get all chats for the current user
 */
exports.getChatHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId })
            .select('title aiProvider createdAt updatedAt')
            .sort({ updatedAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /chat/:chatId
 * @desc    Get a specific chat by ID
 */
exports.getChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.'
            });
        }

        res.status(200).json({
            success: true,
            chat
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /chat/:chatId
 * @desc    Delete a specific chat
 */
exports.deleteChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Chat deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /chat/clear/all
 * @desc    Delete all chats for the current user
 */
exports.clearAllChats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await Chat.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: 'All chats deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};
