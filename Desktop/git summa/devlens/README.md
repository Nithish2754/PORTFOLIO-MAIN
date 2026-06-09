# DevLens — GitHub Repository Search & AI Analysis Engine

A full-stack web application that allows developers to search public GitHub repositories, automatically detect technologies, generate AI summaries, classify topics, rank projects, and get smart recommendations — all in one intelligent dashboard.

## 🎯 Features

- **🔍 Smart Repository Search** — Search GitHub with intelligent ranking by stars, forks, and activity
- **✨ AI-Powered Analysis** — Automatic technology detection, summaries, and topic classification using Google Gemini
- **🎯 Intelligent Recommendations** — Find similar repositories using semantic similarity
- **💬 Repository Chatbot** — Ask questions about repositories and get expert answers
- **📄 Resume Matching** — Upload your resume and find relevant projects
- **⚡ Fast Caching** — Redis caching for optimal performance
- **📱 Responsive UI** — Modern React + Tailwind CSS interface

## 🛠 Technology Stack

### Backend
- **Python 3.11+** with **FastAPI**
- **httpx** — Async HTTP client
- **Redis** — Caching layer
- **Google Gemini API** — AI analysis
- **sentence-transformers** — Semantic search
- **Motor** — Async MongoDB driver

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** — Styling
- **React Query** — Data fetching
- **Zustand** — State management
- **Lucide Icons** — UI icons
- **Framer Motion** — Animations

### Infrastructure
- **Docker & Docker Compose** — Containerization
- **MongoDB Atlas** — Repository storage
- **Redis Upstash** — Cache service

## 📦 Project Structure

```
devlens/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── config.py                # Configuration management
│   ├── routers/                 # API endpoints
│   │   ├── search.py            # Repository search
│   │   ├── analyze.py           # Repository analysis
│   │   ├── chat.py              # Chat endpoint
│   │   ├── recommend.py         # Recommendations
│   │   └── resume.py            # Resume matching
│   ├── services/                # Business logic
│   │   ├── github_service.py    # GitHub API calls
│   │   ├── ai_service.py        # Gemini AI calls
│   │   ├── tech_detector.py     # Technology detection
│   │   ├── similarity_service.py # Semantic matching
│   │   ├── ranking_service.py   # Ranking algorithm
│   │   └── cache_service.py     # Redis caching
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── store/              # Zustand store
│   │   ├── api/                # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- GitHub Personal Access Token ([Get one](https://github.com/settings/tokens))
- Google Gemini API Key ([Get one](https://ai.google.dev/))

### 1. Clone Repository
```bash
git clone <your-repo>
cd devlens
```

### 2. Set Up Environment Variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and add:
# - GITHUB_TOKEN
# - GEMINI_API_KEY
# - MONGODB_URI (optional, for persistence)
# - REDIS_URL (default: redis://localhost:6379)

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Local Development (Without Docker)

#### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

#### Redis (new terminal)
```bash
docker run -p 6379:6379 redis:7-alpine
```

#### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

### 4. Docker Compose (All-in-One)
```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📖 API Endpoints

### Search Repositories
```http
GET /api/search?q=react&language=JavaScript&sort=stars&page=1
```

**Response:**
```json
{
  "total": 50000,
  "results": [
    {
      "id": 123,
      "name": "react",
      "owner": "facebook",
      "description": "...",
      "stars": 200000,
      "rank_score": 95.5
    }
  ]
}
```

### Analyze Repository
```http
POST /api/analyze
Content-Type: application/json

{
  "owner": "facebook",
  "repo": "react",
  "description": "A JavaScript library for building user interfaces"
}
```

**Response:**
```json
{
  "technologies": ["React", "JavaScript", "Node.js"],
  "languages": {"JavaScript": 95000},
  "ai_summary": "React is a JavaScript library for building dynamic user interfaces with component-based architecture...",
  "primary_language": "JavaScript"
}
```

### Chat About Repository
```http
POST /api/chat
Content-Type: application/json

{
  "owner": "facebook",
  "repo": "react",
  "readme": "...",
  "message": "What is this project?",
  "conversation_history": []
}
```

### Get Recommendations
```http
POST /api/recommend
Content-Type: application/json

{
  "target_repo": {...},
  "available_repos": [...],
  "top_n": 5
}
```

## 🔑 Key Features Explained

### 1. Ranking Algorithm
```
Rank Score = 0.4 × log(stars+1) + 0.3 × log(forks+1) + 0.3 × activity_score

Activity Score = max(0, 100 - days_old × 0.5)
```
Balances popularity, community engagement, and recency.

### 2. Technology Detection
Parses dependency files:
- `requirements.txt` (Python)
- `package.json` (Node.js)
- `pom.xml` (Java)

Plus README keyword matching for DevOps tools and infrastructure.

### 3. Semantic Similarity
Uses `sentence-transformers` with all-MiniLM-L6-v2 model to find semantically similar projects.

### 4. Caching Strategy
- Search results: 5-minute cache
- Analysis data: 1-hour cache
- Recommendations: 10-minute cache

## 🎓 Build Phases

### Phase 1: Backend Foundation ✅
1. FastAPI project structure
2. GitHub API service
3. Redis caching
4. Ranking service
5. `/api/search` endpoint

### Phase 2: AI Analysis ✅
6. Gemini API integration
7. Technology detector
8. Topic classification
9. `/api/analyze` endpoint

### Phase 3: Smart Features ✅
10. Sentence transformer similarity
11. `/api/recommend` endpoint
12. `/api/chat` endpoint
13. `/api/resume-match` endpoint

### Phase 4: Frontend ✅
14. React + Vite + Tailwind setup
15. Search components
16. Repository cards with analysis
17. Chat interface
18. Resume matcher

### Phase 5: Polish & Deployment ✅
19. Docker Compose setup
20. Error boundaries & loading states
21. README with documentation

## 🚢 Deployment

### Deploy to Azure Container Instances
```bash
# Build images
docker build -t devlens-backend backend/
docker build -t devlens-frontend frontend/

# Push to registry
docker tag devlens-backend <registry>/devlens-backend:latest
docker push <registry>/devlens-backend:latest

# Deploy with Docker Compose to ACI
docker context create aci <context-name>
docker compose up
```

### Environment Variables for Production
```env
GITHUB_TOKEN=<your-token>
GEMINI_API_KEY=<your-key>
MONGODB_URI=<atlas-connection-string>
REDIS_URL=<upstash-redis-url>
DEBUG=False
```

## 🔒 Security Considerations

- ✅ CORS restricted to frontend origin
- ✅ Rate limiting via GitHub API token
- ✅ API key validation
- ✅ Input sanitization
- ✅ Error handling without exposing internals

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.11+

# Check dependencies
pip install -r requirements.txt

# Verify Redis connection
redis-cli ping
```

### Frontend won't load
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS errors
Ensure backend is running on :8000 and frontend environment has:
```
VITE_API_BASE_URL=http://localhost:8000
```

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review API docs at `/docs` endpoint

---

**Built with ❤️ using FastAPI, React, and Google Gemini API**

DevLens — Discover. Analyze. Recommend. 🚀
