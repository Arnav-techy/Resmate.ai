import pdfplumber
import numpy as np
from sentence_transformers import SentenceTransformer

model=SentenceTransformer("all-MiniLM-L6-v2")

with pdfplumber.open("Arnavs_Resume.pdf") as pdf:
    text=" ".join([page.extract_text() or "" for page in pdf.pages])

# Test 1 - should be HIGH (paste something that matches what's actually in your resume)
jd_match = "Looking for a student with machine learning projects, Python, and data science experience"

# Test 2 - should be LOW (completely unrelated)
jd_nomatch = "Graphic designer with 3 years of Photoshop, Illustrator and brand identity experience"
embedding= model.encode(text)



def cosine_similarity(a,b):
    return np.dot(a,b) / (np.linalg.norm(a)*np.linalg.norm(b))

score1 = cosine_similarity(embedding, model.encode(jd_match))
score2 = cosine_similarity(embedding, model.encode(jd_nomatch))
print(f"Text Length:{len(text)} chars")
print(f"embedding shape: {embedding.shape}")
print(f"First 5 embedding: {embedding[:5]}")
print(f"Matching JD score:   {score1:.3f}")
print(f"Unrelated JD score:  {score2:.3f}")