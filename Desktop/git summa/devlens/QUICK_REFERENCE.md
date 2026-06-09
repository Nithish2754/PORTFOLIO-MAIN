# 🗂️ DevLens Quick Reference Guide

## Backend Files Quick Reference

### Entry Points
- **`main.py`** - FastAPI application initialization, CORS setup, router registration
- **`config.py`** - Pydantic BaseSettings for environment variables

### API Routers (`routers/`)
- **`search.py`** - `/api/search` - Repository search with ranking
- **`analyze.py`** - `/api/analyze` - Technology detection and AI analysis
- **`chat.py`** - `/api/chat` - Interactive Q&A about repositories
- **`recommend.py`** - `/api/recommend` - Find similar repositories
- **`resume.py`** - `/api/resume-match` - Resume to project matching

### Services (`services/`)
- **`github_service.py`** - GitHub API calls (search, README, files, languages)
- **`cache_service.py`** - Redis caching with TTL
- **`ranking_service.py`** - Scoring algorithm
- **`tech_detector.py`** - Technology stack detection
- **`ai_service.py`** - Gemini API integration (summaries, topics, chat)
- **`similarity_service.py`** - Semantic similarity using sentence transformers

### Other
- **`requirements.txt`** - Python dependencies
- **`Dockerfile`** - Docker image for backend
- **`.env.example`** - Environment variable template

---

## Frontend Files Quick Reference

### Core Files
- **`src/main.jsx`** - React entry point
- **`src/App.jsx`** - Main app component, routing and layout
- **`src/index.css`** - Tailwind CSS setup

### Components (`src/components/`)
- **`SearchBar.jsx`** - Search input with language/sort filters
- **`RepoCard.jsx`** - Repository card display with stats
- **`TechBadges.jsx`** - Technology badges renderer
- **`AISummary.jsx`** - AI summary display component
- **`RepoChat.jsx`** - Chat interface for Q&A

### Pages (`src/pages/`)
- **`Home.jsx`** - Landing page with hero section
- **`SearchResults.jsx`** - Search results display
- **`RepoDetail.jsx`** - (Ready for repo detail view)
- **`ResumeMatcher.jsx`** - (Ready for resume upload)

### State Management
- **`src/store/useAppStore.js`** - Zustand global state (results, favorites, chat)

### Custom Hooks (`src/hooks/`)
- **`useSearch.js`** - Search query hook with React Query
- **`useRepo.js`** - Repository analysis hook

### API Client
- **`src/api/client.js`** - Axios instance with all API methods

### Configuration
- **`package.json`** - Dependencies and scripts
- **`vite.config.js`** - Vite configuration
- **`tailwind.config.js`** - Tailwind CSS customization
- **`postcss.config.js`** - PostCSS configuration
- **`index.html`** - HTML template
- **`Dockerfile`** - Docker image for frontend

---

## Configuration Files

### Root Level
- **`docker-compose.yml`** - Docker Compose configuration (backend, frontend, redis)
- **`README.md`** - Full project documentation
- **`SETUP.md`** - Setup and installation guide
- **`SUMMARY.md`** - Project summary and features

### Backend
- **`backend/.env.example`** - Backend environment variables template
- **`backend/.gitignore`** - Git ignore patterns

### Frontend
- **`frontend/.env.example`** - Frontend environment variables template
- **`frontend/.gitignore`** - Git ignore patterns

---

## Common Operations

### Search Implementation
1. User types in `SearchBar.jsx`
2. Calls `useSearch()` hook
3. Hook uses `searchRepos()` from `api/client.js`
4. Backend processes in `routers/search.py`
5. Uses `github_service.py` for API calls
6. Applies ranking via `ranking_service.py`
7. Caches with `cache_service.py`
8. Results displayed in `SearchResults.jsx`

### Analysis Flow
1. User clicks "Analyze" on `RepoCard.jsx`
2. Calls `analyzeRepo()` from `api/client.js`
3. Backend endpoint in `routers/analyze.py`
4. Gets repo data from `github_service.py`
5. Detects tech in `tech_detector.py`
6. Generates AI summary in `ai_service.py`
7. Results cached and displayed
8. User sees results with `TechBadges.jsx` and `AISummary.jsx`

### Chat Interaction
1. User types in `RepoChat.jsx`
2. Sends message via `chatWithRepo()` API
3. Backend processes in `routers/chat.py`
4. Uses `ai_service.py` to generate response
5. Response displayed in chat UI

