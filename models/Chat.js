// ============================================
// Chat Model - DarkBot
// ============================================

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'New Chat',
        maxlength: 100
    },
    messages: [messageSchema],
    aiProvider: {
        type: String,
        enum: ['openai', 'gemini'],
        default: 'gemini'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
chatSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

// Auto-generate title from the first user message
chatSchema.methods.generateTitle = function () {
    const firstUserMsg = this.messages.find(m => m.role === 'user');
    if (firstUserMsg) {
        this.title = firstUserMsg.content.substring(0, 60) + (firstUserMsg.content.length > 60 ? '...' : '');
    }
    return this.title;
};

module.exports = mongoose.model('Chat', chatSchema);
