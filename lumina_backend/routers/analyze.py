import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from core.database import get_db, DATABASE_PATH
from core.config import settings
from pipeline.transcript import get_transcript_async, extract_video_id
from pipeline.analytics import analyze
from pipeline.llm import summarize, generate_timestamps, generate_action_items, generate_qa_pairs, generate_topic_segments, generate_key_quotes, generate_key_takeaways
from pipeline.rag import LuminaRAG
from pipeline.metadata import get_video_metadata
from schemas.analysis import AnalyzeRequest, AnalyzeResponse, AnalyticsData, KeywordItem, VideoMetadata, AdditionalFeatures, TimestampItem, ActionItem, QAPair, TopicSegment, KeyQuote, KeyTakeaway
import aiosqlite

router = APIRouter(prefix="/api", tags=["analyze"])

# For stateless mode, use a guest user ID
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


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_video(
    request: Request,
    body: AnalyzeRequest
):
    try:
        video_id = extract_video_id(body.youtube_url)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )

    # Fetch video metadata (non-blocking, optional)
    metadata = None
    try:
        metadata = await get_video_metadata(body.youtube_url)
    except Exception:
        pass  # Metadata is optional, don't fail if it can't be fetched

    metadata_obj = VideoMetadata(**metadata) if metadata else None

    try:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute(
                "SELECT * FROM analyses WHERE user_id=? AND video_id=? ORDER BY created_at DESC LIMIT 1",
                (GUEST_USER_ID, video_id)
            )
            cached_row = await cursor.fetchone()
            if cached_row:
                analytics = row_to_analytics(cached_row["analytics_json"])
                return AnalyzeResponse(
                    id=cached_row["id"],
                    video_id=video_id,
                    video_url=cached_row["video_url"],
                    summary=cached_row["summary"],
                    analytics=analytics,
                    additional_features=AdditionalFeatures(),
                    metadata=metadata_obj,
                    cached=True,
                    created_at=cached_row["created_at"]
                )

        try:
            transcript = await get_transcript_async(body.youtube_url)
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e)
            )

        analytics_raw = await asyncio.to_thread(analyze, transcript)
        top_keywords = [KeywordItem(**kw) for kw in analytics_raw["top_keywords"]]
        analytics = AnalyticsData(
            word_count=analytics_raw["word_count"],
            sentence_count=analytics_raw["sentence_count"],
            avg_sentence_length=analytics_raw["avg_sentence_length"],
            sentiment_overall=analytics_raw["sentiment_overall"],
            sentiment_label=analytics_raw["sentiment_label"],
            subjectivity=analytics_raw["subjectivity"],
            top_keywords=top_keywords,
            sentiment_arc=analytics_raw["sentiment_arc"],
            top_bigrams=analytics_raw["top_bigrams"],
            readability_score=analytics_raw["readability_score"]
        )

        # Summary generation - optimized for speed
        summary_text = "Summary generation requires a valid Groq API key."
        try:
            # Use shorter transcript for faster summarization
            short_transcript = transcript[:2000]  # Only first 2000 chars
            summary_text = await asyncio.to_thread(summarize, short_transcript)
        except Exception as e:
            import logging
            logging.warning(f"Summary generation failed: {str(e)}")
            summary_text = f"Summary generation failed. Error: {str(e)[:100]}"

        # Generate additional features
        additional_features = AdditionalFeatures()
        try:
            timestamps_raw = await asyncio.to_thread(generate_timestamps, transcript)
            additional_features.timestamps = [TimestampItem(**t) for t in timestamps_raw]
        except Exception:
            pass

        try:
            action_items_raw = await asyncio.to_thread(generate_action_items, transcript)
            additional_features.action_items = [ActionItem(**a) for a in action_items_raw]
        except Exception:
            pass

        try:
            qa_pairs_raw = await asyncio.to_thread(generate_qa_pairs, transcript)
            additional_features.qa_pairs = [QAPair(**q) for q in qa_pairs_raw]
        except Exception:
            pass

        try:
            topic_segments_raw = await asyncio.to_thread(generate_topic_segments, transcript)
            additional_features.topic_segments = [TopicSegment(**t) for t in topic_segments_raw]
        except Exception:
            pass

        try:
            key_quotes_raw = await asyncio.to_thread(generate_key_quotes, transcript)
            additional_features.key_quotes = [KeyQuote(**q) for q in key_quotes_raw]
        except Exception:
            pass

        try:
            key_takeaways_raw = await asyncio.to_thread(generate_key_takeaways, transcript)
            additional_features.key_takeaways = [KeyTakeaway(**t) for t in key_takeaways_raw]
        except Exception:
            pass

        # Skip RAG index building during analysis - build lazily when chatting
        # This makes analysis much faster (saves ~5 seconds)
        # The chat feature will build the index when first used
        rag = None

        async with aiosqlite.connect(DATABASE_PATH) as db:
            cursor = await db.execute(
                "INSERT INTO analyses (user_id, video_url, video_id, summary, analytics_json) VALUES (?, ?, ?, ?, ?)",
                (GUEST_USER_ID, body.youtube_url, video_id, summary_text, json.dumps(analytics_raw))
            )
            await db.commit()
            created_id = cursor.lastrowid
            cursor = await db.execute("SELECT created_at FROM analyses WHERE id=?", (created_id,))
            row = await cursor.fetchone()
            created_at = row[0]

        return AnalyzeResponse(
            id=created_id,
            video_id=video_id,
            video_url=body.youtube_url,
            summary=summary_text,
            analytics=analytics,
            additional_features=additional_features,
            metadata=metadata_obj,
            cached=False,
            created_at=created_at
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )
