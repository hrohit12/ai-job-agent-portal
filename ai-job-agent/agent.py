import time
import pandas as pd
from jobspy import scrape_jobs
from openrouter_client import analyze_job
from sheet_client import get_existing_jobs, push_job

# === CONFIG: change this to whatever niche you curate ===
TARGET_NICHE = "Remote software engineering internships and entry-level tech jobs in India"
SEARCH_TERMS = ["software engineer intern", "python developer", "data analyst intern"]
LOCATION = "India"
RESULTS_PER_TERM = 15
# =========================================================


def dedupe_key(job: dict) -> str:
    title = str(job.get("title", "")).lower().strip()
    company = str(job.get("company", "")).lower().strip()
    return f"{title}|{company}"


def run_agent():
    print("🤖 AI Job Agent starting...")

    # 1) Load existing jobs to avoid duplicates
    try:
        existing = get_existing_jobs()
        seen = {dedupe_key(j) for j in existing}
        print(f"📋 {len(seen)} jobs found in sheet for deduplication.")
    except Exception as e:
        print(f"⚠️ Could not fetch existing jobs: {e}. Proceeding with potential duplicates.")
        seen = set()

    # 2) FETCH from multiple sources
    all_raw = []
    for term in SEARCH_TERMS:
        print(f"🔍 Searching: {term}")
        try:
            # JobSpy aggregates LinkedIn, Indeed, Google, etc.
            df = scrape_jobs(
                site_name=["indeed", "linkedin", "google"],
                search_term=term,
                location=LOCATION,
                results_wanted=RESULTS_PER_TERM,
                hours_old=72,            # last 3 days only
                country_indeed="India",
            )
            if not df.empty:
                all_raw.extend(df.to_dict("records"))
                print(f"  ✅ Found {len(df)} results for '{term}'")
            else:
                print(f"  ℹ️ No results found for '{term}'")
        except Exception as e:
            print(f"  ⚠️ Search for '{term}' failed: {e}")
        time.sleep(2)

    print(f"📥 Scraped {len(all_raw)} raw jobs total.")

    # 3) THINK + PUSH loop
    pushed = 0
    skipped_dup = 0
    skipped_irrelevant = 0
    
    for raw in all_raw:
        key = dedupe_key(raw)
        if key in seen:
            skipped_dup += 1
            continue
        
        seen.add(key) # Add to seen even if irrelevant to avoid re-analyzing in same run

        # Ask AI: relevant? + normalize
        print(f"🧠 Checking: {raw.get('title')} at {raw.get('company')}...")
        ai = analyze_job(raw, TARGET_NICHE)
        
        if not ai or not ai.get("relevant"):
            skipped_irrelevant += 1
            continue

        # Prepare final job object
        job = {
            **ai,
            "applyLink": raw.get("job_url") or raw.get("job_url_direct") or "",
        }

        if push_job(job):
            pushed += 1
            print(f"  🚀 PUSHED: {job['title']} @ {job['company']}")
        else:
            print(f"  ❌ FAILED to push: {job['title']}")

        time.sleep(1)  # be kind to APIs

    print("\n--- Execution Summary ---")
    print(f"✅ Pushed: {pushed}")
    print(f"⏭️ Skipped (Duplicates): {skipped_dup}")
    print(f"⏭️ Skipped (Irrelevant): {skipped_irrelevant}")
    print(f"🎉 Done.")


if __name__ == "__main__":
    run_agent()
