# ClimaX — Complete Setup Guide

> This guide walks you through every step needed to run ClimaX locally, in Docker, or deploy it to the cloud.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone the Repository](#2-clone-the-repository)
3. [Environment Configuration](#3-environment-configuration)
4. [Backend Setup (Python / FastAPI)](#4-backend-setup)
5. [Frontend Setup (Next.js)](#5-frontend-setup)
6. [Running the Full Stack](#6-running-the-full-stack)
7. [API Keys — Where to Get Them](#7-api-keys--where-to-get-them)
8. [Docker Setup (Optional)](#8-docker-setup-optional)
9. [Cloud Deployment Guide](#9-cloud-deployment)
10. [Testing the Installation](#10-testing-the-installation)
11. [Common Issues & Fixes](#11-common-issues--fixes)

---

## 1. Prerequisites

Ensure the following are installed on your machine before proceeding:

| Tool | Minimum Version | Install Link |
|---|---|---|
| **Python** | 3.11+ | https://python.org/downloads |
| **Node.js** | 18.0+ | https://nodejs.org |
| **npm** | 9.0+ | Bundled with Node.js |
| **pnpm** (optional) | 8.0+ | `npm install -g pnpm` |
| **Git** | 2.x | https://git-scm.com |
| **Docker** (optional) | 24.x | https://docker.com |

Verify your installations:
```bash
python --version     # Should show 3.11.x or higher
node --version       # Should show v18.x or higher
npm --version        # Should show 9.x or higher
git --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/your-org/climax.git
cd climax
```

Your working directory should look like:
```
climax/
├── backend/
├── frontend/
├── .env.example
├── .gitignore
├── README.md
├── SETUP_GUIDE.md
├── FOLDER_STRUCTURE.md
├── FEATURES_AND_IMPACT.md
└── requirements.txt
```

---

## 3. Environment Configuration

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env
```

Open `.env` in your editor:

```env
# ─── WEATHER APIS ───────────────────────────────────────────
OPENWEATHER_API_KEY=your_openweather_api_key_here
WAQI_API_KEY=your_waqi_api_key_here

# ─── AI / LLM ───────────────────────────────────────────────
GROQ_API_KEY=your_groq_api_key_here

# ─── TWILIO (for SMS alerts) ────────────────────────────────
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# ─── TARGET (receiver for test SMS) ─────────────────────────
TARGET_PHONE_NUMBER=your_verified_target_number
```

See [Section 7](#7-api-keys--where-to-get-them) for how to obtain each key.

---

## 4. Backend Setup

### Step 1: Navigate to backend directory
```bash
cd backend
```

### Step 2: Create a Python virtual environment
```bash
# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Windows (Command Prompt)
python -m venv venv
venv\Scripts\activate

# Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs: FastAPI, Uvicorn, Pydantic, NumPy, Pandas, OpenAI client, Transformers, Twilio, Cryptography, Plotly, pyttsx3, SpeechRecognition, and all other backend packages.

> **Note on PyAudio (Windows users):** If `pip install pyaudio` fails, install it manually:
> ```bash
> pip install pipwin
> pipwin install pyaudio
> ```

### Step 4: Ensure your `.env` file is accessible
The backend reads `.env` from the **project root**. Make sure you're running `uvicorn` from within the `backend/` directory while the `.env` is one level up, or copy it:
```bash
cp ../.env .env   # if running from inside backend/
```

### Step 5: Start the backend server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Started server process [...]
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

### Step 6: Verify backend is running
Open in your browser:
- **Health check:** http://localhost:8000/health
- **API docs (Swagger UI):** http://localhost:8000/docs
- **Alternative docs (ReDoc):** http://localhost:8000/redoc

---

## 5. Frontend Setup

Open a **new terminal** window (keep the backend running).

### Step 1: Navigate to the frontend directory
```bash
cd frontend
```

### Step 2: Install Node.js dependencies
```bash
# Using npm
npm install

# Or using pnpm (faster)
pnpm install
```

### Step 3: Configure the frontend environment (if needed)
The frontend automatically connects to `http://localhost:8000` in development mode. No additional frontend `.env` is required for local development.

For custom backend URLs:
```bash
# Create .env.local in the frontend/ directory
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local
```

### Step 4: Start the development server
```bash
npm run dev
# or
pnpm dev
```

You should see:
```
▲ Next.js 15.2.4
- Local:        http://localhost:3000
- Ready in 2.1s
```

### Step 5: Open the platform
Navigate to **http://localhost:3000** in your browser.

---

## 6. Running the Full Stack

For the best experience, run both servers simultaneously using two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will show a green **"Backend Connected"** status indicator when it successfully communicates with the API.

---

## 7. API Keys — Where to Get Them

### OpenWeatherMap API Key (Free)
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Go to **API Keys** in your account dashboard
4. Copy your default key or generate a new one
5. Free tier includes: current weather, forecasts, air quality

### WAQI API Key (Free)
1. Visit https://aqicn.org/data-platform/token/
2. Enter your email — the token is sent immediately
3. Free for non-commercial use with full global AQI data

### Groq API Key (Free — IBM Granite / LLaMA)
1. Visit https://console.groq.com
2. Sign up (free tier: ~14,000 requests/day)
3. Navigate to **API Keys** → Create a new key
4. ClimaX uses `llama-3.3-70b-versatile` — available on free tier

### Twilio (Optional — for SMS alerts)
1. Visit https://twilio.com
2. Create a free account (includes trial credits)
3. Get a Twilio phone number from the console
4. Copy Account SID and Auth Token from the dashboard
5. Add your personal phone number as a verified caller

---

## 8. Docker Setup (Optional)

### Build and run with Docker Compose

Create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      - backend
```

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Launch:
```bash
docker-compose up --build
```

---

## 9. Cloud Deployment

### Backend — Deploy to Railway / Render / AWS EC2

**Railway (recommended for quick deploy):**
1. Push your repo to GitHub
2. Visit https://railway.app → New Project → Deploy from GitHub
3. Select the `backend` directory as root
4. Add environment variables from your `.env`
5. Railway auto-detects FastAPI and sets the start command

**Render:**
1. Visit https://render.com → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command:** `pip install -r requirements.txt`
5. Set **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables in the Render dashboard

### Frontend — Deploy to Vercel

```bash
cd frontend
npx vercel --prod
```

Or connect your GitHub repo at https://vercel.com → New Project → select `frontend` as root directory.

Add the environment variable:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.railway.app
```

---

## 10. Testing the Installation

### Run the backend test suite:
```bash
cd backend
source venv/bin/activate
python test.py
```

### Manual endpoint tests (using curl):
```bash
# Health check
curl http://localhost:8000/health

# Weather data
curl http://localhost:8000/weather/Delhi

# Active alerts
curl http://localhost:8000/alerts/active

# Blockchain status
curl http://localhost:8000/blockchain/status

# Blockchain verification
curl http://localhost:8000/blockchain/verify
```

### Using the Swagger UI:
Visit http://localhost:8000/docs for an interactive API explorer where you can test all 60+ endpoints directly in the browser.

---

## 11. Common Issues & Fixes

### Issue: `ModuleNotFoundError: No module named 'pyaudio'`
**Fix (Ubuntu/Debian):**
```bash
sudo apt-get install portaudio19-dev python3-pyaudio
pip install pyaudio
```
**Fix (macOS):**
```bash
brew install portaudio
pip install pyaudio
```

### Issue: `GROQ_API_KEY not configured`
**Fix:** Ensure your `.env` file is in the same directory where you run `uvicorn`, or that the file exists at the project root. Double-check there are no trailing spaces in the key value.

### Issue: Frontend shows "Backend Disconnected"
**Fix:** Ensure the backend is running on port 8000. Check for firewall rules blocking localhost connections. Verify the backend health endpoint: `curl http://localhost:8000/health`.

### Issue: `pyttsx3` crashes on Linux
**Fix:**
```bash
sudo apt-get install espeak espeak-data libespeak-dev
pip install pyttsx3
```

### Issue: `npm install` fails with peer dependency errors
**Fix:**
```bash
npm install --legacy-peer-deps
```

### Issue: Next.js build fails with TypeScript errors
**Fix:**
```bash
npm run build -- --no-lint
```
Or fix the specific type error shown in the build output.

### Issue: Twilio SMS not sending
**Fix:** Ensure your `TARGET_PHONE_NUMBER` is added as a **Verified Caller ID** in the Twilio console (required for trial accounts).

---

## Development Tips

- The backend auto-reloads on file changes when running with `--reload`
- The frontend hot-reloads automatically in `npm run dev` mode
- All blockchain data is in-memory and resets on backend restart — this is by design for the prototype
- The RAG knowledge base is initialized at startup; adding documents requires a restart
- Use the Swagger docs at `/docs` to explore and test all API endpoints interactively

---

> For feature documentation and impact analysis, see [`FEATURES_AND_IMPACT.md`](FEATURES_AND_IMPACT.md)
> For a full repository map, see [`FOLDER_STRUCTURE.md`](FOLDER_STRUCTURE.md)
