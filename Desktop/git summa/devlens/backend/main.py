from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import search, analyze, recommend, chat, resume, trending

app = FastAPI(title="DevLens API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(search.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(recommend.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(resume.router, prefix="/api")
app.include_router(trending.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "DevLens API running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    from config import settings
    
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
