from sentence_transformers import SentenceTransformer
import numpy as np

model= SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str)->np.ndarray:
    """Generate embedding from single text."""
    return model.encode(text)

def get_embeddings(texts: list[str])->np.ndarray:
    """Generate embeddings from multiple texts."""
    return model.encode(texts)