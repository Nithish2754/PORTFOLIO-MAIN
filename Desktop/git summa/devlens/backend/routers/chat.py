import traceback

from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import chat_with_repo
from services.github_service import get_repo_readme, get_repo_info

router = APIRouter()

class ChatRequest(BaseModel):
    owner: str
    repo: str
    readme: str = ""
    message: str
    conversation_history: list = []

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    """
    Chat about a repository.
    
    Request body:
    - owner: Repository owner
    - repo: Repository name
    - readme: Repository README content
    - message: User message
    - conversation_history: (optional) Previous messages in format [{"role": "user"/"assistant", "content": "..."}]
    """
    try:
        if not req.owner or not req.repo:
            return {
                "message": "Repository owner and name are required.",
                "repo": ""
            }

        try:
            readme = await get_repo_readme(req.owner, req.repo)
        except Exception as e:
            print(f"README fetch error for {req.owner}/{req.repo}: {e}")
            traceback.print_exc()
            readme = ""

        if not readme:
            readme = req.readme or ""

        try:
            repo_info = await get_repo_info(req.owner, req.repo)
        except Exception as e:
            print(f"Repo info fetch error for {req.owner}/{req.repo}: {e}")
            traceback.print_exc()
            repo_info = {}

        response = await chat_with_repo(
            f"{req.owner}/{req.repo}",
            readme,
            req.conversation_history,
            req.message,
            repo_info.get("description", ""),
            repo_info.get("topics", []),
            repo_info.get("primary_language", ""),
            repo_info.get("stargazers_count", 0),
            repo_info.get("forks_count", 0)
        )
        return {
            "message": response,
            "repo": f"{req.owner}/{req.repo}"
        }
    except Exception as e:
        traceback.print_exc()
        error_message = str(e) or "AI service temporarily unavailable. Please try again in a moment."
        if "rate limit" in error_message.lower() or "429" in error_message or "timeout" in error_message.lower():
            return {
                "message": "AI service temporarily unavailable. Please try again in a moment.",
                "repo": f"{req.owner}/{req.repo}"
            }
        return {
            "message": "I encountered an error processing your question. Please try again.",
            "repo": f"{req.owner}/{req.repo}"
        }
