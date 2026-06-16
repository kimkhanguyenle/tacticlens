import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

TACTICAL_PROMPT = """Analyze this football match report and return ONLY a JSON object. Be concise — keep all text values under 20 words each.

Return exactly this structure:
{{
  "match_summary": "one sentence summary",
  "team_a": {{
    "name": "team name",
    "formation": "formation",
    "style": "brief style description",
    "key_moments": ["moment 1", "moment 2"]
  }},
  "team_b": {{
    "name": "team name",
    "formation": "formation",
    "style": "brief style description",
    "key_moments": ["moment 1", "moment 2"]
  }},
  "tactical_shifts": [
    {{
      "minute": "65'",
      "team": "team name",
      "change": "what changed",
      "impact": "why it mattered"
    }}
  ],
  "momentum_periods": [
    {{
      "period": "1-45 mins",
      "dominant_team": "team name",
      "reason": "brief reason"
    }},
    {{
      "period": "46-90 mins",
      "dominant_team": "team name",
      "reason": "brief reason"
    }}
  ],
  "fan_explainer": "two sentence simple explanation for non-football fans"
}}

Match Report: {match_report}"""

def clean_json(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```[a-zA-Z]*\n?", "", raw)
        raw = re.sub(r"```$", "", raw)
    raw = raw.strip()
    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if match:
        raw = match.group()
    return raw

def analyze_match(match_report: str) -> dict:
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert football tactical analyst. Respond with valid JSON only. Write detailed, insightful field values of 1-2 sentences each. Never write less than 8 words per field value."
                },
                {
                    "role": "user",
                    "content": TACTICAL_PROMPT.format(match_report=match_report)
                }
            ],
            temperature=0.1,
            max_tokens=3000
        )

        raw = response.choices[0].message.content
        cleaned = clean_json(raw)
        return {"success": True, "data": json.loads(cleaned)}

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"JSON parse error: {str(e)}",
            "raw_response": raw[:500]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}