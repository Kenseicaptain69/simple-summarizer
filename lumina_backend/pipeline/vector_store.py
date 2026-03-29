import os
import pickle
from typing import List, Tuple
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer


class VectorStore:
    MODEL = "all-MiniLM-L6-v2"
    DIM = 384

    def __init__(self):
        self.model = SentenceTransformer(self.MODEL)
        self.index = None
        self.chunks: List[str] = []

    def build(self, chunks: List[str]) -> None:
        self.chunks = chunks
        embeddings = self.model.encode(chunks, show_progress_bar=False)
        embeddings = np.array(embeddings, dtype="float32")
        faiss.normalize_L2(embeddings)
        self.index = faiss.IndexFlatIP(self.DIM)
        self.index.add(embeddings)

    def search(self, query: str, top_k: int = 4) -> List[Tuple[str, float]]:
        if not self.index:
            raise RuntimeError("Call build() first.")
        vec = self.model.encode([query])
        vec = np.array(vec, dtype="float32")
        faiss.normalize_L2(vec)
        scores, idxs = self.index.search(vec, top_k)
        return [
            (self.chunks[i], float(s))
            for s, i in zip(scores[0], idxs[0])
            if i != -1
        ]

    def save(self, path: str) -> None:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump({
                "chunks": self.chunks,
                "index": faiss.serialize_index(self.index)
            }, f)

    def load(self, path: str) -> None:
        with open(path, "rb") as f:
            data = pickle.load(f)
        self.chunks = data["chunks"]
        self.index = faiss.deserialize_index(data["index"])
