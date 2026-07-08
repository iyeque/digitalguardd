// Hybrid TTS client: cloud (OpenAI via /api/tts) with browser-TTS fallback.
// Generation-tracked to prevent overlapping/echo when many calls fire fast.
import { getSettings } from "@/lib/voice-settings";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8001`;
const API = `${BACKEND_URL}/api`;

const audioCache = new Map();   // key -> blob URL
let currentAudio = null;
let generation = 0;             // increments on every speak; only newest plays
let backendAvailable = null;

const cacheKey = (text, voice, speed) => `${voice}|${speed}|${text}`;
const setBackendAvailable = (v) => { backendAvailable = v; };
export const isCloudTtsAvailable = () => backendAvailable !== false;

export const stopCloudAudio = () => {
  generation += 1; // invalidate any in-flight requests
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.src = ''; } catch (_) {}
    currentAudio = null;
  }
};

const fetchAudio = async (text, voice, speed) => {
  const k = cacheKey(text, voice, speed);
  if (audioCache.has(k)) return audioCache.get(k);
  const r = await fetch(`${API}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, speed }),
  });
  if (!r.ok) throw new Error(`TTS ${r.status}`);
  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  audioCache.set(k, url);
  if (audioCache.size > 80) {
    const firstKey = audioCache.keys().next().value;
    URL.revokeObjectURL(audioCache.get(firstKey));
    audioCache.delete(firstKey);
  }
  return url;
};

export const cloudSpeak = async (text, opts = {}) => {
  const settings = getSettings();
  if (!settings.useCloudTts) throw new Error('cloud-tts-disabled');

  // Bump generation; keep our token
  stopCloudAudio();
  const myGen = ++generation;

  let url;
  try {
    url = await fetchAudio(text, settings.cloudVoice || 'nova', settings.rate || 1.0);
    setBackendAvailable(true);
  } catch (err) {
    setBackendAvailable(false);
    throw err;
  }

  // If a newer speak() came in while we were fetching, abandon
  if (myGen !== generation) return;

  return await new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.volume = settings.volume ?? 1;
    const onEnd = () => {
      if (currentAudio === audio) currentAudio = null;
      if (opts.onend) opts.onend();
      resolve();
    };
    audio.onended = onEnd;
    audio.onerror = (e) => { if (currentAudio === audio) currentAudio = null; reject(e); };
    currentAudio = audio;
    audio.play().catch(reject);
  });
};

let warmInit = false;

const lazyWarm = () => {
  if (warmInit) return;
  warmInit = true;
  warmCloud().catch(() => {});
};

export const warmCloud = async () => {
  try {
    const r = await fetch(`${API}/health`);
    if (r.ok) {
      const j = await r.json();
      setBackendAvailable(!!j.tts);
    }
  } catch (_) {
    setBackendAvailable(false);
  }
  return backendAvailable;
};

export const ensureBackendWarmed = () => lazyWarm();
