from fastapi import APIRouter
from datetime import datetime, timedelta
import httpx
from config import settings

router = APIRouter()

@router.get("/trending")
async def get_trending():
    """Return top 10 trending repositories created in the last 7 days, sorted by stars."""
    last_week = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")
    query = f"created:>{last_week}"
    url = "https://api.github.com/search/repositories"
    params = {"q": query, "sort": "stars", "per_page": 10}
    headers = {
        "Authorization": f"token {settings.GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params, headers=headers, timeout=15.0)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            simplified = [
                {
                    "id": it.get("id"),
                    "name": it.get("name"),
                    "full_name": it.get("full_name"),
                    "owner": it.get("owner", {}).get("login"),
                    "description": it.get("description"),
                    "stars": it.get("stargazers_count", 0),
                    "forks": it.get("forks_count", 0),
                    "language": it.get("language"),
                    "topics": it.get("topics", []),
                    "url": it.get("html_url")
                }
                for it in items
            ]
            return {"results": simplified}
        return {"results": []}
