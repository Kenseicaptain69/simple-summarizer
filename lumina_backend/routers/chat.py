import asyncio
import os
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pipeline.rag import LuminaRAG
from pipeline.transcript import get_transcript
from pipeline.chunker import chunk_text
from schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_video(
    request: Request,
    body: ChatRequest
):
    try:
        rag = LuminaRAG()
        
        # Get the video URL from the request or reconstruct it
        # For now, we'll reconstruct from video_id
        video_url = f"https://www.youtube.com/watch?v={body.video_id}"
        
        # Load video (will use cache if available, otherwise fetch transcript and build index)
        await asyncio.to_thread(rag.load_video, video_url)
        
        # Ask the question
        answer = await asyncio.to_thread(rag.ask, body.question)
        return ChatResponse(
            answer=answer,
            video_id=body.video_id,
            question=body.question
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat: {str(e)}"
        )
