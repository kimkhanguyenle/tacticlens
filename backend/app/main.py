from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analyze import router as analyze_router
from app.routes.upload import router as upload_router   

app = FastAPI(
    title="TacticLens API",
    description="AI-powered tactical match explainer — IBM June Innovation Challenge 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")
app.include_router(upload_router, prefix="/api")

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