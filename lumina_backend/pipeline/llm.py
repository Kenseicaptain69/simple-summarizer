import re
import httpx
from typing import List, Tuple
from core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"


def _call_groq(messages: list, max_tokens: int = 1024) -> str:
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not set.")
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": max_tokens,
    }
    with httpx.Client(timeout=30) as client:
        r = client.post(GROQ_URL, headers=headers, json=body)
        r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"].strip()


def summarize(transcript: str) -> str:
    """Summarize the transcript. Falls back to first 3 sentences if Groq fails."""
    excerpt = transcript[:1500]
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert summarizer. "
                "Write a clear, concise 3-4 sentence summary "
                "of the following YouTube video transcript. "
                "Focus on the main ideas and key takeaways."
            )
        },
        {
            "role": "user",
            "content": f"Transcript:\n{excerpt}"
        }
    ]
    try:
        return _call_groq(messages, max_tokens=200)
    except Exception as e:
        # Fallback: return first 3 sentences of transcript
        sentences = re.split(r"(?<=[.!?])\s+", transcript)
        return " ".join(sentences[:3]) if sentences else transcript[:300]


def ask_groq(question: str, context: List[Tuple[str, float]]) -> str:
    ctx_text = "\n\n".join(
        f"[{i+1}] {chunk}"
        for i, (chunk, _) in enumerate(context)
    )
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant. Answer questions "
                "using ONLY the transcript excerpts provided. "
                "If the answer is not in the excerpts, say: "
                "'I could not find that in the video.'"
            )
        },
        {
            "role": "user",
            "content": (
                f"TRANSCRIPT EXCERPTS:\n{ctx_text}\n\n"
                f"QUESTION: {question}"
            )
        }
    ]
    return _call_groq(messages, max_tokens=512)


def generate_timestamps(transcript: str) -> List[dict]:
    """Extract key timestamps from transcript."""
    excerpt = transcript[:2000]
    messages = [
        {
            "role": "system",
            "content": (
                "You extract key moments from video transcripts. "
                "Return a JSON array of objects with 'time' (e.g., '2:30') and 'label' (brief description). "
                "Extract 3-6 important timestamps that represent key moments in the video. "
                "If no timestamps can be determined, return an empty array."
            )
        },
        {
            "role": "user",
            "content": f"Transcript:\n{excerpt}"
        }
    ]
    try:
        result = _call_groq(messages, max_tokens=300)
        import json
        import re
        json_match = re.search(r'\[[\s\S]*\]', result)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass
    return []


def generate_action_items(transcript: str) -> List[dict]:
    """Extract action items/tasks from transcript."""
    excerpt = transcript[:2000]
    messages = [
        {
            "role": "system",
            "content": (
                "You extract actionable tasks and to-dos from video transcripts. "
                "Return a JSON array of objects with 'task' (the action item) and 'assignee' (if mentioned, otherwise null). "
                "Extract 2-5 actionable items from the video. "
                "If no clear action items exist, return an empty array."
            )
        },
        {
            "role": "user",
            "content": f"Transcript:\n{excerpt}"
        }
    ]
    try:
        result = _call_groq(messages, max_tokens=300)
        import json
        import re
        json_match = re.search(r'\[[\s\S]*\]', result)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass
    return []


def generate_qa_pairs(transcript: str) -> List[dict]:
    """Generate Q&A pairs from transcript."""
    excerpt = transcript[:2000]
    messages = [
        {
            "role": "system",
            "content": (
                "You generate relevant question-answer pairs from video transcripts. "
                "Return a JSON array of objects with 'question' and 'answer'. "
                "Generate 3-5 meaningful Q&A pairs that capture key information from the video. "
                "If not enough content, return an empty array."
            )
        },
        {
            "role": "user",
            "content": f"Transcript:\n{excerpt}"
        }
    ]
    try:
        result = _call_groq(messages, max_tokens=400)
        import json
        import re
        json_match = re.search(r'\[[\s\S]*\]', result)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass
    return []


def generate_key_takeaways(transcript: str) -> List[dict]:
    """Extract key learning points and lessons from transcript."""
    excerpt = transcript[:2500]
    messages = [
        {
            "role": "system",
            "content": (
                "You extract key learning points and important lessons from video transcripts. "
                "Return a JSON array of objects with 'title' (brief headline), 'description' (1-2 sentence explanation), and 'importance' (high/medium/low). "
                "Extract 3-6 valuable takeaways that viewers can learn from. "
                "Focus on actionable insights and key knowledge. "
                "If no clear takeaways, return an empty array."
            )
        },
        {
            "role": "user",
            "content": f"Transcript:\n{excerpt}"
        }
    ]
    try:
        result = _call_groq(messages, max_tokens=500)
        import json
        import re
        json_match = re.search(r'\[[\s\S]*\]', result)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass
    return []


def generate_topic_segments(transcript: str) -> List[dict]:
    """Divide transcript into logical topic segments."""
    excerpt = transcript[:2500]
    messages = [
        {
            "role": "system",
            "content": (
                "You divide video transcripts into logical topic sections. "
                "Return a JSON array of objects with 'topic' (section name), 'start_time', 'end_time' (if available, otherwise null), and 'summary' (brief 1-2 sentence summary). "
                "Create 3-6 topic segments that cover the main themes. "
                "If unable to segment, return an empty array."
            )
        },
        {
            "role": "user",
            "content": f"Transcript:\n{excerpt}"
        }
    ]
    try:
        result = _call_groq(messages, max_tokens=500)
        import json
        import re
        json_match = re.search(r'\[[\s\S]*\]', result)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass
    return []


def generate_key_quotes(transcript: str) -> List[dict]:
    """Extract important quotes from transcript."""
    excerpt = transcript[:2000]
    messages = [
        {
            "role": "system",
            "content": (
                "You extract important and memorable quotes from video transcripts. "
                "Return a JSON array of objects with 'quote' (the quote text) and 'speaker' (who said it, if identifiable, otherwise null). "
                "Extract 3-5 impactful quotes. "
                "If no notable quotes, return an empty array."
            )
        },
        {
            "role": "user",
            "content": f"Transcript:\n{excerpt}"
        }
    ]
    try:
        result = _call_groq(messages, max_tokens=400)
        import json
        import re
        json_match = re.search(r'\[[\s\S]*\]', result)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass
    return []
