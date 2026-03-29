import re
import asyncio
from concurrent.futures import ThreadPoolExecutor
from youtube_transcript_api import YouTubeTranscriptApi

executor = ThreadPoolExecutor(max_workers=4)


def extract_video_id(url: str) -> str:
    patterns = [
        r"v=([a-zA-Z0-9_-]{11})",
        r"youtu\.be/([a-zA-Z0-9_-]{11})",
        r"embed/([a-zA-Z0-9_-]{11})",
        r"shorts/([a-zA-Z0-9_-]{11})",
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    raise ValueError(f"Invalid YouTube URL: {url}")


def get_transcript(url: str) -> str:
    video_id = extract_video_id(url)
    try:
        yt_api = YouTubeTranscriptApi()
        transcript_list = yt_api.list(video_id)
        
        # Try to find an English transcript
        try:
            transcript = transcript_list.find_transcript(["en", "en-US", "en-GB"])
        except Exception:
            try:
                transcript = transcript_list.find_generated_transcript(["en", "en-US", "en-GB"])
            except Exception:
                raise RuntimeError("No English transcript found for this video.")
        
        transcript_data = transcript.fetch()
        text = " ".join(item.text for item in transcript_data)
        return re.sub(r"\s+", " ", text).strip()
    except RuntimeError:
        raise
    except Exception as e:
        error_str = str(e).lower()
        if "disabled" in error_str:
            raise RuntimeError("Transcripts are disabled for this video.")
        if "no transcript" in error_str or "could not retrieve" in error_str:
            raise RuntimeError("No English transcript found for this video.")
        raise RuntimeError(f"Failed to fetch transcript: {str(e)}")


async def get_transcript_async(url: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, get_transcript, url)
