# Originality AI Lite

A modern AI-powered SaaS tool that checks plagiarism and humanizes text — built with **React + Vite (TypeScript)** on the frontend and **Python FastAPI** on the backend, powered by **Google Gemini AI**.

---

## 📁 Project Structure

```
originality-ai-lite/
├── backend/
│   ├── main.py              # FastAPI app with Gemini API routes
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # GEMINI_API_KEY goes here
└── frontend/
    ├── src/
    │   ├── App.tsx           # Main app + state management
    │   ├── main.tsx          # React entry point
    │   ├── index.css         # Global Tailwind styles
    │   ├── components/
    │   │   ├── InputBox.tsx          # Textarea + word/char counter
    │   │   ├── ActionButtons.tsx     # Check / Humanize / Fix All / Clear
    │   │   ├── PlagiarismResult.tsx  # Score bar + highlighted text
    │   │   ├── HumanizedResult.tsx   # Rewritten text + copy/download
    │   │   └── Loader.tsx            # Animated spinner
    │   └── utils/
    │       └── highlightText.ts      # Sentence highlighting + counters
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🚀 Quick Start

### 1. Configure API Key

Edit `backend/.env`:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get your key at: https://aistudio.google.com/app/apikey

---

### 2. Start the Backend

```bash
cd backend

# Create virtual env (first time only)
python -m venv .venv

# Activate virtual env
# Windows:
.\.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at → http://localhost:8000

---

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → http://localhost:5173

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 Plagiarism Check | AI-generated score (0–100%) + suspicious sentence highlights |
| 🤖 Humanize Text | Rewrites text to sound natural and original |
| ⚡ Fix All | Runs both operations sequentially |
| 🌙 Dark Mode | System preference + manual toggle |
| 📋 Copy / Download | Copy rewritten text or download as `.txt` |
| 📊 Live Counters | Word and character count as you type |

---

## 🔐 Security

- API key is stored in `backend/.env` and never sent to the browser
- All Gemini calls go through FastAPI backend routes
- CORS locked to localhost dev origins

---

## ⚠️ Disclaimer

Results are AI-based estimations and may not match professional plagiarism tools like Turnitin.
