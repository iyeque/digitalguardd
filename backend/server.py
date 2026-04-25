from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.openai import OpenAITextToSpeech
import os
import logging
import hashlib
import asyncio
from pathlib import Path
from typing import Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- TTS ----------
ALLOWED_VOICES = {"alloy", "ash", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"}

# Tiny in-process cache (text+voice -> mp3 bytes). Bounded.
_tts_cache: dict[str, bytes] = {}
_tts_cache_order: list[str] = []
_tts_lock = asyncio.Lock()
_TTS_CACHE_MAX = 256


class TtsRequest(BaseModel):
    text: str = Field(min_length=1, max_length=400)
    voice: str = Field(default="nova")
    speed: float = Field(default=1.0, ge=0.5, le=1.5)


def _cache_key(text: str, voice: str, speed: float) -> str:
    return hashlib.sha1(f"{voice}|{speed:.2f}|{text}".encode("utf-8")).hexdigest()


def _cache_put(key: str, data: bytes) -> None:
    if key in _tts_cache:
        return
    _tts_cache[key] = data
    _tts_cache_order.append(key)
    while len(_tts_cache_order) > _TTS_CACHE_MAX:
        oldest = _tts_cache_order.pop(0)
        _tts_cache.pop(oldest, None)


@api_router.get("/")
async def root():
    return {"message": "Elise Learns API"}


@api_router.get("/tts/voices")
async def list_voices():
    return {
        "voices": [
            {"id": "nova",    "label": "Nova (warm, cheerful)",  "gender": "female"},
            {"id": "shimmer", "label": "Shimmer (bright)",        "gender": "female"},
            {"id": "coral",   "label": "Coral (warm, friendly)",  "gender": "female"},
            {"id": "fable",   "label": "Fable (storytelling)",    "gender": "female"},
            {"id": "alloy",   "label": "Alloy (neutral)",         "gender": "neutral"},
            {"id": "sage",    "label": "Sage (measured)",         "gender": "neutral"},
            {"id": "ash",     "label": "Ash (clear)",             "gender": "male"},
            {"id": "echo",    "label": "Echo (smooth)",           "gender": "male"},
            {"id": "onyx",    "label": "Onyx (deep)",             "gender": "male"},
        ],
        "default": "nova",
        "available": bool(EMERGENT_LLM_KEY),
    }


@api_router.post("/tts")
async def synthesize(req: TtsRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="TTS not configured")
    if req.voice not in ALLOWED_VOICES:
        raise HTTPException(status_code=400, detail="Unknown voice")

    key = _cache_key(req.text, req.voice, req.speed)
    if key in _tts_cache:
        return Response(content=_tts_cache[key], media_type="audio/mpeg",
                        headers={"X-Cache": "HIT", "Cache-Control": "public, max-age=31536000"})

    async with _tts_lock:
        if key in _tts_cache:
            return Response(content=_tts_cache[key], media_type="audio/mpeg",
                            headers={"X-Cache": "HIT", "Cache-Control": "public, max-age=31536000"})
        try:
            tts = OpenAITextToSpeech(api_key=EMERGENT_LLM_KEY)
            audio_bytes = await tts.generate_speech(
                text=req.text,
                model="tts-1",
                voice=req.voice,
                speed=req.speed,
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logging.exception("TTS generation failed")
            raise HTTPException(status_code=502, detail=f"TTS failed: {e}")
        _cache_put(key, audio_bytes)

    return Response(content=audio_bytes, media_type="audio/mpeg",
                    headers={"X-Cache": "MISS", "Cache-Control": "public, max-age=31536000"})


# ---------- Health ----------
@api_router.get("/health")
async def health():
    return {"ok": True, "tts": bool(EMERGENT_LLM_KEY)}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
