from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.openai import OpenAITextToSpeech
import os
import logging
import hashlib
import asyncio
import httpx
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


# ---------- Curated nursery rhyme audio (public domain, archive.org) ----------
RHYME_SOURCES = {
    "twinkle": {
        "title": "Twinkle Twinkle Little Star",
        "url": "https://archive.org/download/78_twinkle-twinkle-little-star_gbia0533998b/TWINKLE%20TWINKLE%20LITTLE%20STAR.mp3",
    },
    "macdonald": {
        "title": "Old MacDonald Had a Farm",
        "url": "https://archive.org/download/78_old-macdonald-had-a-farm_gbia0431356a/OLD%20MACDONALD%20HAD%20A%20FARM.mp3",
    },
    "baabaa": {
        "title": "Baa Baa Black Sheep",
        "url": "https://archive.org/download/78_3-baa-baa-black-sheep_gbia0210109c/3.%20BAA%20BAA%20BLACK%20SHEEP.mp3",
    },
}

_audio_cache: dict[str, bytes] = {}
_audio_cache_lock = asyncio.Lock()


@api_router.get("/audio/rhymes")
async def rhymes_index():
    return {
        "rhymes": [
            {"slug": k, "title": v["title"], "available": True}
            for k, v in RHYME_SOURCES.items()
        ]
    }


@api_router.get("/audio/rhyme/{slug}")
async def rhyme_audio(slug: str):
    if slug not in RHYME_SOURCES:
        raise HTTPException(status_code=404, detail="Unknown rhyme")
    if slug in _audio_cache:
        return Response(content=_audio_cache[slug], media_type="audio/mpeg",
                        headers={"X-Cache": "HIT", "Cache-Control": "public, max-age=31536000"})
    async with _audio_cache_lock:
        if slug in _audio_cache:
            return Response(content=_audio_cache[slug], media_type="audio/mpeg",
                            headers={"X-Cache": "HIT", "Cache-Control": "public, max-age=31536000"})
        url = RHYME_SOURCES[slug]["url"]
        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
                r = await client.get(url, headers={"User-Agent": "EliseLearns/1.0"})
                r.raise_for_status()
                _audio_cache[slug] = r.content
        except Exception as e:
            logging.exception("rhyme fetch failed")
            raise HTTPException(status_code=502, detail=f"Source fetch failed: {e}")
    return Response(content=_audio_cache[slug], media_type="audio/mpeg",
                    headers={"X-Cache": "MISS", "Cache-Control": "public, max-age=31536000"})


# ---------- Stories ----------
STORIES = [
    {
        "id": "tiny-bunny",
        "title": "Tiny Bunny's First Hop",
        "color": "#9CBFA7",
        "lines": [
            "Tiny Bunny woke up under a soft moon.",
            "She wiggled her nose and stretched her tiny ears.",
            "Hop! Hop! Hop! Across the cool green grass.",
            "She found a clover, big and round and sweet.",
            "Munch, munch, munch — what a happy little bunny.",
            "Then she snuggled home and dreamed of clouds.",
        ],
    },
    {
        "id": "blue-balloon",
        "title": "The Blue Balloon",
        "color": "#A1BCE3",
        "lines": [
            "A blue balloon floated way up high.",
            "It waved hello to a passing bird.",
            "It bounced on a cloud, soft and white.",
            "The wind sang a song and gave it a push.",
            "Down, down, down it drifted to a child.",
            "She caught it tight and laughed and laughed.",
        ],
    },
    {
        "id": "sleepy-puppy",
        "title": "Sleepy Puppy and the Star",
        "color": "#F0B8C6",
        "lines": [
            "Puppy could not sleep tonight.",
            "He looked outside and saw a tiny star.",
            "The star winked, just for him.",
            "Puppy yawned a great big yawn.",
            "He curled up warm and shut his eyes.",
            "The star kept watch all through the night.",
        ],
    },
    {
        "id": "apple-tree",
        "title": "The Apple Tree's Gift",
        "color": "#E89D8A",
        "lines": [
            "An apple tree grew by a little stream.",
            "Each apple was red and round and bright.",
            "A small girl came and shared her song.",
            "The tree dropped one apple in her hand.",
            "Crunch! It tasted of summer and sun.",
            "She said thank you with a happy smile.",
        ],
    },
    {
        "id": "kind-cloud",
        "title": "The Kind Little Cloud",
        "color": "#F2CA7E",
        "lines": [
            "A little cloud was small and shy.",
            "Other clouds drifted by, tall and proud.",
            "Below, the flowers wilted in the sun.",
            "The little cloud made gentle rain just for them.",
            "The flowers cheered up and said hello.",
            "The little cloud was small but full of love.",
        ],
    },
]


@api_router.get("/stories")
async def list_stories():
    return {"stories": STORIES}


@api_router.get("/stories/{story_id}")
async def get_story(story_id: str):
    for s in STORIES:
        if s["id"] == story_id:
            return s
    raise HTTPException(status_code=404, detail="Story not found")


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
