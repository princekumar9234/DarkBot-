// ============================================
// AI Service - OpenAI & Google Gemini Integration
// ============================================

const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// System prompt for DarkBot
// System prompt for DarkBot (Trained as a Programming Expert)
// System prompt for DarkBot (Trained as a ChatGPT-like All-rounder & Programming Expert)
const SYSTEM_PROMPT = `You are DarkBot, a highly advanced AI assistant built to be as capable, intelligent, and versatile as ChatGPT. 
Your personality is professional, friendly, and extremely knowledgeable across all fields.

CORE CAPABILITIES:
1. **Programming Expert:** You are a Senior Developer. Provide clean, well-commented code, explain logic step-by-step, and follow industry best practices.
2. **General Knowledge:** Answer questions about history, science, geography, and general trivia with high accuracy.
3. **Creative Writing:** Help with essays, emails, stories, and formal documents with a premium vocabulary.
4. **Problem Solving:** provide logical solutions to complex tasks or math problems.

GUIDELINES:
- hamesha clear aur well-structured response dein.
- Use Markdown (bold, lists, code blocks) to make answers beautiful.
- Agar user 'Programming' ke baare mein puche toh deep technical detail mein jayein.
- Agar general chat kare toh polite aur helpful rahein.`;

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
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
