import os
import json
import requests
import time
from dotenv import load_dotenv

load_dotenv()

# We are now using Agent Router (agentrouter.org)
API_KEY = os.getenv("AGENTROUTER_API_KEY")

# PRIORITY MODELS: If the first one fails/is busy, it tries the next
MODELS = [
    "deepseek-v3.2",
    "deepseek-v3.1",
    "deepseek-r1-0528",
    "google/gemini-2.0-flash-exp:free" # Backup if AgentRouter models act up
]

URL = "https://agentrouter.org/v1/chat/completions"


def ask_ai(system_prompt: str, user_prompt: str, json_mode=True, max_retries=3) -> dict | str | None:
    if not API_KEY:
        raise ValueError("AGENTROUTER_API_KEY is not set in environment variables.")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    
    # Try each model in the priority list
    for model_name in MODELS:
        print(f"   🤖 Trying model: {model_name}...")
        
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.2,
        }
        
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        # Retry logic for the specific model (e.g. for 429 errors)
        for attempt in range(max_retries):
            try:
                r = requests.post(URL, headers=headers, json=payload, timeout=60)
                
                if r.status_code == 429:
                    wait = 15 * (attempt + 1)
                    print(f"      ⏳ Rate limited (429). Waiting {wait}s (attempt {attempt+1}/{max_retries})...")
                    time.sleep(wait)
                    continue
                    
                if r.status_code != 200:
                    # If it's a 404 (Model not found) or 500 (Server error), try the NEXT model
                    print(f"      ⚠️ Model {model_name} failed (Status {r.status_code}). Switching fallback...")
                    break 
                    
                data = r.json()
                content = data["choices"][0]["message"]["content"]
                
                if json_mode:
                    try:
                        return json.loads(content)
                    except json.JSONDecodeError:
                        return content
                return content
                
            except Exception as e:
                print(f"      ❌ Connection error with {model_name}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(5)
                else:
                    break # Try next model
                    
    print("   🚫 All models in the fallback list failed.")
    return None


def analyze_job(raw_job: dict, target_niche: str) -> dict | None:
    """
    Uses the LLM to:
      1. Decide if job matches our niche
      2. Extract & clean the fields our sheet expects
    """
    system = (
        "You are a job-posting filter and normalizer. "
        "Return ONLY valid JSON. "
        "If the job is NOT a good match for the target niche, return "
        '{"relevant": false}. '
        "If it IS relevant, return: "
        '{"relevant": true, "title": str, "company": str, "location": str, '
        '"type": "Full-time|Part-time|Internship|Contract", '
        '"salary": str, "experience": str, "skills": [str, str, ...], '
        '"description": str (max 500 chars, clean summary)}'
    )
    user = (
        f"Target niche: {target_niche}\n\n"
        f"Raw job data:\n{json.dumps(raw_job, default=str)[:3000]}"
    )
    return ask_ai(system, user, json_mode=True)
