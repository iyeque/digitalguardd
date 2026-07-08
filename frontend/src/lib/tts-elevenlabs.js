// ElevenLabs direct TTS — browser → ElevenLabs API.
// Requires Vercel env: REACT_APP_ELEVENLABS_API_KEY
import { getSettings } from "@/lib/voice-settings";

const ELEVENLABS_URL = 'https://api.elevenlabs.io/v1';

// Hardcoded free-tier voices (stable IDs).
export const ELEVENLABS_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel', gender: 'female' },
  { id: 'MF3mGyEYCl7XYWbV9le6', label: 'Elli',    gender: 'female' },
  { id: 'A9eBb3SmBTo2Sw2YPaBv', label: 'Domi',    gender: 'female' },
  { id: 'XB0fDUnXU5powFXDhCwa', label: 'Bella',   gender: 'female' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', label: 'Josh',    gender: 'male' },
  { id: 'VR6AewLTigWG4xSOukGm', label: 'Arnold',  gender: 'male' },
  { id: 'pF6Hp6k9yOQ7ODjDHPfR', label: 'Adam',    gender: 'male' },
  { id: 'rId8QAdP93N9g6lysT7H', label: 'Sam',     gender: 'male' },
];

let cache = new Map();
let currentAudio = null;
let generation = 0;

export const stopElevenAudio = () => {
  generation += 1;
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.src = ''; } catch (_) {}
    currentAudio = null;
  }
};

export const elevenSpeak = async (text, opts = {}) => {
  const settings = getSettings();
  console.log('[EL] speak request', settings.elevenlabsVoiceId, text.slice(0, 40));
  if (!settings.elevenlabsApiKey) throw new Error('missing-elevenlabs-key');
  if (!settings.elevenlabsVoiceId) throw new Error('missing-elevenlabs-voice');

  const key = `${settings.elevenlabsVoiceId}|${settings.rate || 1.0}|${text}`;
  if (cache.has(key)) {
    const url = cache.get(key);
    return playBlobUrl(url, opts);
  }

  const myGen = ++generation;
  const r = await fetch(`${ELEVENLABS_URL}/text-to-speech/${settings.elevenlabsVoiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': settings.elevenlabsApiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    console.error('[EL] failed', settings.elevenlabsVoiceId, r.status, t);
    throw new Error(`ElevenLabs ${r.status}: ${t}`);
  }

  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  cache.set(key, url);
  if (cache.size > 60) {
    const first = cache.keys().next().value;
    URL.revokeObjectURL(cache.get(first));
    cache.delete(first);
  }
  if (myGen !== generation) { URL.revokeObjectURL(url); return; }
  return playBlobUrl(url, opts);
};

const playBlobUrl = (url, opts = {}) => new Promise((resolve, reject) => {
  const audio = new Audio(url);
  audio.volume = (opts.volume ?? 1);
  const onEnd = () => { if (currentAudio === audio) currentAudio = null; if (opts.onend) opts.onend(); resolve(); };
  audio.onended = onEnd;
  audio.onerror = (e) => { if (currentAudio === audio) currentAudio = null; reject(e); };
  currentAudio = audio;
  audio.play().catch(reject);
});
