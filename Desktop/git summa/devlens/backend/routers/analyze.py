from fastapi import APIRouter
from pydantic import BaseModel
from services.github_service import get_repo_readme, get_repo_files, get_repo_languages, get_repo_info
from services.tech_detector import detect_technologies
from services.cache_service import get_cache, set_cache
from services.ai_service import generate_summary, classify_topics

router = APIRouter()

class AnalyzeRequest(BaseModel):
    owner: str
    repo: str
    description: str = ""

@router.post("/analyze")
async def analyze_repo(req: AnalyzeRequest):
    """
    Analyze a GitHub repository for technologies, languages, and metadata.
    
    Request body:
    - owner: Repository owner username
    - repo: Repository name
    - description: (optional) Repository description
    """
    cache_key = f"analyze:{req.owner}:{req.repo}"
    cached = await get_cache(cache_key)
    if cached:
        return cached

    try:
        readme = (await get_repo_readme(req.owner, req.repo)) or ""
        files = (await get_repo_files(req.owner, req.repo)) or []
        languages = (await get_repo_languages(req.owner, req.repo)) or {}
        repo_info = (await get_repo_info(req.owner, req.repo)) or {}
        topics = repo_info.get("topics", []) or []
        technologies = (await detect_technologies(req.owner, req.repo, files, readme, topics, languages)) or []

        if not readme and not technologies:
            result = {
                "owner": req.owner,
                "repo": req.repo,
                "technologies": [],
                "languages": languages,
                "ai_summary": "No README or technology information available for this repository.",
                "ai_topics": ["General"],
                "readme_preview": "",
                "files": files,
                "has_requirements": "requirements.txt" in files,
                "has_package_json": "package.json" in files,
                "file_count": len(files),
                "primary_language": max(languages.items(), key=lambda x: x[1])[0] if languages else "Unknown"
            }
            await set_cache(cache_key, result, ttl=3600)
            return result

        ai_summary = await generate_summary(
            f"{req.owner}/{req.repo}",
            req.description,
            readme,
            technologies
        )
        ai_topics = await classify_topics(
            f"{req.owner}/{req.repo}",
            req.description,
            technologies,
            readme
        )

        result = {
            "owner": req.owner,
            "repo": req.repo,
            "technologies": technologies,
            "languages": languages,
            "ai_summary": ai_summary,
            "ai_topics": ai_topics,
            "readme_preview": readme[:500],
            "files": files,
            "has_requirements": "requirements.txt" in files,
            "has_package_json": "package.json" in files,
            "file_count": len(files),
            "primary_language": max(languages.items(), key=lambda x: x[1])[0] if languages else "Unknown"
        }
        await set_cache(cache_key, result, ttl=3600)
        return result
    except Exception as e:
        return {
            "error": str(e),
            "owner": req.owner,
            "repo": req.repo,
            "technologies": [],
            "languages": {},
            "ai_summary": "No README or technology information available for this repository.",
            "ai_topics": ["General"],
            "readme_preview": ""
        }
