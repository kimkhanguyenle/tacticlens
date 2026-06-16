from fastapi import APIRouter
from pydantic import BaseModel
from app.groq_service import analyze_match

router = APIRouter()

class MatchRequest(BaseModel):
    match_report: str

@router.post("/analyze")
def analyze(request: MatchRequest):
    if len(request.match_report.strip()) < 50:
        return {"success": False, "error": "Match report is too short. Please provide more detail."}
    
    result = analyze_match(request.match_report)
    return result