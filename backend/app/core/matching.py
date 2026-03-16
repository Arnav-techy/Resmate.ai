import numpy as np
from app.core.embedding import get_embedding


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""

    a = np.array(a)
    b = np.array(b)

    denom = (np.linalg.norm(a) * np.linalg.norm(b))

    if denom == 0:
        return 0.0

    return float(np.dot(a, b) / denom)


def resume_matchmaking(job_description: str, resume_embeddings: list, filenames: list) -> list:
    """Match job descriptions and your resumes.
    Returns top 3 resumes suitable for the job role."""

    jd_embedding = np.array(get_embedding(job_description))

    results = []

    for i, resume_embedding in enumerate(resume_embeddings):

        score = max(0, cosine_similarity(jd_embedding, np.array(resume_embedding)))

        results.append({
            "filename": filenames[i],
            "score": round(score, 3),
            "confidence": get_confidence(score)
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return results[:3]


def get_confidence(x: float) -> str:
    if x > 0.85:
        return "High"
    elif 0.85 > x >= 0.7:
        return "Medium"
    else:
        return "Low"