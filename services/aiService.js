// ============================================
// AI Service - OpenAI & Google Gemini Integration
// ============================================

const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// System prompt for DarkBot
const SYSTEM_PROMPT = `You are DarkBot, a helpful, intelligent, and friendly AI assistant. You provide clear, accurate, and well-structured responses. You can help with coding, writing, analysis, math, creative tasks, and general questions. When providing code, use proper markdown formatting with code blocks. Be concise but thorough.`;

/**
 * Call OpenAI ChatGPT API
 * @param {Array} messages - Array of { role, content } objects
 * @returns {string} AI response content
 */
async function callOpenAI(messages) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        throw new Error('OpenAI API key is not configured. Please add your API key in settings.');
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    // Prepend system message
    const fullMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
    ];

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: fullMessages,
        max_tokens: 2048,
        temperature: 0.7,
    });

    return completion.choices[0].message.content;
}

/**
 * Call Google Gemini API
 * @param {Array} messages - Array of { role, content } objects
 * @returns {string} AI response content
 */
async function callGemini(messages) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key is not configured. Please add your API key in settings.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build chat history for Gemini (convert from OpenAI format)
    const history = [];
    for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        history.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        });
    }

    // Get last message
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
        history,
        systemInstruction: SYSTEM_PROMPT,
    });

    const result = await chat.sendMessage(lastMessage);
    return result.response.text();
}

module.exports = { callOpenAI, callGemini };
