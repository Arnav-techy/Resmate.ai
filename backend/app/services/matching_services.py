from app.core.matching import resume_matchmaking

def get_matches(job_description: str,embedding: list, filenames: list)->list:
    matches=resume_matchmaking(job_description,embedding,filenames)

    return matches