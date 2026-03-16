from fastapi import APIRouter, UploadFile, File
from typing import List
from app.services.resume_services import process_resume
from app.core.matching import resume_matchmaking

router = APIRouter()

@router.post("/upload")
async def upload_resumes(files: List[UploadFile] = File(...)):
    pdf_files = {}
    for file in files:
        pdf_files[file.filename] = await file.read()
    
    embeddings = process_resume(pdf_files)
    return {
        "filenames": list(embeddings.keys()),
        "embeddings": list(embeddings.values())
    }

@router.post("/match")
async def match_job(data: dict):
    matches = resume_matchmaking(
        job_description=data["job_description"],
        resume_embeddings=data["embeddings"],
        filenames=data["filenames"]
    )
    return {"matches": matches}

@router.get("/health")
async def health():
    return {"status": "healthy"}