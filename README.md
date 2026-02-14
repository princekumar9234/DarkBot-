# 🤖 DarkBot - AI Chatbot

A production-ready AI chatbot web application with a ChatGPT-like interface, powered by **OpenAI** and **Google Gemini** APIs.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)

---

## ✨ Features

- 🎨 **ChatGPT-like UI** - Premium dark/light theme interface
- 🤖 **Dual AI Providers** - Switch between OpenAI ChatGPT and Google Gemini
- 💬 **Real-time Chat** - Smooth messaging with typing indicators
- 📝 **Markdown Support** - Code blocks, tables, lists, and more
- 📋 **Code Copy** - One-click copy for code blocks
- 📂 **Chat History** - All conversations saved and accessible
- 🔐 **Authentication** - JWT-based login/signup with bcrypt hashing
- ⚙️ **Settings** - Theme, accent color, AI provider, profile management
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🛡️ **Rate Limiting** - Protection against API abuse
- 🎨 **7 Accent Colors** - Customize your experience

---

## 📁 Project Structure

```
ChatBot/
├── controllers/
│   ├── authController.js      # Login, Signup, Logout
│   ├── chatController.js      # Send messages, Chat history
│   └── userController.js      # Profile, Preferences, Password
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── errorHandler.js        # Global error handler
│   └── rateLimiter.js         # Rate limiting
├── models/
│   ├── User.js                # User schema with bcrypt
│   └── Chat.js                # Chat schema with messages
├── routes/
│   ├── authRoutes.js          # /auth/* routes
│   ├── chatRoutes.js          # /chat/* routes
│   ├── userRoutes.js          # /user/* routes
│   └── viewRoutes.js          # Page routes (EJS)
├── services/
│   └── aiService.js           # OpenAI & Gemini integration
├── views/
│   ├── chat.ejs               # Main chat interface
│   ├── login.ejs              # Login page
│   ├── signup.ejs             # Registration page
│   ├── settings.ejs           # Settings page
│   └── error.ejs              # Error page
├── public/
│   └── css/
│       └── style.css          # Complete design system
├── server.js                  # Express app entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB** running locally or a MongoDB Atlas URI
- API keys from **OpenAI** and/or **Google Gemini**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/princekumar9234/chatbot.git
   cd chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Edit the `.env` file with your credentials:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/darkbot
   JWT_SECRET=your_strong_secret_key
   SESSION_SECRET=your_session_secret
   OPENAI_API_KEY=sk-your-openai-key
   GEMINI_API_KEY=your-gemini-api-key
   PORT=3000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/send` | Send message & get AI response |
| GET | `/chat/history` | Get all user chats |
| GET | `/chat/:chatId` | Get specific chat |
| DELETE | `/chat/:chatId` | Delete a chat |
| DELETE | `/chat/clear/all` | Delete all chats |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get user profile |
| PUT | `/user/profile` | Update profile |
| PUT | `/user/password` | Change password |
| PUT | `/user/preferences` | Update preferences |
| DELETE | `/user/account` | Delete account |

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `SESSION_SECRET` | Express session secret | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ❌ (if using Gemini) |
| `GEMINI_API_KEY` | Google Gemini API key | ❌ (if using OpenAI) |
| `PORT` | Server port (default: 3000) | ❌ |

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, EJS
- **Backend**: Node.js, Express.js 5
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI GPT-3.5-Turbo, Google Gemini 2.0 Flash
- **Auth**: JWT + bcrypt
- **Security**: Helmet, CORS, Rate Limiting

---

## 📸 Pages

- `/` - Login page
- `/signup` - Registration page
- `/chat` - Main chat interface
- `/settings` - User settings & preferences

---

## 👤 Author

**Prince Kumar**

---

## 📄 License

This project is licensed under the ISC License.
