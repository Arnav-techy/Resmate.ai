import requests

# Simulate embeddings already stored in browser
# First get them
with open("Arnavs_Resume.pdf", "rb") as f:
    upload_response = requests.post(
        "http://127.0.0.1:8000/api/v1/upload",
        files={"files": ("Arnavs_Resume.pdf", f, "application/pdf")}
    )

data = upload_response.json()

# Now test matching
match_response = requests.post(
    "http://127.0.0.1:8000/api/v1/match",
    json={
        "job_description": "Looking for a Python developer with machine learning and data science experience",
        "embeddings": data["embeddings"],
        "filenames": data["filenames"]
    }
)

print(match_response.status_code)
print(match_response.text)