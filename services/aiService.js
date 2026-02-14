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
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key is not configured.');
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: messages.slice(0, -1).map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            generationConfig: {
                maxOutputTokens: 2048,
            },
        });

        // Prepend system prompt to the actual message for now to be safe
        const lastMsg = messages[messages.length - 1].content;
        const prompt = messages.length === 1 
            ? `${SYSTEM_PROMPT}\n\nUser: ${lastMsg}` 
            : lastMsg;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error details:', error);
        throw error;
    }
}

module.exports = { callOpenAI, callGemini };
