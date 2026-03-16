import pdfplumber
import io
def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from PDF bytes (never touches disk).
    file_bytes: raw PDF content read from upload.
    """
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        text = " ".join([page.extract_text() or "" for page in pdf.pages])
    
    # Clean up whitespace and newlines for better embeddings
    text = " ".join(text.split())
    return text.strip()

def extract_text_from_pdfs(files: dict) -> dict:
    """
    Extract text from multiple PDFs.
    files: dict of {filename: bytes}
    Returns: dict of {filename: text}
    """
    
    results = {}
    for filename,file_bytes in files.items():
        results[filename]=extract_text_from_pdfs(file_bytes)

    return results


