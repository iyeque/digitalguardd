# Elise Learns – PRD

## Original Problem Statement
"an edtech site for a 2 year old starting to learn"

## App Name
Elise Learns

## User Persona
- **Primary user**: 2-year-old toddler ("Elise") - taps, watches, listens
- **Secondary user**: Parent supervising the session, occasionally checking progress

## Design / UX Direction
- Soft pastel, Montessori-inspired "wooden block" aesthetic
- Fonts: Fredoka (display) + Nunito (body)
- Big tap targets (≥80px), chunky bottom shadows, rounded corners
- Calm, non-overstimulating; no jarring gradients/sounds
- Staggered spring entrance animations, gentle wiggle/pop interactions

## Core Requirements (Static)
1. Six learning activities accessible from a single home grid
2. Browser-native text-to-speech (window.speechSynthesis); no external audio APIs
3. Local-storage progress tracking (no login)
4. Hidden Parent Dashboard (long-press gear, ~1.5s)
5. Toddler-safe interactions (no destructive actions, big buttons)

## What's Been Implemented (Feb 2026)
- **Home** (`/`) – greeting + bento grid of 6 activity cards (sage/mustard/coral/blue/pink wooden blocks)
- **ABC** (`/abc`) – flashcards A→Z, tap to hear `<letter>. <letter> for <word>`. Prev/Next nav, color-cycling cards
- **123** (`/123`) – number selector (1–10) + apple-counting taps with verbal feedback
- **Colors** (`/colors`) – 6 color blocks; tap to hear name with wiggle feedback
- **Shapes** (`/shapes`) – "Find the X" matching game with 3 random options + audio cue
- **Animals** (`/animals`) – 8 animals; uses Montessori wooden-toy images for Lion/Elephant/Pig, lucide icons for the rest, speaks name + sound
- **Rhymes** (`/rhymes`) – 4 nursery rhymes with line-by-line spoken playback and visual highlighting
- **Parent Dashboard** (`/parent`) – stats (taps, activities visited, est. time), per-activity breakdown, reset button. Hidden behind 1.5s long-press of gear icon.
- Backend: minimal FastAPI passthrough (default template). No auth required by spec.

## Architecture
- **Frontend**: React 19 SPA (CRACO + react-router-dom v7), TailwindCSS, shadcn UI, lucide-react icons
- **Backend**: FastAPI on `:8001` (`/api` prefix), MongoDB (unused for this app — local storage instead)
- **Audio**: `window.speechSynthesis` (free, offline-capable on most browsers)
- **State**: localStorage key `elise_learns_progress_v1`

## Prioritized Backlog
- **P1**: Drag-and-drop puzzle module (currently shapes uses tap-matching as a simple variant)
- **P1**: Background instrumental music option for rhymes
- **P2**: Parent settings (toggle TTS voice, lock orientation)
- **P2**: Multi-language support (Spanish, French toddler vocabulary)
- **P2**: Achievements / sticker rewards screen
- **P3**: Optional cloud sync via login (Emergent Auth) for cross-device progress
