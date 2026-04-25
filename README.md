# Elise Learns

A delightful, Montessori-inspired edtech web app for 2-year-olds — soft pastel "wooden block" aesthetic, big tap targets, calm animations, **studio-quality cloud narration**, **real sung nursery rhymes**, **letter tracing**, **drag-and-drop puzzles**, **5 illustrated stories**, and a parent-facing dashboard with **stickers**, **share cards**, and a **custom voice library**.

> Built on the Emergent platform.

![App](https://img.shields.io/badge/age-2%2B-9CBFA7) ![Stack](https://img.shields.io/badge/stack-React%2019%20%2B%20FastAPI-A1BCE3) ![Style](https://img.shields.io/badge/style-Montessori%20pastel-F0B8C6) ![Audio](https://img.shields.io/badge/voices-9%20cloud%20%2B%20device%20%2B%20your%20own-E89D8A)

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
| `/animals` Animals | 14 animals with custom Montessori art for Lion/Elephant/Pig + spoken sounds |
| `/rhymes` Rhymes | 4 nursery rhymes — Twinkle, Old MacDonald, Baa Baa Black Sheep are **actually sung** (public-domain recordings); Itsy Bitsy plays spoken |
| `/stories` Stories | 5 hand-written 6-line illustrated stories read line-by-line in the parent's chosen voice |
| `/parent` Parent Area | Stats, weekly bar chart, 13 milestone stickers, Magic Moment share card |
| `/parent/settings` Settings | Voice engine, voice picker, child name, phonics, daily limit, voice library, full-screen |

The Parent Area is hidden behind a 1.5-second long-press of the gear icon, so toddlers don't accidentally enter it.

---

## Voice & Audio System

The app has **three layers** for narration, in order of preference:

1. **Custom recordings** — parents can record or upload audio for specific phrases (e.g. "Hi Elise", "Great job!"). Stored in IndexedDB. Plays whenever a phrase matches exactly.
2. **OpenAI Cloud TTS** — 9 studio voices (`nova`, `shimmer`, `coral`, `fable`, `alloy`, `sage`, `ash`, `echo`, `onyx`). Uses the **Emergent LLM Key** so no separate OpenAI key needed. Backend caches MP3 bytes per (voice, speed, text).
3. **Browser TTS fallback** — `window.speechSynthesis` with female/male toggle and voice picker. Used automatically if cloud is unreachable or disabled.

Background lullaby for Rhymes is generated client-side with the Web Audio API (no external assets).

---

## Tech Stack

- **Frontend** — React 19 · react-router-dom v7 · TailwindCSS · shadcn/ui · lucide-react · CRACO
- **Backend** — FastAPI · Motor (MongoDB driver) · `emergentintegrations.llm.openai.OpenAITextToSpeech` · httpx
- **Audio** — OpenAI TTS, browser `speechSynthesis`, MediaRecorder, Web Audio API
- **Persistence** — `localStorage` for progress + settings; **IndexedDB** for parent voice clips
- **Backend audio** — proxies & in-memory caches public-domain rhyme recordings from archive.org

### Backend endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Liveness + cloud TTS availability |
| GET | `/api/tts/voices` | Lists 9 OpenAI voices |
| POST | `/api/tts` | `{text, voice, speed}` → audio/mpeg (cached) |
| GET | `/api/audio/rhymes` | Available sung rhyme slugs |
| GET | `/api/audio/rhyme/{slug}` | Streams the cached PD recording |
| GET | `/api/stories` | All 5 stories |
| GET | `/api/stories/{id}` | A specific story |

---

## Project Layout

```
.
├── frontend/        # React SPA — the actual app
│   ├── package.json
│   ├── src/
│   │   ├── pages/         # one file per activity (Home, Alphabet, Trace, Numbers, Colors, Shapes, Puzzle, Animals, Rhymes, Stories, ParentDashboard, ParentSettings)
│   │   ├── components/    # shadcn ui + Layout + BreakReminder + VoiceLibrary
│   │   └── lib/           # speech, tts-client, voice-clips, voice-settings, tracking, achievements, share-card, audio-bg, session-time, phonics, data
│   └── .env               # REACT_APP_BACKEND_URL
├── backend/         # FastAPI app
│   ├── server.py          # all endpoints + STORIES + RHYME_SOURCES
│   ├── requirements.txt
│   └── .env               # MONGO_URL, DB_NAME, EMERGENT_LLM_KEY
└── memory/PRD.md    # product spec & changelog
```

---

## Run Locally

### Prerequisites
- Node 18+ with **yarn** (not npm)
- Python 3.11+
- MongoDB (only required if you wire real persistence; not needed for current toddler features)

### Frontend
```bash
cd frontend
yarn install
yarn start         # http://localhost:3000
```
The frontend reads `REACT_APP_BACKEND_URL` from `frontend/.env`.

### Backend
```bash
cd backend
pip install -r requirements.txt
# Required env vars in backend/.env:
#   MONGO_URL=mongodb://localhost:27017
#   DB_NAME=elise
#   CORS_ORIGINS=*
#   EMERGENT_LLM_KEY=sk-emergent-...    # for cloud TTS
uvicorn server:app --reload --port 8001
```

If `EMERGENT_LLM_KEY` is missing the app still runs — it just falls back to browser TTS.

---

## Deploy

### Option A — Emergent Native Deploy (recommended, full-stack)
Click the **Deploy** button in the Emergent UI. It deploys frontend + backend + database and gives you one public URL.

### Option B — Vercel (frontend-only)

Most of this app runs in the browser, so Vercel works for the toddler-facing experience. The cloud-TTS, sung-rhyme proxy, and stories endpoints, however, require the FastAPI backend — host that separately on Render / Railway / Fly and point `REACT_APP_BACKEND_URL` at it. If you skip the backend, the app gracefully falls back to browser TTS and spoken rhymes.

1. Push the repo to GitHub.
2. Import the project on Vercel.
3. In **Settings → General**, set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Create React App`
   - **Install Command**: `yarn install`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
4. In **Settings → Environment Variables**, add:
   - `REACT_APP_BACKEND_URL` = your backend public URL (or any value if running frontend-only — the failed `/api` calls are silently caught)
5. **Redeploy**.

> **Why the previous Vercel build failed** (`ENOENT: package.json`): Vercel was reading from the repo root, but `package.json` lives in `frontend/`. Setting **Root Directory = `frontend`** fixes it.

### Option C — Other static hosts
Any static host works (Netlify, Cloudflare Pages, GitHub Pages). Build with `yarn build` inside `frontend/` and deploy the `build/` folder. Backend still hosts separately if you want cloud TTS / sung rhymes / stories.

---

## Privacy

All progress is stored in the browser — `localStorage` for taps and preferences, **IndexedDB** for parent voice recordings. Nothing leaves the device unless the parent explicitly shares the Magic Moment card via the system share sheet.

LocalStorage keys used:
- `elise_learns_progress_v1` — taps, opens, last visit per activity
- `elise_voice_settings_v1` — voice engine, voice id, child name, phonics, daily limit, etc.
- `elise_daily_v1` — per-day session-time history (for the weekly chart)
- `elise_break_dismissed_v1` — today's break-reminder dismissal

IndexedDB:
- DB `elise-voice-clips` / store `clips` — parent-recorded audio blobs keyed by phrase

The cloud TTS endpoint sends only the literal text being spoken (e.g. `"A is for Apple"`) to OpenAI. No identifying child data is ever sent.

---

## Changelog

### Iteration 4 — Sung rhymes, echo fix, voice library, stories
- 3 of 4 nursery rhymes now play **actual public-domain sung recordings** (Twinkle, Old MacDonald, Baa Baa Black Sheep) proxied & cached server-side from archive.org; Sung ⇄ Spoken toggle in the UI
- **OpenAI TTS echo bug fixed** — generation counter ensures only the latest `speak()` plays; rapid taps no longer overlap
- **Custom voice library** in Settings — record (MediaRecorder) or upload MP3s for 6 preset phrases (Hi {name}, Great job!, Try again., All done!, Let's play., I love you.) + arbitrary custom phrases. Stored in IndexedDB. `speak()` checks here first.
- **Read me a story** mode — new `/stories` route with 5 hand-written 6-line illustrated stories, each with a unique pastel colorway, narrated in the parent's chosen voice
- New "Story Time" sticker
- Backend: `/api/audio/rhymes`, `/api/audio/rhyme/{slug}`, `/api/stories`, `/api/stories/{id}`

### Iteration 3 — Cloud voices + 7 features
- Bug fix: ABC no longer says "aa, bb, cc" (single utterance "A is for Apple")
- Bug fix: Numbers no longer interrupts the last digit with "Great job!" (chained via `onend`)
- **OpenAI Cloud TTS** with 9 voices via Emergent LLM Key, audio caching, browser-TTS fallback
- **Phonics mode** for ABC
- **Letter Tracing** activity (`/trace`)
- **Numbers-into-slots puzzle** variant
- 6 more animals (14 total)
- **Custom child name** (propagates through home, dashboard, share card)
- **Daily session timer** + dismissible break reminder toast
- **Weekly highlight reel** (7-day bar chart) + Today/Week toggle on share card

### Iteration 2 — Audio + engagement
- Voice settings page (gender toggle, voice picker, rate/pitch, language, full-screen)
- Drag-and-drop Puzzle (shapes)
- Background lullaby for Rhymes (Web Audio API)
- 11 milestone Stickers
- Magic Moment share card (canvas-generated PNG)

### Iteration 1 — MVP
- 6 core activities (ABC, 123, Colors, Shapes, Animals, Rhymes)
- Parent Dashboard with stats and gear long-press

---

## Roadmap — Next Action Items

- **P0**: Cross-device sync via **Emergent Google Auth** (still deferred — playbook ready)
- **P1**: Add a 4th sung rhyme (Itsy Bitsy Spider — curate a clean public-domain recording or generate via Suno)
- **P1**: Karaoke-style word highlighting timed precisely to the recording (currently divides duration evenly across lines)
- **P2**: PWA / offline mode (cache TTS + rhyme MP3s in IndexedDB so the app works on a plane)
- **P3**: Multi-language vocab translation (apple → manzana → pomme on-screen, not just TTS lang)

### Smart enhancement idea — *"Bedtime story in your voice"*

Now that the app can capture the parent's voice for short phrases, the natural next feature is to record **a whole story in your own voice**. Imagine: a parent records one of the 5 built-in stories (paragraph-by-paragraph, the UI guides you through it), and from then on, the app plays **your** recording back to your child — perfect for nights you're traveling, or for grandparents to record a story for their grandchild from across the country.

This turns a learning app into something families actually treasure (and never delete). The entire infrastructure is already in place:

- IndexedDB clip storage (`voice-clips.js`)
- Line-by-line story player (`Stories.jsx`)
- Parent-recording UX (`VoiceLibrary.jsx`)
- Full story library + endpoints (`/api/stories`)

Estimated effort: a small new "Record this story" mode that walks parents line-by-line, saving each line under `story:<id>:<line-index>`, then a `Stories.jsx` toggle to prefer parent recordings when present. Less than a day's work.

---

## License

MIT — built with love on Emergent.
