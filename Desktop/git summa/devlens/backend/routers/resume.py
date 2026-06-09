from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel
from services.ai_service import match_resume_to_projects
import PyPDF2
import io

router = APIRouter()

class ResumeMatchRequest(BaseModel):
    resume_text: str
    repos: list

@router.post("/resume-match")
async def resume_match(req: ResumeMatchRequest):
    """
    Match resume to relevant GitHub projects.
    
    Request body:
    - resume_text: Resume content as text
    - repos: List of repository objects
    """
    try:
        matches = await match_resume_to_projects(req.resume_text, req.repos)
        return {
            "matches": matches,
            "count": len(matches)
        }
    except Exception as e:
        return {"error": str(e), "matches": []}

@router.post("/resume-upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and extract text from a PDF resume.
    
    Returns extracted text from the PDF.
    """
    try:
        contents = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        return {
            "text": text,
            "pages": len(pdf_reader.pages)
        }
    except Exception as e:
        return {"error": str(e), "text": ""}
