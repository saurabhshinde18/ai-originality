# 🚀 Hosting Guide for Originality AI Lite

Since this application has two separate parts (a React frontend and a Python FastAPI backend), the easiest and most robust way to host it for free is to split them:
1. **Frontend:** Host on **Vercel** (Free, lightning-fast edge network).
2. **Backend:** Host on **Render.com** (Free, perfectly supports Python/FastAPI).

---

## Part 1: Host the Backend on Render (Free)

1. **Push your code to GitHub:** Create a new repository and push the entire `originality-ai-lite` folder to it.
2. Go to **[Render.com](https://render.com/)**, sign up, and click **New > Web Service**.
3. Connect your GitHub account and select your repository.
4. Fill in the following settings:
   - **Name:** `originality-ai-backend`
   - **Root Directory:** `backend` *(Crucial!)*
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Advanced**, then **Add Environment Variable**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `[Paste your Gemini API key here]`
6. Click **Create Web Service**. 
   > *Note: Render will take a few minutes to build. Once done, copy the URL they give you (e.g., `https://originality-ai-backend.onrender.com`).*

---

## Part 2: Connect Frontend to the Hosted Backend

Before hosting the frontend, we need to tell it where the backend lives globally.

1. Open `frontend/src/App.tsx`.
2. Locate `const API_BASE = "";` natively near the top (around line 14).
3. Change it to your new Render URL:
   ```javascript
   const API_BASE = "https://originality-ai-backend.onrender.com"; // Replace with your actual Render URL
   ```

---

## Part 3: Host the Frontend on Vercel (Free)

1. Go to **[Vercel.com](https://vercel.com/)** and sign in with GitHub.
2. Click **Add New > Project** and import your repository.
3. Because your frontend is inside a folder, you **must edit the Root Directory**:
   - Click "Edit" next to Root Directory and select `frontend`.
4. Vercel will automatically detect that you are using Vite and React. The build settings should automatically look like this:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

Vercel will run for about 1 minute and then give you a live production URL (e.g., `https://your-app.vercel.app`). 

---

### 🎉 You're Live!
Your full-stack application is now successfully hosted. Users can visit your Vercel URL globally, and it will securely communicate with your Render Python backend without exposing your Gemini API key!

---
*(Optional Troubleshooting: CORS)*
If your frontend drops connection errors, make sure you add your Vercel URL to the `ALLOWED_ORIGINS` list inside `backend/main.py`. So you would change:
`ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]` 
to:
`ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "https://your-domain.vercel.app"]`
