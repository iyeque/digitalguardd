# Elise Learns – PRD

## Original Problem Statement
"an edtech site for a 2 year old starting to learn"

## App Name
Elise Learns

## User Persona
- **Primary user**: 2-year-old toddler — taps, drags, traces, listens
- **Secondary user**: Parent supervising and occasionally reviewing/sharing progress

## Design Direction
- Soft pastel, Montessori-inspired "wooden block" aesthetic
- Fonts: Fredoka (display) + Nunito (body)
- Big tap targets (≥80px), chunky bottom shadows, rounded corners
- Calm, non-overstimulating; staggered spring entrance animations

## Architecture
- **Frontend**: React 19 SPA (CRACO + react-router-dom v7), TailwindCSS, shadcn UI, lucide-react
- **Backend**: FastAPI (`/api` prefix on `:8001`) + MongoDB; Piper TTS endpoint
- **Audio**: Piper (Local AI Engine) → System Fallback
- **State**: localStorage — `elise_learns_progress_v1` (progress), `elise_voice_settings_v1` (voice/UI prefs), `elise_daily_v1` (session-time history), `elise_break_dismissed_v1` (today's reminder dismissal)

## Implemented (Feb 2026)

### Iteration 1 — MVP
- 6 core activities (ABC, 123, Colors, Shapes, Animals, Rhymes), Parent Dashboard with stats, hidden gear long-press

### Iteration 2 — Audio + engagement
- Voice settings page (gender toggle, voice picker, rate/pitch sliders, language, full-screen mode)
- Drag-and-drop Puzzle (shapes)
- Background lullaby for Rhymes (Web Audio API)
- 11 milestone Stickers
- Magic-Moment share card (canvas-generated PNG)

### Iteration 3 — Cloud voices + 7 next-action features
- **Numbers bug fix** — onend chaining so "Great job!" no longer cuts off the last number
- **Phonics mode** — settings toggle. ABC speaks letter sounds (buh) instead of names (bee)
- **Letter Tracing** (`/trace`) — finger/mouse tracing canvas with faint guide letter, prev/next/clear/done; new "Tracer" sticker
- **Custom child name** — Settings input. Home greeting & dashboard adapt; share card uses the name
- **Daily session timer + break reminder** — slider 0–60 min/day; gentle toast appears when reached, dismissible until next day
- **Weekly highlight reel** — 7-day bar chart on dashboard; Magic Moment card has Today/Week toggle that produces a Week share-card

### Iteration 4 — Sung rhymes, echo fix, voice library, stories
- **Real sung nursery rhymes** — All 4 rhymes (Twinkle, Old MacDonald, Baa Baa Black Sheep, and Itsy Bitsy Spider) now play actual public-domain recordings, fetched from archive.org and cached server-side. UI lets parent toggle Sung ⇄ Spoken.
- **Custom voice library** — Parents can record (MediaRecorder) or upload audio for 6 preset phrases ("Hi {name}", "Great job!", "Try again.", "All done!", "Let's play.", "I love you."), plus arbitrary custom phrases. Stored in IndexedDB. `speak()` checks the library first and plays the parent's voice when text matches.
- **Read me a story** mode — new `/stories` route with 5 hand-written 6-line illustrated stories. Each story has a unique pastel colorway. New "Story Time" sticker.

### Iteration 5 — Personalization
- **Toddler Avatar Selection** — Parents can choose from 8 friendly animal avatars (Rabbit, Panda, Cat, Dog, Lion, Fox, Monkey, Bear) in Settings.
- **Home Screen Greeting** — The chosen avatar is displayed on the home screen next to the personalized greeting.

### Iteration 6 — High-Performance AI Engine (this release)
- **Piper TTS Integration** — Replaced experimental voice engines with the industry-standard `Piper` TTS engine. Provides stable, high-fidelity, on-device voice synthesis generated entirely on the server.
- **Robust Audio Pipeline** — Implemented a professional-grade audio hierarchy: `Custom Recordings (Tier 1)` → `Piper Backend (Tier 2/3)` → `System Fallback (Tier 4)`.
- **System Cleanup** — Removed all platform-specific branding ("Emergent") and redundant browser-side AI dependencies (`local-tts.js`).
- **Reliability** — Added automated model loading logic for stable voice delivery.
- **Stability** — Resolved all type-checking and runtime errors, resulting in a production-ready clean build.

### Test results
- Backend: 6/6 pytest passing; robust API error handling.
- Frontend: 100% stable; all console warnings and hydration errors resolved.

## Deferred Backlog
- **P0**: Cross-device sync (auth flow + `/api/sync` endpoints + conflict resolution).
- **P1**: True multi-language vocabulary (apple → manzana → pomme on-screen)
- **P2**: More puzzle variants (animal-into-habitat)
- **P3**: PWA / offline mode (cache audio MP3s)

## Operational notes
- `OPENAI_API_KEY` (if used for future Cloud fallback) and `MONGO_URL` live in `/backend/.env`.
- `Piper` engine initializes on startup; backend acts as the single source of truth for high-quality audio.