---

## API Response Examples

### Search Response
```json
{
  "total": 50000,
  "results": [
    {
      "id": 123,
      "name": "react",
      "owner": "facebook",
      "stars": 200000,
      "rank_score": 95.5
    }
  ]
}
```

### Analysis Response
```json
{
  "technologies": ["React", "JavaScript"],
  "languages": {"JavaScript": 95000},
  "ai_summary": "React is...",
  "primary_language": "JavaScript"
}
```

### Chat Response
```json
{
  "message": "React is a...",
  "repo": "facebook/react"
}
```

---

## Environment Setup Checklist

- [ ] Set `GITHUB_TOKEN` in `backend/.env`
- [ ] Set `GEMINI_API_KEY` in `backend/.env`
- [ ] Set `VITE_API_BASE_URL` in `frontend/.env`
- [ ] Ensure Redis is running or use Docker Compose
- [ ] Install Python 3.11+
- [ ] Install Node.js 20+
- [ ] Run `pip install -r requirements.txt`
- [ ] Run `npm install` in frontend
- [ ] Start backend: `python -m uvicorn main:app --reload`
- [ ] Start frontend: `npm run dev`
- [ ] Open `http://localhost:5173`

---

## Debugging Tips

### Backend Issues
- Check FastAPI logs: Look at terminal running uvicorn
- Test endpoints: Visit `http://localhost:8000/docs`
- Check Redis: `redis-cli ping` should return PONG
- View config: Print `settings` in `config.py`

### Frontend Issues
- Check Console: Open DevTools (F12) → Console
- Check Network: DevTools → Network tab
- Check Vite: Ensure Vite server running on :5173
- Clear Cache: `npm cache clean --force` and reinstall

### API Issues
- Test with curl: `curl http://localhost:8000/api/search?q=test`
- Check headers: Ensure Content-Type is application/json
- Validate JSON: Use online JSON validator
- Check environment variables

---

## Performance Tips

1. **Caching** - All endpoints cache results (5-60 min TTL)
2. **Async** - All operations are async for speed
3. **Pagination** - Search results paginated (12 per page)
4. **Lazy Loading** - Frontend loads data on demand
5. **Error Handling** - Graceful fallbacks for all failures

---

## Security Checklist

- ✅ CORS restricted to localhost in dev
- ✅ GitHub token not exposed in frontend
- ✅ Gemini key not exposed in frontend
- ✅ Input validation with Pydantic
- ✅ Error messages don't leak internals
- ✅ Rate limiting via GitHub API token
- ✅ Environment variables in .env (not committed)

---

## File Size Guide

| File | Size | Lines |
|------|------|-------|
| main.py | ~4 KB | 50 |
| GitHub service | ~2 KB | 80 |
| AI service | ~3 KB | 90 |
| Tech detector | ~2 KB | 60 |
| App.jsx | ~2.5 KB | 70 |
| RepoCard.jsx | ~2.5 KB | 75 |
| SearchResults.jsx | ~2.5 KB | 75 |
| RepoChat.jsx | ~2 KB | 80 |

---

## Git Commit Message Examples

```
git add .
git commit -m "feat: add GitHub repository search with ranking"
git commit -m "feat: integrate Gemini API for AI summaries"
git commit -m "feat: implement React frontend with Tailwind"
git commit -m "fix: handle API errors gracefully"
git commit -m "docs: add setup instructions"
```

---

## Useful Commands

```bash
# Backend
python -m uvicorn main:app --reload
python -m uvicorn main:app --port 8001

# Frontend
npm run dev
npm run build
npm run preview

# Docker
docker-compose up --build
docker-compose down
docker-compose logs backend

# Testing
curl http://localhost:8000/health
curl "http://localhost:8000/api/search?q=react"

# Python
pip install -r requirements.txt
python -c "from config import settings; print(settings)"

# Node
npm install
npm list
```

---

## Documentation Links

- 📖 **README.md** - Full project documentation
- 📋 **SETUP.md** - Setup and troubleshooting guide
- 📊 **SUMMARY.md** - Feature summary and status
- 🗂️ **This file** - Quick reference guide
- 🔗 **http://localhost:8000/docs** - API docs (when running)

---

**Ready to build and deploy!** 🚀
