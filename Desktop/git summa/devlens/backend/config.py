import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # GitHub API
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    
    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/devlens")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # App
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    class Config:
        env_file = ".env"

settings = Settings()
