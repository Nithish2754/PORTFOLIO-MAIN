from fastapi import APIRouter, Query
from services.github_service import search_repositories
from services.ranking_service import calculate_rank_score
from services.cache_service import get_cache, set_cache

router = APIRouter()

@router.get("/search")
async def search_repos(
    q: str = Query(..., min_length=1),
    language: str = Query(None),
    sort: str = Query("stars"),
    page: int = Query(1)
):
    """
    Search GitHub repositories with ranking and caching.
    
    Query params:
    - q: Search query (required)
    - language: Programming language filter (optional)
    - sort: Sort by 'stars', 'forks', or 'updated' (default: stars)
    - page: Page number (default: 1)
    """
    cache_key = f"search:{q}:{language}:{sort}:{page}"
    cached = await get_cache(cache_key)
    if cached:
        return cached

    try:
        data = await search_repositories(q, language, sort, page)
        items = data.get("items", [])

        results = []
        for item in items:
            score = calculate_rank_score(
                item.get("stargazers_count", 0),
                item.get("forks_count", 0),
                item.get("updated_at", "2020-01-01T00:00:00Z")
            )
            results.append({
                "id": item["id"],
                "name": item["name"],
                "full_name": item["full_name"],
                "owner": item["owner"]["login"],
                "description": item.get("description", ""),
                "stars": item.get("stargazers_count", 0),
                "forks": item.get("forks_count", 0),
                "language": item.get("language", "Unknown"),
                "topics": item.get("topics", []),
                "url": item["html_url"],
                "updated_at": item.get("updated_at", ""),
                "rank_score": score
            })

        results.sort(key=lambda x: x["rank_score"], reverse=True)
        response = {
            "total": data.get("total_count", 0),
            "results": results,
            "page": page,
            "query": q
        }
        await set_cache(cache_key, response, ttl=300)
        return response
    except Exception as e:
        return {"error": str(e), "results": []}
