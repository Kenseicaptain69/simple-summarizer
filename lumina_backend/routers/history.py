import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from core.config import settings
from core.database import DATABASE_PATH
from schemas.analysis import HistoryItem, AnalyzeResponse, AnalyticsData, KeywordItem, VideoMetadata, AdditionalFeatures, TimestampItem, ActionItem, QAPair, TopicSegment, KeyQuote
from pipeline.metadata import get_video_metadata
import aiosqlite

router = APIRouter(prefix="/api", tags=["history"])

GUEST_USER_ID = 1


def row_to_analytics(analytics_json: str) -> AnalyticsData:
    try:
        data = json.loads(analytics_json)
    except (json.JSONDecodeError, TypeError):
        # Return default analytics if JSON is invalid
        return AnalyticsData(
            word_count=0,
            sentence_count=0,
            avg_sentence_length=0,
            sentiment_overall=0,
            sentiment_label="neutral",
            subjectivity=0,
            top_keywords=[],
            sentiment_arc=[],
            top_bigrams=[],
            readability_score=0
        )
    top_keywords = [KeywordItem(**kw) for kw in data.get("top_keywords", [])]
    return AnalyticsData(
        word_count=data.get("word_count", 0),
        sentence_count=data.get("sentence_count", 0),
        avg_sentence_length=data.get("avg_sentence_length", 0),
        sentiment_overall=data.get("sentiment_overall", 0),
        sentiment_label=data.get("sentiment_label", "neutral"),
        subjectivity=data.get("subjectivity", 0),
        top_keywords=top_keywords,
        sentiment_arc=data.get("sentiment_arc", []),
        top_bigrams=data.get("top_bigrams", []),
        readability_score=data.get("readability_score", 0)
    )


def row_to_additional_features(additional_features_json: str) -> AdditionalFeatures:
    try:
        data = json.loads(additional_features_json)
    except (json.JSONDecodeError, TypeError):
        return AdditionalFeatures()
    
    timestamps = [TimestampItem(**t) for t in data.get("timestamps", [])]
    action_items = [ActionItem(**a) for a in data.get("action_items", [])]
    qa_pairs = [QAPair(**q) for q in data.get("qa_pairs", [])]
    topic_segments = [TopicSegment(**t) for t in data.get("topic_segments", [])]
    key_quotes = [KeyQuote(**q) for q in data.get("key_quotes", [])]
    
    return AdditionalFeatures(
        timestamps=timestamps,
        action_items=action_items,
        qa_pairs=qa_pairs,
        topic_segments=topic_segments,
        key_quotes=key_quotes
    )


@router.get("/history", response_model=List[HistoryItem])
async def get_history():
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT id, video_url, video_id, summary, created_at FROM analyses WHERE user_id=? ORDER BY created_at DESC LIMIT 20",
            (GUEST_USER_ID,)
        )
        rows = await cursor.fetchall()
        
        # Fetch metadata for each video (in parallel)
        items = []
        for row in rows:
            metadata = None
            try:
                metadata_dict = await get_video_metadata(row["video_url"])
                metadata = VideoMetadata(**metadata_dict) if metadata_dict else None
            except Exception:
                pass
            
            items.append(
                HistoryItem(
                    id=row["id"],
                    video_url=row["video_url"],
                    video_id=row["video_id"],
                    summary=row["summary"] or "",
                    created_at=row["created_at"],
                    metadata=metadata
                )
            )
        
        return items


@router.get("/history/{analysis_id}", response_model=AnalyzeResponse)
async def get_history_item(analysis_id: int):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM analyses WHERE id=?",
            (analysis_id,)
        )
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        analytics = row_to_analytics(row["analytics_json"])
        
        # Fetch metadata
        metadata = None
        try:
            metadata_dict = await get_video_metadata(row["video_url"])
            metadata = VideoMetadata(**metadata_dict) if metadata_dict else None
        except Exception:
            pass
        
        return AnalyzeResponse(
            id=row["id"],
            video_id=row["video_id"],
            video_url=row["video_url"],
            summary=row["summary"] or "Summary not available",
            analytics=analytics,
            additional_features=AdditionalFeatures(),
            metadata=metadata,
            cached=True,
            created_at=row["created_at"]
        )


@router.delete("/history/{analysis_id}")
async def delete_history_item(analysis_id: int):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT user_id FROM analyses WHERE id=?",
            (analysis_id,)
        )
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        await db.execute("DELETE FROM analyses WHERE id=?", (analysis_id,))
        await db.commit()
    return {"message": "Deleted"}
