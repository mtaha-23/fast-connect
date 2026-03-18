from __future__ import annotations

import json
import os
from pathlib import Path
from typing import List

import faiss
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer
import google.generativeai as genai


HERE = Path(__file__).resolve().parent


def _load_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY")
    if key:
        return key.strip()
    raise RuntimeError(
        "Missing GEMINI_API_KEY env var. Set it before starting the server."
    )


GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-flash-latest")
TOP_K_DEFAULT = int(os.getenv("RAG_TOPK", "5"))


# Load heavy resources ONCE at startup
meta = json.loads((HERE / "metadata.json").read_text(encoding="utf-8"))
index = faiss.read_index(str(HERE / "fast_index.faiss"))
encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

genai.configure(api_key=_load_api_key())


def retrieve(query: str, k: int = 5) -> List[str]:
    qemb = encoder.encode(query, convert_to_numpy=True).astype("float32")
    _, I = index.search(qemb[np.newaxis, :], k)
    return [meta[int(i)]["content"] for i in I[0] if int(i) in range(len(meta))]


def ask_gemini(question: str, contexts: List[str]) -> str:
    try:
        model = genai.GenerativeModel(GEMINI_MODEL)

        prompt = "You are a helpful and concise assistant for FAST-NUCES info.\n"
        prompt += "Answer the question directly using ONLY the following document excerpts.\n"
        prompt += "Do not mention that information is missing for other campuses or sections unless specifically asked.\n"
        prompt += "Avoid phrases like 'Based on the provided documents' or 'According to the context'.\n"
        prompt += "If the answer is not found in the excerpts, say: 'I'm sorry, I don't have information on that.'\n\n"

        for i, ctx in enumerate(contexts, 1):
            prompt += f"[Context {i}]: {ctx}\n\n"

        prompt += f"Question: {question}\nAnswer:"

        response = model.generate_content(prompt)
        return (response.text or "").strip()
    except Exception as e:
        msg = str(e)
        if "429" in msg or "quota" in msg.lower():
            return (
                "Error: Gemini API quota exceeded. Please try again after a minute "
                "or check your API key's usage limits."
            )
        return f"Error calling Gemini API: {msg}"


app = FastAPI(title="FASTConnect RAG Backend", version="1.0.0")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    topk: int | None = Field(default=None, ge=1, le=20)


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        k = req.topk or TOP_K_DEFAULT
        contexts = retrieve(req.message, k=k)
        reply = ask_gemini(req.message, contexts)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

