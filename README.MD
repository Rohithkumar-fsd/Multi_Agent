# 🏦 Banking Multi-Agent AI Assistant

A secure conversational banking assistant built with **Python, FastAPI, React, Groq, MySQL, and ChromaDB**.

## 🚀 Features

- 🤖 Multi-agent architecture with Coordinator, Account, Transaction, and Support agents
- 🔐 JWT authentication and account ownership authorization
- 🛠️ Controlled AI tool calling for banking operations
- 📚 RAG-based banking FAQ using ChromaDB
- 💬 Conversation memory
- 🛡️ PII redaction using Presidio
- 📝 Audit logging
- ⚛️ React dashboard

## 🏗️ Architecture

```text
                        User
                          │
                          ▼
                        React
                          │
                          ▼
                       FastAPI
                          │
                          ▼
                 JWT Authentication
                          │
                          ▼
                    Authorization
                          │
                          ▼
                  Coordinator Agent
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  Account Agent   Transaction Agent   Support Agent
        │                 │                 │
        ▼                 ▼                 ▼
      Tools             Tools              RAG
        │                 │                 │
        └────────┬────────┘                 │
                 ▼                          ▼
               MySQL                     ChromaDB
```

## 🔐 Security

The LLM never directly accesses the database.

```text
LLM → Agent → Controlled Tool → Authorization → Database
```

The authenticated `user_id` comes from the JWT, and backend ownership checks prevent users from accessing another user's financial data.

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI
- **AI:** Groq, Multi-Agent Architecture, RAG
- **Database:** MySQL, ChromaDB
- **Security:** JWT, bcrypt, Presidio
- **Frontend:** React, Vite

## ⚙️ Run Locally

### Backend

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=your_mysql_url
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_api_key
```

## 👨‍💻 Author

Rohith Kumar S
