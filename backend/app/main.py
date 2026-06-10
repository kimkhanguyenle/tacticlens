from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TacticLens API",
    description="AI-powered tactical match explainer — IBM June Innovation Challenge 2026",
    version="1.0.0"
)

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "project": "TacticLens",
        "status": "running",
        "message": "AI-powered tactical match explainer is live"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}