# DevLens Setup Instructions

## 🚀 Getting Started

### Step 1: Prerequisites Setup

Ensure you have installed:
- Python 3.11+ ([Download](https://www.python.org/))
- Node.js 20+ ([Download](https://nodejs.org/))
- Docker & Docker Compose ([Download](https://www.docker.com/))
- Git ([Download](https://git-scm.com/))

### Step 2: Create API Keys

1. **GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `public_repo`, `repo`
   - Copy the token

2. **Google Gemini API Key**
   - Go to https://ai.google.dev/
   - Click "Get API Key"
   - Create a new API key
   - Copy the key

### Step 3: Configure Environment

**Backend Environment:**
```bash
cd devlens/backend
cp .env.example .env
```

Edit `backend/.env`:
```env
GITHUB_TOKEN=ghp_your_token_here
GEMINI_API_KEY=your_gemini_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devlens  # Optional
REDIS_URL=redis://localhost:6379
API_PORT=8000
DEBUG=True
```

**Frontend Environment:**
```bash
cd devlens/frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Step 4: Run the Application

#### Option A: Using Docker Compose (Recommended)

```bash
cd devlens
docker-compose up --build
```

Then open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

#### Option B: Local Development

**Terminal 1 - Backend:**
```bash
cd devlens/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Redis:**
```bash
docker run -p 6379:6379 redis:7-alpine
```

**Terminal 3 - Frontend:**
```bash
cd devlens/frontend
npm install
npm run dev
```

Open http://localhost:5173

## 📚 API Usage Examples

### Search Repositories
```bash
curl "http://localhost:8000/api/search?q=machine%20learning&language=Python&sort=stars"
```

### Analyze Repository
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "tensorflow",
    "repo": "tensorflow",
    "description": "Machine learning framework"
  }'
```

### Test in Browser
Open http://localhost:8000/docs for interactive API documentation

## 🔍 Exploring the Project

### Backend Structure
- `main.py` - FastAPI application entry point
- `config.py` - Environment configuration
- `routers/` - API endpoints (search, analyze, chat, etc.)
- `services/` - Business logic (GitHub, AI, caching, etc.)

### Frontend Structure
- `src/App.jsx` - Main application component
- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/api/` - API client configuration

## 🛠 Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- Backend: Changes are auto-reloaded when running with `--reload`
- Frontend: Vite automatically refreshes on code changes

### Debugging
1. **Backend Logs**: Check terminal where FastAPI is running
2. **Frontend Console**: Open DevTools (F12) → Console tab
3. **Network Requests**: DevTools → Network tab

### Testing Search
1. Go to http://localhost:5173
2. Search for: "web development", "machine learning", "api", etc.
3. Click "Analyze" on any result to see AI analysis

## 🐛 Troubleshooting

### "Connection refused" errors
- Ensure Redis is running: `redis-cli ping`
- Check backend is on port 8000: `lsof -i :8000`
- Check frontend is on port 5173: `lsof -i :5173`

### "Invalid GitHub token"
- Generate a new token at https://github.com/settings/tokens
- Ensure token has `public_repo` scope

### "Gemini API error"
- Verify API key is correct
- Check API is enabled in Google Cloud Console
- Wait a minute and retry (rate limiting)

### Module not found errors (Python)
```bash
cd devlens/backend
pip install -r requirements.txt
```

### Module not found errors (Node.js)
```bash
cd devlens/frontend
npm install
```

## 📖 Next Steps

1. **Explore the API** - Open http://localhost:8000/docs
2. **Search Repositories** - Use the web UI to search
3. **Analyze Projects** - Click "Analyze" to see AI insights
4. **Chat About Repos** - Ask questions in the chat panel
5. **Read Documentation** - Check README.md for full details

## 🚢 Deployment

### Deploy to Azure
```bash
# Requires Azure CLI
az login
az acr build --registry <registry-name> --image devlens:latest .
```

### Deploy to Cloud Run
```bash
# Requires Google Cloud CLI
gcloud run deploy devlens-backend --source ./backend
gcloud run deploy devlens-frontend --source ./frontend
```

## 📞 Support

If you encounter issues:
1. Check terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check firewall isn't blocking ports

---

**Happy coding! 🎉**
