# Elise Learns

A delightful, Montessori-inspired edtech web app for 2-year-olds — soft pastel "wooden block" aesthetic, big tap targets, calm animations, **studio-quality cloud narration**, **real sung nursery rhymes**, **letter tracing**, **drag-and-drop puzzles**, **5 illustrated stories**, and a parent-facing dashboard with **stickers**, **share cards**, and a **custom voice library**.

![App](https://img.shields.io/badge/age-2%2B-9CBFA7) ![Stack](https://img.shields.io/badge/stack-React%2019%20%2B%20FastAPI-A1BCE3) ![Style](https://img.shields.io/badge/style-Montessori%20pastel-F0B8C6) ![Audio](https://img.shields.io/badge/voices-9%20cloud%20%2B%20device%20%2B%20your%20own-E89D8A)

---

## 🌟 What's New (Iteration 5)
- **All 4 Rhymes are now Sung**: Added vocal recording for "Itsy Bitsy Spider".
- **24 Animals with Emojis**: Expanded the animal library with accurate sounds and high-quality emojis that work 100% offline.
- **Toddler Avatars**: Parents can now pick a friendly animal avatar (Rabbit, Panda, etc.) to greet the child on the home screen.
- **Improved Reliability**: Added local fallbacks so stories and rhymes load automatically when running the backend on localhost.
- **Clean Slate**: Removed platform-specific branding for a standard, portable codebase.

---

## Activities (9)

| Page | What it does |
|---|---|
| `/` Home | Bento grid of all 9 activities, personalised greeting (`Hi {childName}!`) |
| `/abc` Alphabet | Tap-to-hear A→Z flashcards with optional **phonics mode** (says "buh" instead of "bee") |
| `/trace` Tracing | Finger-trace each letter on a canvas with a faint guide |
| `/123` Numbers | Count tap-able apples 1–10 (chained-audio so "Great job" never cuts off the last digit) |
| `/colors` Colors | 6 pastel color blocks |
| `/shapes` Shapes | "Find the X" matching mini-game |
| `/puzzle` Puzzles | Drag-and-drop **shapes** *or* **numbers** into matching outlines (variant toggle) |
| `/animals` Animals | 24 animals with playful emojis and spoken names/sounds |   
| `/rhymes` Rhymes | 4 nursery rhymes — Twinkle, Old MacDonald, Baa Baa Black Sheep, Itsy Bitsy are **actually sung** |
| `/stories` Stories | 5 hand-written 6-line illustrated stories read line-by-line in the parent's chosen voice |
| `/parent` Parent Area | Stats, weekly bar chart, 13 milestone stickers, Magic Moment share card |    
| `/parent/settings` Settings | Voice engine, voice picker, child name, phonics, daily limit, voice library, full-screen |

The Parent Area is hidden behind a 1.5-second long-press of the gear icon, so toddlers don't accidentally enter it.

---

## 🛠️ Roadmap

- **P0: Cross-device Sync**: Implement Google Auth to sync progress and custom voice libraries across devices.
- **P1: Karaoke Highlighting**: Precise word-by-word highlighting during stories and rhymes.
- **P1: Multi-language Vocab**: Translate on-screen text (Apple → Manzana) alongside the voice.
- **P2: More Puzzles**: Add "Animal-into-Habitat" and other Montessori-inspired puzzle variants.
- **P3: PWA / Full Offline Mode**: Cache all audio (TTS and Rhymes) in IndexedDB for 100% offline use.
- **Enhancement**: "Bedtime story in your voice" — a mode where parents can record a whole story line-by-line.

---

## Voice & Audio System

The app has **three layers** for narration, in order of preference:

1. **Custom recordings** — parents can record or upload audio for specific phrases (e.g. "Hi Elise", "Great job!"). Stored in IndexedDB. Plays whenever a phrase matches exactly.
2. **OpenAI Cloud TTS** — 9 studio voices (`nova`, `shimmer`, `coral`, `fable`, `alloy`, `sage`, `ash`, `echo`, `onyx`). Backend caches MP3 bytes per (voice, speed, text).
3. **Browser TTS fallback** — `window.speechSynthesis` with female/male toggle and voice picker. Used automatically if cloud is unreachable or disabled.

Background lullaby for Rhymes is generated client-side with the Web Audio API (no external assets).    

---

## Tech Stack

- **Frontend** — React 19 · react-router-dom v7 · TailwindCSS · shadcn/ui · lucide-react · CRACO       
- **Backend** — FastAPI · Motor (MongoDB driver) · httpx
- **Audio** — OpenAI TTS, browser `speechSynthesis`, MediaRecorder, Web Audio API
- **Persistence** — `localStorage` for progress + settings; **IndexedDB** for parent voice clips       
- **Backend audio** — proxies & in-memory caches public-domain rhyme recordings from archive.org       

---

## Run Locally

### Prerequisites
- Node 18+
- Python 3.11+
- MongoDB (optional for local testing)

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm start         # http://localhost:3000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
# Required env vars in backend/.env (Optional):
#   MONGO_URL=mongodb://localhost:27017
#   DB_NAME=elise
#   CORS_ORIGINS=*
#   OPENAI_API_KEY=sk-...    # for cloud TTS
uvicorn server:app --reload --port 8001
```

---

## Privacy

All progress is stored in the browser — `localStorage` for taps and preferences, **IndexedDB** for parent voice recordings. Nothing leaves the device unless the parent explicitly shares the Magic Moment card via the system share sheet.

---

## License

MIT
