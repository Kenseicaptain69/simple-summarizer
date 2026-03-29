import httpx
from typing import Optional
import re


async def get_video_metadata(youtube_url: str) -> dict:
    """
    Fetch video metadata from YouTube URL.
    Returns: title, thumbnail, duration, channel, views
    """
    try:
        video_id = extract_video_id(youtube_url)
    except ValueError:
        return None
    
    # YouTube thumbnail URLs (available without API)
    thumbnail_urls = {
        'max': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
        'high': f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
        'medium': f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg",
        'default': f"https://img.youtube.com/vi/{video_id}/default.jpg"
    }
    
    # Try to fetch video page for metadata (using oEmbed)
    metadata = {
        'video_id': video_id,
        'title': None,
        'thumbnail_url': thumbnail_urls['high'],
        'thumbnail_urls': thumbnail_urls,
        'channel': None,
        'duration_seconds': None,
        'views': None,
        'upload_date': None
    }
    
    try:
        # Use YouTube oEmbed API (public, no auth required)
        async with httpx.AsyncClient(timeout=5.0) as client:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
            response = await client.get(oembed_url)
            
            if response.status_code == 200:
                data = response.json()
                metadata['title'] = data.get('title')
                metadata['channel'] = data.get('author_name')
    except Exception:
        # If oEmbed fails, just return what we have
        pass
    
    return metadata


def extract_video_id(url: str) -> str:
    """Extract video ID from YouTube URL"""
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\n?#]+)',
        r'youtube\.com/watch\?.*v=([^&\n?#]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise ValueError(f"Invalid YouTube URL: {url}")
