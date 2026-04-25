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
- **Backend**: FastAPI (`/api` prefix on `:8001`) + MongoDB; emergentintegrations OpenAI TTS endpoint
- **Audio**: OpenAI TTS via Emergent LLM Key (primary) → browser `speechSynthesis` (fallback)
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

### Iteration 3 — Cloud voices + 7 next-action features (this release)
- **Numbers bug fix** — onend chaining so "Great job!" no longer cuts off the last number
- **OpenAI TTS** — `/api/tts` endpoint via Emergent LLM Key with cache + fallback. 9 voices (nova, shimmer, coral, fable, alloy, sage, ash, echo, onyx). Hybrid client-side speech.js auto-falls back to browser TTS on failure.
- **Phonics mode** — settings toggle. ABC speaks letter sounds (buh) instead of names (bee)
- **Letter Tracing** (`/trace`) — finger/mouse tracing canvas with faint guide letter, prev/next/clear/done; new "Tracer" sticker
- **More animals** — 14 total (added Horse, Frog, Bee, Owl, Monkey, Bear)
- **Numbers-into-slots puzzle variant** — Puzzle page now toggles between Shapes and Numbers
- **Custom child name** — Settings input. Home greeting & dashboard adapt; share card uses the name
- **Daily session timer + break reminder** — slider 0–60 min/day; gentle toast appears when reached, dismissible until next day
- **Weekly highlight reel** — 7-day bar chart on dashboard; Magic Moment card has Today/Week toggle that produces a Week share-card
- **README.md** at repo root with setup & Vercel instructions
- **Audio cache** — backend caches TTS bytes per (voice, speed, text); second identical request returns instantly with `X-Cache: HIT`

### Test results
- Backend: 6/6 pytest passing (health, voices list, audio bytes, cache hit, validation 400/422)
- Frontend: 100% — all routes load, all testids present, child-name personalisation works, drag-drop puzzle and tracing canvas function

## Deferred Backlog
- **P0**: Cross-device sync via Emergent Google Auth (auth flow + `/api/sync` endpoints + conflict resolution). Playbook fetched but deferred for focused iteration.
- **P1**: True multi-language vocabulary (apple → manzana → pomme on-screen)
- **P1**: Pre-recorded sung nursery rhymes (vs. current TTS-spoken with Web-Audio bed)
- **P2**: Toddler avatar selection
- **P2**: More puzzle variants (animal-into-habitat)
- **P3**: PWA / offline mode (cache audio MP3s)

## Operational notes
- `EMERGENT_LLM_KEY` lives in `/app/backend/.env`. If the key budget is depleted, cloud TTS gracefully returns 503 and the frontend falls back to browser voices.
- Backend cache is in-process (256 entries, FIFO). For multi-instance deploys, consider Redis.
