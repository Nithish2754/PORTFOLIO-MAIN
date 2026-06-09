from fastapi import APIRouter
from pydantic import BaseModel
from services.similarity_service import get_similar_repos
from services.cache_service import get_cache, set_cache

router = APIRouter()

class RecommendRequest(BaseModel):
    target_repo: dict
    available_repos: list
    top_n: int = 5

@router.post("/recommend")
async def recommend_similar(req: RecommendRequest):
    """
    Get recommendations for similar repositories.
    
    Request body:
    - target_repo: Repository object to match against
    - available_repos: List of repositories to search
    - top_n: Number of recommendations (default: 5)
    """
    try:
        cache_key = f"recommend:{req.target_repo.get('name', '')}:{len(req.available_repos)}"
        cached = await get_cache(cache_key)
        if cached:
            return cached

        similar = get_similar_repos(req.target_repo, req.available_repos, req.top_n)
        
        result = {
            "target": req.target_repo.get("name", ""),
            "recommendations": similar,
            "count": len(similar)
        }
        await set_cache(cache_key, result, ttl=600)
        return result
    except Exception as e:
        return {"error": str(e), "recommendations": []}
