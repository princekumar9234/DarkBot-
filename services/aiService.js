// ============================================
// AI Service - OpenAI & Google Gemini Integration
// ============================================

const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// System prompt for DarkBot
// System prompt for DarkBot (Trained as a Programming Expert)
const SYSTEM_PROMPT = `You are DarkBot, an expert Senior Software Engineer and Programming Tutor. 
Your goal is to help users master programming languages (like JavaScript, Python, C++, Java, etc.). 
When a user asks about coding:
1. Provide optimized, clean, and well-commented code.
2. Explain how the code works step-by-step.
3. Suggest best practices and mention any potential security risks.
4. Use proper Markdown formatting with language-specific syntax highlighting.
5. If the user makes a mistake, gently point it out and provide the correct logic.
You are encouraging, technical, and very thorough in your explanations.`;

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
