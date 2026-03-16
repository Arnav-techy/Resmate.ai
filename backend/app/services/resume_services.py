from app.core.parser import extract_text_from_pdf
from app.core.embedding import get_embedding

def process_resume(files: dict) -> dict:

    """
    Takes uploaded PDF files, extracts text, generates embeddings.
    files: dict of {filename: bytes}
    Returns: dict of {filename: embedding}
    """

    
    results={}
    for filename, file_bytes in files.items():
        text=extract_text_from_pdf(file_bytes)

        embedding=get_embedding(text)

        results[filename]=embedding.tolist()

    
    return results