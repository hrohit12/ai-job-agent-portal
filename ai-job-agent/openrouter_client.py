import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
# Free, strong, tool-capable model
MODEL = "deepseek/deepseek-chat-v3-0324:free"
# Alternatives: "meta-llama/llama-3.3-70b-instruct:free", "openai/gpt-oss-120b:free"

URL = "https://openrouter.ai/api/v1/chat/completions"


def ask_ai(system_prompt: str, user_prompt: str, json_mode=True) -> dict | str:
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not set in environment variables.")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/speedyapply/JobSpy",   # Identifying source
        "X-Title": "AI Job Agent",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.2,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    r = requests.post(URL, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    content = r.json()["choices"][0]["message"]["content"]
    return json.loads(content) if json_mode else content


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
    try:
        return ask_ai(system, user, json_mode=True)
    except Exception as e:
        print(f"AI error: {e}")
        return None
