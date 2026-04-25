// Hybrid TTS client: cloud (OpenAI via /api/tts) with browser-TTS fallback.
import { getSettings } from "@/lib/voice-settings";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Cache: key -> blob URL
const audioCache = new Map();
let currentAudio = null;
let backendAvailable = null; // null=unknown, true/false after first call

const cacheKey = (text, voice, speed) => `${voice}|${speed}|${text}`;

const setBackendAvailable = (v) => { backendAvailable = v; };

export const isCloudTtsAvailable = () => backendAvailable !== false;

export const stopCloudAudio = () => {
  if (currentAudio) {
    try { currentAudio.pause(); } catch (_) {}
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
  // Bound cache to ~80 items
  if (audioCache.size > 80) {
    const firstKey = audioCache.keys().next().value;
    const firstUrl = audioCache.get(firstKey);
    URL.revokeObjectURL(firstUrl);
    audioCache.delete(firstKey);
  }
  return url;
};

/**
 * Speak via cloud TTS. Returns a Promise that resolves when done (or rejects on failure).
 * Falls back to browser TTS automatically if cloud fails or is disabled.
 */
export const cloudSpeak = async (text, opts = {}) => {
  const settings = getSettings();
  if (!settings.useCloudTts) {
    throw new Error('cloud-tts-disabled');
  }
  stopCloudAudio();
  try {
    const url = await fetchAudio(text, settings.cloudVoice || 'nova', settings.rate || 1.0);
    setBackendAvailable(true);
    return await new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.volume = settings.volume ?? 1;
      audio.onended = () => { if (currentAudio === audio) currentAudio = null; if (opts.onend) opts.onend(); resolve(); };
      audio.onerror = (e) => { if (currentAudio === audio) currentAudio = null; reject(e); };
      currentAudio = audio;
      audio.play().catch(reject);
    });
  } catch (err) {
    setBackendAvailable(false);
    throw err;
  }
};

export const warmCloud = async () => {
  try {
    const r = await fetch(`${API}/health`);
    if (r.ok) {
      const j = await r.json();
      setBackendAvailable(!!j.tts);
    }
  } catch (_) { setBackendAvailable(false); }
};
