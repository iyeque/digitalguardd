from fastapi import FastAPI, APIRouter, HTTPException, Header
from fastapi.responses import Response
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import httpx
import io
from pathlib import Path
from typing import Optional, Dict
from piper import PiperVoice 

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'elise')

client = None
db = None
coll_progress = None
coll_clips = None

if mongo_url:
    try:
        logging.info("Connecting to MongoDB Atlas...")
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = client[db_name]
        coll_progress = db['progress']
        coll_clips = db['voice_clips']
    except Exception as e:
        logging.error(f"MongoDB Connection Error: {e}")
        client = None
        db = None
else:
    logging.info("MONGO_URL not found. Persistence disabled.")

# Load Piper voice
# Make sure en_US-amy-low.onnx and its json config are in the backend folder
MODEL_PATH = "en_US-amy-low.onnx"
try:
    logging.info("Initializing Piper voice...")
    voice = PiperVoice.load(MODEL_PATH)
    logging.info("Piper voice ready.")
except Exception as e:
    logging.error(f"Piper initialization failed: {e}")
    voice = None

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Sync Schemas ----------
class ProgressSync(BaseModel):
    data: Dict

class ClipSync(BaseModel):
    phrase: str
    audio_base64: str 
    label: Optional[str] = ""

# ---------- TTS ----------
class TtsRequest(BaseModel):
    text: str = Field(min_length=1, max_length=400)

@api_router.get("/tts/voices")
async def list_voices():
    return {
        "voices": [{"id": "default", "label": "Piper Natural", "gender": "neutral"}],
        "default": "default",
        "available": voice is not None,
    }

@api_router.post("/tts")
async def synthesize(req: TtsRequest):
    if not voice:
        raise HTTPException(status_code=503, detail="TTS voice not loaded")
    
    try:
        # Piper's synthesize method writes WAV data directly to the stream.
        # It handles the header, sample rate, etc. internally based on the model.
        output = io.BytesIO()
        voice.synthesize(req.text, output)
        return Response(content=output.getvalue(), media_type="audio/wav")
    except Exception as e:
        logging.error(f"TTS generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Audio generation failed")

# ---------- Sync Endpoints ----------
@api_router.get("/sync/progress")
async def get_progress(user_id: str = Header(...)):
    if coll_progress is None: raise HTTPException(status_code=503, detail="DB not available")
    try:
        doc = await coll_progress.find_one({"user_id": user_id})
        return doc["data"] if doc else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB query failed: {e}")

@api_router.post("/sync/progress")
async def save_progress(req: ProgressSync, user_id: str = Header(...)):
    if coll_progress is None: raise HTTPException(status_code=503, detail="DB not available")
    try:
        await coll_progress.update_one(
            {"user_id": user_id},
            {"$set": {"data": req.data}},
            upsert=True
        )
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB update failed: {e}")

@api_router.get("/sync/clips")
async def list_sync_clips(user_id: str = Header(...)):
    if coll_clips is None: raise HTTPException(status_code=503, detail="DB not available")
    try:
        cursor = coll_clips.find({"user_id": user_id})
        clips = []
        async for doc in cursor:
            clips.append({
                "phrase": doc["phrase"],
                "label": doc["label"],
                "audio_base64": doc["audio_base64"]
            })
        return {"clips": clips}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB list failed: {e}")

@api_router.post("/sync/clips")
async def upload_clip(req: ClipSync, user_id: str = Header(...)):
    if coll_clips is None: raise HTTPException(status_code=503, detail="DB not available")
    try:
        await coll_clips.update_one(
            {"user_id": user_id, "phrase": req.phrase},
            {"$set": {
                "audio_base64": req.audio_base64,
                "label": req.label
            }},
            upsert=True
        )
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB upload failed: {e}")

# ---------- Health ----------
@api_router.get("/health")
async def health():
    return {"ok": True, "tts": voice is not None, "db": db is not None}

# ---------- Rhymes, Stories, Proxy ----------
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
    "itsybitsy": {
        "title": "Itsy Bitsy Spider",
        "url": "https://archive.org/download/wheels-on-the-bus-nursery-rhymes-pbs-kids/Itsy%20Bitsy%20Spider.mp3",
    },
}

@api_router.get("/audio/rhymes")
async def rhymes_index():
    return {"rhymes": [{"slug": k, "title": v["title"], "available": True} for k, v in RHYME_SOURCES.items()]}

@api_router.get("/audio/rhyme/{slug}")
async def rhyme_audio(slug: str):
    if slug not in RHYME_SOURCES: raise HTTPException(status_code=404)
    async with httpx.AsyncClient(follow_redirects=True) as client:
        r = await client.get(RHYME_SOURCES[slug]["url"])
        return Response(content=r.content, media_type="audio/mpeg")

@api_router.get("/stories")
async def list_stories():
    return {"stories": [
        {"id": "tiny-bunny", "title": "Tiny Bunny's First Hop", "color": "#9CBFA7", "lines": ["Tiny Bunny woke up under a soft moon.", "She wiggled her nose and stretched her tiny ears.", "Hop! Hop! Hop! Across the cool green grass.", "She found a clover, big and round and sweet.", "Munch, munch, munch — what a happy little bunny.", "Then she snuggled home and dreamed of clouds."]},
        {"id": "blue-balloon", "title": "The Blue Balloon", "color": "#A1BCE3", "lines": ["A blue balloon floated way up high.", "It waved hello to a passing bird.", "It bounced on a cloud, soft and white.", "The wind sang a song and gave it a push.", "Down, down, down it drifted to a child.", "She caught it tight and laughed and laughed."]},
        {"id": "sleepy-puppy", "title": "Sleepy Puppy and the Star", "color": "#F0B8C6", "lines": ["Puppy could not sleep tonight.", "He looked outside and saw a tiny star.", "The star winked, just for him.", "Puppy yawned a great big yawn.", "He curled up warm and shut his eyes.", "The star kept watch all through the night."]},
        {"id": "apple-tree", "title": "The Apple Tree's Gift", "color": "#E89D8A", "lines": ["An apple tree grew by a little stream.", "Each apple was red and round and bright.", "A small girl came and shared her song.", "The tree dropped one apple in her hand.", "Crunch! It tasted of summer and sun.", "She said thank you with a happy smile."]},
        {"id": "kind-cloud", "title": "The Kind Little Cloud", "color": "#F2CA7E", "lines": ["A little cloud was small and shy.", "Other clouds drifted by, tall and proud.", "Below, the flowers wilted in the sun.", "The little cloud made gentle rain just for them.", "The flowers cheered up and said hello.", "The little cloud was small but full of love."]},
    ]}

@api_router.get("/proxy")
async def proxy_url(url: str):
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(url)
        return Response(content=response.content, media_type="application/octet-stream")

app.include_router(api_router)

# Dynamic CORS to support local network IPs (e.g. 192.168.x.x)
allowed_origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
]
# Add current local network IP if possible, or allow all for local dev
if os.environ.get('CORS_ORIGINS'):
    allowed_origins.extend(os.environ.get('CORS_ORIGINS').split(','))
else:
    allowed_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
