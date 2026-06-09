import httpx
import base64
from config import settings

GITHUB_BASE = "https://api.github.com"
HEADERS = {
    "Authorization": f"token {settings.GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

async def search_repositories(query: str, language: str = None, sort: str = "stars", page: int = 1):
    """Search GitHub repositories"""
    q = query
    if language:
        q += f" language:{language}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_BASE}/search/repositories",
            params={"q": q, "sort": sort, "per_page": 12, "page": page},
            headers=HEADERS,
            timeout=10.0
        )
        return response.json()

async def get_repo_readme(owner: str, repo: str) -> str:
    """Fetch repository README content"""
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{GITHUB_BASE}/repos/{owner}/{repo}/readme",
                headers=HEADERS,
                timeout=10.0
            )
            if r.status_code == 200:
                content = r.json().get("content", "")
                return base64.b64decode(content).decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"GitHub README fetch error for {owner}/{repo}: {e}")
    return ""

async def get_repo_files(owner: str, repo: str) -> list:
    """Fetch repository file list"""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{GITHUB_BASE}/repos/{owner}/{repo}/contents",
            headers=HEADERS,
            timeout=10.0
        )
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, list):
                return [f["name"] for f in data]
    return []

async def get_repo_languages(owner: str, repo: str) -> dict:
    """Fetch repository languages"""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{GITHUB_BASE}/repos/{owner}/{repo}/languages",
            headers=HEADERS,
            timeout=10.0
        )
        if r.status_code == 200:
            return r.json()
    return {}

async def get_repo_info(owner: str, repo: str) -> dict:
    """Fetch repository metadata including description, topics, language, stars, and forks."""
    try:
        headers = {**HEADERS, "Accept": "application/vnd.github.mercy-preview+json"}
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{GITHUB_BASE}/repos/{owner}/{repo}",
                headers=headers,
                timeout=10.0
            )
            if r.status_code == 200:
                data = r.json()
                return {
                    "description": data.get("description", "") or "",
                    "topics": data.get("topics", []) or [],
                    "primary_language": data.get("language", "") or "",
                    "stargazers_count": data.get("stargazers_count", 0) or 0,
                    "forks_count": data.get("forks_count", 0) or 0,
                }
    except Exception as e:
        print(f"GitHub repo info fetch error for {owner}/{repo}: {e}")
    return {
        "description": "",
        "topics": [],
        "primary_language": "",
        "stargazers_count": 0,
        "forks_count": 0,
    }

async def get_file_content(owner: str, repo: str, filename: str) -> str:
    """Fetch specific file content from repository"""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{GITHUB_BASE}/repos/{owner}/{repo}/contents/{filename}",
            headers=HEADERS,
            timeout=10.0
        )
        if r.status_code == 200:
            content = r.json().get("content", "")
            return base64.b64decode(content).decode("utf-8", errors="ignore")
    return ""
