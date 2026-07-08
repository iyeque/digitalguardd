import { getSettings, inferGender } from "@/lib/voice-settings";
import { cloudSpeak, stopCloudAudio, warmCloud } from "@/lib/tts-client";
import { elevenSpeak, stopElevenAudio } from "@/lib/tts-elevenlabs";
import { tryPlayCustom, stopCustom } from "@/lib/voice-clips";

let voicesCache = null;
let voicesVersion = 0;
let voicesDirty = true;

const ensureVoices = () => {
  if (!("speechSynthesis" in window)) return [];
  if (voicesDirty || !voicesCache) {
    voicesCache = window.speechSynthesis.getVoices() || [];
    voicesDirty = false;
  }
  return voicesCache;
};

if ("speechSynthesis" in window) {
  ensureVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    voicesVersion += 1;
    voicesDirty = true;
  };
}

let selectedVoice = null;
let selectedVoiceSettingsVersion = -1;

const pickVoice = (settings) => {
  const voices = ensureVoices();
  if (!voices.length) return null;

  if (settings.voiceURI) {
    const v = voices.find((x) => x.voiceURI === settings.voiceURI);
    if (v) return v;
  }

  const langPrefix = (settings.lang || "en").split("-")[0];
  const sameLang = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  const pool = sameLang.length ? sameLang : voices;

  const isPremium = (v) => /premium|enhanced|natural|neural|online|google.*natural/i.test(v.name);

  if (settings.gender && settings.gender !== "auto") {
    const genderMatches = pool.filter((v) => inferGender(v) === settings.gender);
    if (genderMatches.length) {
      const premium = genderMatches.find(isPremium);
      return premium || genderMatches[0];
    }
  }

  const premium = pool.find(isPremium);
  const friendly = pool.find((v) => /samantha|karen|moira|daniel|alex/i.test(v.name));
  return premium || friendly || pool[0];
};

let cachedVoice = null;
let cachedVoiceVersion = -1;

const getCachedVoice = (settings) => {
  const sv = settings.voiceURI || settings.gender || settings.lang || "";
  if (cachedVoiceVersion !== voicesVersion || cachedVoiceVersion !== settings.__v) {
    cachedVoice = pickVoice(settings);
    cachedVoiceVersion = settings.__v;
  }
  return cachedVoice;
};

let warmedUp = false;
const warmBrowserTts = () => {
  if (warmedUp || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance("");
    u.volume = 0;
    window.speechSynthesis.speak(u);
    warmedUp = true;
  } catch (_) {}
};

const browserSpeak = (text, opts = {}) => {
  if (!("speechSynthesis" in window)) return;
  try {
    const settings = getSettings();
    const u = new SpeechSynthesisUtterance(text);
    const v = getCachedVoice(settings);
    if (v) u.voice = v;
    u.rate = opts?.rate ?? settings.rate;
    u.pitch = opts?.pitch ?? settings.pitch;
    u.volume = opts?.volume ?? settings.volume;
    u.lang = settings.lang || "en-US";
    if (opts?.onend) u.onend = opts.onend;
    window.speechSynthesis.speak(u);
  } catch (_) {}
};

export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch (_) {}
  }
  stopCloudAudio();
  stopElevenAudio();
  stopCustom();
};

// Simple queue: speak() returns a promise that resolves when this utterance finishes.
// Concurrent calls are serialized so nothing cuts off mid-sentence.
let queue = Promise.resolve();
const SPEAK_DEBOUNCE_MS = 180;

export const speak = async (text, opts = {}) => {
  // Custom voice clip wins if available for ACTIVE PROFILE
  try {
    const { activeProfile = "Mom" } = getSettings();
    const scopedKey = `user:${activeProfile.toLowerCase()}:${text.toLowerCase()}`;
    const played = await tryPlayCustom(scopedKey, opts);
    if (played) return;
  } catch (_) {}

  // Queue the utterance so rapid taps don't cancel each other
  queue = queue.then(async () => {
    await new Promise(r => setTimeout(r, SPEAK_DEBOUNCE_MS));
    stopCustom();
    // Only stop cloud/browser audio if this is a new generation (handled inside providers)
    const settings = getSettings();
    if (settings.useCloudTts && (settings.cloudProvider === 'openai')) {
      try {
        await cloudSpeak(text, opts);
        return;
      } catch (_) { /* fall through */ }
    }
    if (settings.useCloudTts && (settings.cloudProvider === 'elevenlabs')) {
      try {
        await elevenSpeak(text, opts);
        return;
      } catch (_) { /* fall through */ }
    }
    browserSpeak(text, opts);
  });
  return queue;
};

export const sayTest = () => {
  const s = getSettings();
  const txt = `Hi ${s.childName || "friend"}! I'm your reading buddy. Let's learn together.`;
  s.__v = (s.__v || 0) + 1;
  speak(txt);
};
