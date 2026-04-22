import os
import json
import requests
import time
from dotenv import load_dotenv

load_dotenv()

# Using OpenRouter (openrouter.ai) — reliable, no WAF blocking on CI runners
API_KEY = os.getenv("OPENROUTER_API_KEY")

# Free-tier models available on OpenRouter (in priority order)
MODELS = [
    "deepseek/deepseek-chat-v3-5:free",
    "deepseek/deepseek-r1:free",
    "meta-llama/llama-3.3-8b-instruct:free",
    "google/gemma-3-12b-it:free",
]

URL = "https://openrouter.ai/api/v1/chat/completions"


def ask_ai(system_prompt: str, user_prompt: str, json_mode=True, max_retries=3) -> dict | str | None:
    if not API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not set in environment variables.")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/hrohit12/ai-job-agent-portal",
        "X-Title": "AI Job Agent Portal",
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

        for attempt in range(max_retries):
            try:
                r = requests.post(URL, headers=headers, json=payload, timeout=60)
                
                # If we get a valid response
                if r.status_code == 200:
                    try:
                        data = r.json()
                        content = data["choices"][0]["message"]["content"]
                        
                        if json_mode:
                            try:
                                return json.loads(content)
                            except json.JSONDecodeError:
                                return content
                        return content
                    except Exception as e:
                        print(f"      ⚠️ Valid status code but body parsing failed: {e}")
                        print(f"      📄 Raw Response Snippet: {r.text[:500]}")
                        break # Try next model
                
                elif r.status_code == 429:
                    wait = 15 * (attempt + 1)
                    print(f"      ⏳ Rate limited (429). Waiting {wait}s...")
                    time.sleep(wait)
                    continue
                
                else:
                    print(f"      ⚠️ Model {model_name} returned error {r.status_code}")
                    print(f"      📄 Error Body: {r.text[:500]}")
                    break # Try next model
                    
            except Exception as e:
                print(f"      ❌ Connection error with {model_name}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(5)
                else:
                    break 
                    
    print("   🚫 All models failed on OpenRouter.")
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
