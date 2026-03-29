import os
import re
from typing import List, Tuple
from collections import Counter
from textblob import TextBlob
from pipeline.transcript import get_transcript, extract_video_id
from pipeline.chunker import chunk_text
from pipeline.vector_store import VectorStore
from pipeline.llm import ask_groq

CACHE_DIR = "./cache"


class LuminaRAG:
    def __init__(self):
        self.store = VectorStore()
        self.video_id: str = None

    def load_video(self, url: str) -> None:
        self.video_id = extract_video_id(url)
        cache_path = f"{CACHE_DIR}/{self.video_id}.pkl"

        if os.path.exists(cache_path):
            self.store.load(cache_path)
            return

        transcript = get_transcript(url)
        chunks = chunk_text(transcript)
        self.store.build(chunks)
        self.store.save(cache_path)

    def ask(self, question: str) -> str:
        if not self.store.index:
            raise RuntimeError("Load a video first.")
        context = self.store.search(question, top_k=4)
        return ask_groq(question, context)
