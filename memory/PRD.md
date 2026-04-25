# Elise Learns – PRD

## Original Problem Statement
"an edtech site for a 2 year old starting to learn"

## App Name
Elise Learns

## User Persona
- **Primary user**: 2-year-old toddler ("Elise") - taps, drags, watches, listens
- **Secondary user**: Parent supervising and occasionally checking progress / sharing moments

## Design Direction
- Soft pastel, Montessori-inspired "wooden block" aesthetic
- Fonts: Fredoka (display) + Nunito (body)
- Big tap targets (≥80px), chunky bottom shadows, rounded corners
- Calm, non-overstimulating; no jarring gradients/sounds
- Staggered spring entrance animations, gentle wiggle/pop interactions

## Architecture
- **Frontend**: React 19 SPA (CRACO + react-router-dom v7), TailwindCSS, shadcn UI, lucide-react
- **Backend**: FastAPI (`/api` prefix on `:8001`) + MongoDB — currently unused; app runs entirely client-side
- **Audio**: `window.speechSynthesis` for narration; Web Audio API for background lullaby
- **State**: localStorage — `elise_learns_progress_v1` (progress) + `elise_voice_settings_v1` (voice prefs)

## Implemented (Feb 2026)

### Iteration 1 — MVP
- **Home** (`/`) – greeting + bento grid of activity cards (sage/mustard/coral/blue/pink wooden blocks)
- **ABC** (`/abc`) – flashcards A→Z with TTS, prev/next nav, color-cycling cards
- **123** (`/123`) – number selector (1–10) + apple-counting taps with verbal feedback
- **Colors** (`/colors`) – 6 color blocks; tap to hear name
- **Shapes** (`/shapes`) – "Find the X" matching mini-game
- **Animals** (`/animals`) – 8 animals with custom Montessori art for Lion/Elephant/Pig
- **Rhymes** (`/rhymes`) – 4 nursery rhymes with line-by-line spoken playback
- **Parent Dashboard** (`/parent`) – stats, per-activity breakdown, hidden via 1.5s long-press of gear

### Iteration 2 — Audio + Engagement features (this release)
- **Voice settings** (`/parent/settings`):
  - Female / Male voice quick toggle (heuristic-based gender detection across system voices)
  - Specific voice picker (lists all device voices filtered by language)
  - Talking-speed slider (0.6×–1.2×) and pitch slider (0.8–1.4)
  - Language toggle: English / Español / Français (changes TTS lang only)
  - "Test voice" button + Reset to defaults
  - Settings persist in localStorage and apply globally
- **Background music for Rhymes**: gentle synthesized lullaby via Web Audio API (no external assets); toggled from Settings
- **Drag-and-drop Puzzle** (`/puzzle`): 3-shape puzzle round; pointer/touch dragging; correct slots fill with shape color; "All done!" with reset to new round
- **Achievements / Stickers**: 11 stickers tied to taps, activity counts, and "all-rounder" milestone; unearned stickers shown desaturated; live counter ("X of 11")
- **Magic Moment share card**: 1080×1080 canvas-generated PNG with stats, activities, and pretty pastel design — share via Web Share API (with file) or download fallback
- **Toddler-safe mode**: full-screen + landscape orientation lock button (where supported)

## Deferred Backlog
- **P1**: True multi-language vocabulary (currently only TTS lang switches; on-screen words stay English)
- **P2**: Pre-recorded sung nursery rhymes (currently TTS-spoken with Web-Audio melody bed)
- **P2**: Cloud sync of progress + cross-device login (Emergent Auth)
- **P3**: Custom child name / avatar (currently hard-coded to "Elise")
- **P3**: Parent-set daily session timer / break reminders
- **P3**: Add more puzzle variations (number-into-slot, animal-into-habitat)

## Known caveats
- TTS quality depends entirely on the device's installed voices. Headless/incognito browsers may have very limited voice options.
- iOS Safari requires a user gesture before any first audio playback (handled by the user tapping a card).
- Web Audio API for background music is initialized lazily on user interaction.
