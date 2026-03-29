# 🚀 Hosting Guide for Originality AI Lite (Render Only)

This guide explains how to host **both** your Python Backend and your React Frontend completely on **[Render.com](https://render.com/)** for free.

## Prerequisites
Push your code to GitHub. Ensure you have pushed the entire `originality-ai-lite` folder, and that your new `.gitignore` file successfully ignored `.env` so your API key isn't public!

---

## Part 1: Host the Backend on Render (Web Service)

1. Go to **Render.com**, sign in, and click **New > Web Service**.
2. Connect your GitHub account and select your repository.
3. Fill in the following settings exactly:
   - **Name:** `originality-ai-backend`
   - **Root Directory:** `originality-ai-lite/backend` *(Crucial!)*
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Scroll down and click **Advanced**, then **Add Environment Variable**:
   - **Key:** `GEMINI_API_KEY` | **Value:** `[Paste your actual Gemini API key here]`
   - **Key:** `PYTHON_VERSION`   | **Value:** `3.11.6` *(This is crucial! It stops Render from trying to use a bleeding-edge Python version which breaks dependency installations).*
5. Click **Create Web Service**. 
6. Wait a few minutes for the build to finish. Once it is "Live", **Copy the URL** at the top left (it will look something like `https://originality-ai-backend-xxxx.onrender.com`).

---

## Part 2: Connect the Frontend to Your Live Backend

Before we can deploy the frontend, we must tell it where your securely hosted backend lives.

1. Open `frontend/src/App.tsx` on your local computer.
2. At the top (around line 14), locate: 
   `const API_BASE = "";`
3. Change it to your new backend URL from Render:
   ```javascript
   const API_BASE = "https://your-backend-url.onrender.com"; // Replace with your copied Render URL. Do NOT add a slash at the end.
   ```
4. **Commit and Push** this change to your GitHub repository.

---

## Part 3: Host the Frontend on Render (Static Site)

Now we will host the React application as a blazing-fast static edge site.

1. Go back to your Render Dashboard, click **New > Static Site**.
2. Select the *exact same* GitHub repository.
3. Fill in the following settings exactly:
   - **Name:** `originality-ai-frontend`
   - **Root Directory:** `originality-ai-lite/frontend` *(Crucial!)*
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Click **Create Static Site**.
5. Wait a minute or two for the build to finish. Once it says "Live", click the new URL at the top left.

### 🎉 You're Live!
Both your React app and your Python FastAPI backend are now successfully hosted entirely on the Render ecosystem! Your frontend will securely communicate with your backend, and your Gemini API key remains safely hidden on Render's servers.

---
### Notice regarding CORS Errors
If your frontend drops connection errors, make sure you add your final frontend URL to the `ALLOWED_ORIGINS` list inside `backend/main.py` so the backend allows requests from it. 

Change:
`ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]`
To:
`ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "https://your-new-frontend-url.onrender.com"]`
