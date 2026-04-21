import os
import json
import requests
import time
from dotenv import load_dotenv

load_dotenv()

# We are now using Agent Router (agentrouter.org)
API_KEY = os.getenv("AGENTROUTER_API_KEY")
# Agent Router preferred model
MODEL = "deepseek-v3.2"

# IMPORTANT: For raw requests, we need the FULL endpoint, not just the base URL
URL = "https://agentrouter.org/v1/chat/completions"


def ask_ai(system_prompt: str, user_prompt: str, json_mode=True, max_retries=4) -> dict | str | None:
    if not API_KEY:
        raise ValueError("AGENTROUTER_API_KEY is not set in environment variables.")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.2,
    }
    
    # Enable JSON mode if requested
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    for attempt in range(max_retries):
        try:
            r = requests.post(URL, headers=headers, json=payload, timeout=60)
            
            if r.status_code == 429:
                # Rate limited → wait and retry (exponential backoff)
                wait = 15 * (attempt + 1)
                print(f"   ⏳ AgentRouter Rate limited (429). Waiting {wait}s (attempt {attempt+1}/{max_retries})...")
                time.sleep(wait)
                continue
                
            if r.status_code != 200:
                print(f"   ⚠️ AgentRouter Error {r.status_code}: {r.text}")
                # Some models don't support JSON mode, try without it if it's a 4xx error related to format
                if json_mode and r.status_code == 400 and "response_format" in r.text:
                    print("   ℹ️ Model doesn't support JSON mode, retrying without it...")
                    return ask_ai(system_prompt, user_prompt, json_mode=False, max_retries=1)
                r.raise_for_status()
                
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            
            if json_mode:
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    # If JSON mode failed to return actual JSON, return raw for backup
                    print("   ⚠️ AI returned non-JSON content in JSON mode.")
                    return content
            return content
            
        except Exception as e:
            if attempt == max_retries - 1:
                print(f"   ❌ AI call failed after {max_retries} attempts: {e}")
                return None
            time.sleep(5)
            
    return None


def analyze_job(raw_job: dict, target_niche: str) -> dict | None:
    """
    Uses the LLM to:
      1. Decide if job matches our niche
      2. Extract & clean the fields our sheet expects
    Returns None if not relevant.
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
