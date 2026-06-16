from fastapi import APIRouter, UploadFile, File
from docling.document_converter import DocumentConverter
import tempfile
import os

router = APIRouter()
converter = DocumentConverter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"success": False, "error": "Only PDF files are accepted"}

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        result = converter.convert(tmp_path)
        extracted_text = result.document.export_to_markdown()

        os.unlink(tmp_path)

        if not extracted_text.strip():
            return {"success": False, "error": "Could not extract text from PDF"}

        return {
            "success": True,
            "extracted_text": extracted_text,
            "char_count": len(extracted_text)
        }

    except Exception as e:
        return {"success": False, "error": str(e)}