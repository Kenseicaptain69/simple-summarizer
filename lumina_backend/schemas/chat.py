from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    video_id: str
    question: str = Field(min_length=3, max_length=500)


class ChatResponse(BaseModel):
    answer: str
    video_id: str
    question: str
