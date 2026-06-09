import google.generativeai as genai
import json
import re
import traceback
from config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
# Primary model and fallback model names
PRIMARY_MODEL_NAME = "gemini-2.5-flash"
FALLBACK_MODEL_NAME = "gemini-1.5-flash-8b"
model = genai.GenerativeModel(PRIMARY_MODEL_NAME)


async def _call_gemini(prompt: str, model_names=None, retries: int = 1, backoff_sec: float = 2.0):
    """Attempt to call Gemini model(s) with simple retry and fallback logic."""
    model_names = model_names or [PRIMARY_MODEL_NAME, FALLBACK_MODEL_NAME]
    last_exc = None
    for mname in model_names:
        try:
            mdl = genai.GenerativeModel(mname)
            response = mdl.generate_content(prompt)
            # Support both sync and coroutine response objects
            if hasattr(response, '__await__'):
                response = await response
            return response
        except Exception as e:
            last_exc = e
            print(f"Gemini call failed for model {mname}: {e}")
            # try retrying once for the same model
            try:
                import asyncio
                await asyncio.sleep(backoff_sec)
                mdl = genai.GenerativeModel(mname)
                response = mdl.generate_content(prompt)
                if hasattr(response, '__await__'):
                    response = await response
                return response
            except Exception as e2:
                last_exc = e2
                print(f"Retry failed for model {mname}: {e2}")
                continue
    # If all models failed, raise last exception
    raise last_exc


async def generate_summary(repo_name: str, description: str, readme: str, technologies: list) -> str:
    """Generate AI summary for a repository"""
    readme_snippet = readme[:3000] if readme else "No README available."
    prompt = f"""
You are a developer assistant. Analyze this GitHub repository and generate a concise 3-4 sentence summary.
Focus on: what the project does, who it's for, and what technologies make it interesting.

Repository: {repo_name}
Description: {description}
Technologies: {', '.join(technologies) if technologies else 'Unknown'}
README (excerpt): {readme_snippet}

Return ONLY the summary paragraph. No headings, no bullets.
"""
    try:
        response = await _call_gemini(prompt)
        print('AI Summary raw response:', response)
        summary_text = getattr(response, 'text', None) or getattr(response, 'output_text', None) or str(response)
        if not summary_text or not summary_text.strip():
            raise ValueError('Empty summary response from Gemini')
        return summary_text.strip()
    except Exception as e:
        print(f"AI Summary error: {e}")
        traceback.print_exc()
        # Fallback: construct a simple summary from available metadata
        try:
            language = technologies[0] if technologies else ''
            topics = ', '.join(technologies) if technologies else ''
            fallback = f"{repo_name} is a {language or 'project'} repository. Topics: {topics or 'None'}. {description or ''}"
            return fallback
        except Exception:
            return "Unable to generate summary for this repository."

async def classify_topics(repo_name: str, description: str, technologies: list, readme: str) -> list:
    """Classify repository into topics using AI"""
    prompt = f"""
Classify this GitHub repository into 1-3 categories from this list:
[Machine Learning, Computer Vision, Web Development, Cybersecurity, Blockchain, IoT,
Natural Language Processing, Data Engineering, DevOps, Mobile Development, Game Development,
Robotics, Cloud Computing, Database Systems, API Development, Artificial Intelligence]

Repository: {repo_name}
Description: {description}
Technologies: {', '.join(technologies) if technologies else 'Unknown'}
README: {readme[:1000]}

Return ONLY a JSON array of strings. Example: ["Machine Learning", "Computer Vision"]
"""
    try:
        response = model.generate_content(prompt)
        match = re.search(r'\[.*?\]', response.text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        print(f"Topic classification error: {e}")
    
    return ["General"]

async def chat_with_repo(
    repo_name: str,
    readme: str,
    conversation_history: list,
    user_message: str,
    repo_description: str = "",
    topics: list = None,
    primary_language: str = "",
    stars: int = 0,
    forks: int = 0
) -> str:
    """Chat about a repository using Gemini"""
    topics = topics or []
    history_text = "\n".join([f"{m.get('role', 'user').upper()}: {m.get('content', '')}" for m in conversation_history[-6:]])
    prompt = f"""
You are an expert developer assistant analyzing the GitHub repository: {repo_name}

If no README is available, answer based on the repo name, description, topics, and language provided.

Repository description:
{repo_description}

Topics:
{', '.join(topics) if topics else 'None'}

Primary language:
{primary_language or 'Unknown'}

Stars: {stars}
Forks: {forks}

README Context:
{readme[:4000] or 'No README available.'}

Conversation so far:
{history_text}

USER: {user_message}

Answer helpfully and concisely. Focus on technical accuracy.
"""
    try:
        response = await _call_gemini(prompt)
        print('Chat raw response:', response)
        chat_text = getattr(response, 'text', None) or getattr(response, 'output_text', None) or str(response)
        if not chat_text or not chat_text.strip():
            raise ValueError('Empty chat response from Gemini')
        return chat_text.strip()
    except Exception as e:
        print(f"Chat error: {e}")
        traceback.print_exc()
        # Fallback: respond using repo metadata
        try:
            meta = f"{repo_name}. Description: {repo_description or 'No description.'} Topics: {', '.join(topics) if topics else 'None'}. Primary language: {primary_language or 'Unknown'}. Stars: {stars}, Forks: {forks}."
            return f"I couldn't reach the AI service. Here's what I can tell you: {meta}"
        except Exception:
            return "I encountered an error processing your question. Please try again."

async def match_resume_to_projects(resume_text: str, repos: list) -> list:
    """Match resume to relevant projects using AI"""
    repo_summaries = "\n".join([
        f"- {r.get('name', '')}: {r.get('description', '')} | Tech: {', '.join(r.get('technologies', []))}"
        for r in repos[:20]
    ])
    prompt = f"""
Given this developer's resume skills and experience, recommend the top 5 most relevant GitHub projects.

RESUME:
{resume_text[:2000]}

AVAILABLE PROJECTS:
{repo_summaries}

Return a JSON array of project names (exactly as listed). Example: ["project-a", "project-b"]
"""
    try:
        response = model.generate_content(prompt)
        match = re.search(r'\[.*?\]', response.text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        print(f"Resume matching error: {e}")
    
    return []
