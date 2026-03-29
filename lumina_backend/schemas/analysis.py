from pydantic import BaseModel, Field
from typing import List, Optional


class KeywordItem(BaseModel):
    word: str
    count: int


class VideoMetadata(BaseModel):
    video_id: str
    title: Optional[str] = None
    thumbnail_url: Optional[str] = None
    thumbnail_urls: Optional[dict] = None
    channel: Optional[str] = None
    duration_seconds: Optional[int] = None
    views: Optional[int] = None
    upload_date: Optional[str] = None


class TimestampItem(BaseModel):
    time: str
    label: str


class ActionItem(BaseModel):
    task: str
    assignee: Optional[str] = None


class QAPair(BaseModel):
    question: str
    answer: str


class TopicSegment(BaseModel):
    topic: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    summary: Optional[str] = None


class KeyQuote(BaseModel):
    quote: str
    speaker: Optional[str] = None


class KeyTakeaway(BaseModel):
    title: str
    description: str
    importance: Optional[str] = None


class AdditionalFeatures(BaseModel):
    timestamps: List[TimestampItem] = []
    action_items: List[ActionItem] = []
    qa_pairs: List[QAPair] = []
    topic_segments: List[TopicSegment] = []
    key_quotes: List[KeyQuote] = []
    key_takeaways: List[KeyTakeaway] = []


class AnalyticsData(BaseModel):
    word_count: int
    sentence_count: int
    avg_sentence_length: float
    sentiment_overall: float
    sentiment_label: str
    subjectivity: float
    top_keywords: List[KeywordItem]
    sentiment_arc: List[float]
    top_bigrams: List[str]
    readability_score: float


class AnalyzeRequest(BaseModel):
    youtube_url: str


class AnalyzeResponse(BaseModel):
    id: int = None
    video_id: str
    video_url: str
    summary: str
    analytics: AnalyticsData
    additional_features: Optional[AdditionalFeatures] = None
    metadata: Optional[VideoMetadata] = None
    cached: bool
    created_at: str


class HistoryItem(BaseModel):
    id: int
    video_url: str
    video_id: str
    summary: str
    created_at: str
    metadata: Optional[VideoMetadata] = None
    additional_features: Optional[AdditionalFeatures] = None
