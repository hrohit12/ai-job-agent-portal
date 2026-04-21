import os
import uuid
import requests
import json
from dotenv import load_dotenv

load_dotenv()

APPS_SCRIPT_URL = os.getenv("APPS_SCRIPT_URL")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


def get_existing_jobs() -> list[dict]:
    """Read current sheet via your doGet endpoint — used for dedupe."""
    if not APPS_SCRIPT_URL:
        return []
    
    try:
        # The Apps Script expectation is a GET with action parameter or default
        params = {"action": "getJobs"}
        r = requests.get(APPS_SCRIPT_URL, params=params, timeout=30)
        r.raise_for_status()
        data = r.json()
        return data.get("data", [])
    except Exception as e:
        print(f"Error fetching existing jobs: {e}")
        return []


def push_job(job: dict) -> bool:
    """POST a single job to your Apps Script doPost."""
    if not APPS_SCRIPT_URL:
        return False

    payload = {
        "action": "postJob", # Crucial for existing Code.gs
        "adminEmail": ADMIN_EMAIL,
        "adminPassword": ADMIN_PASSWORD,
        "id": job.get("id") or str(uuid.uuid4())[:8],
        "title": job["title"],
        "company": job["company"],
        "location": job["location"],
        "type": job["type"],
        "salary": job.get("salary", "Not disclosed"),
        "experience": job.get("experience", "Not specified"),
        "skills": job.get("skills", []),
        "description": job.get("description", ""),
        "applyLink": job["applyLink"],
    }
    
    try:
        # Use text/plain as the Apps Script expects JSON in the body
        headers = {"Content-Type": "text/plain"}
        r = requests.post(APPS_SCRIPT_URL, data=json.dumps(payload), headers=headers, timeout=30)
        
        # Log the response for debugging if needed
        # print(f"Push Response: {r.text}")
        
        result = r.json()
        return result.get("success", False)
    except Exception as e:
        print(f"Error pushing job: {e}")
        return False
