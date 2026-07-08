import { getSettings, inferGender } from "@/lib/voice-settings";
import { cloudSpeak, stopCloudAudio, warmCloud } from "@/lib/tts-client";
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
  // invalidate if voices changed or settings changed
  const sv = settings.voiceURI || settings.gender || settings.lang || "";
  if (cachedVoiceVersion !== voicesVersion || cachedVoiceVersion !== settings.__v) {
    cachedVoice = pickVoice(settings);
    cachedVoiceVersion = settings.__v;
  }
  return cachedVoice;
};

// Warm the browser synthesis engine once.
// Some browsers (Chrome) have extra latency on the first speak().
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
    window.speechSynthesis.cancel();
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
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
  stopCloudAudio();
  stopCustom();
};

let speakDebounce = null;
const SPEAK_DEBOUNCE_MS = 60;

export const speak = async (text, opts = {}) => {
  stopSpeech();
  warmBrowserTts();

  // Custom voice clip wins if available for ACTIVE PROFILE
  try {
    const { activeProfile = "Mom" } = getSettings();
    const scopedKey = `user:${activeProfile.toLowerCase()}:${text.toLowerCase()}`;
    const played = await tryPlayCustom(scopedKey, opts);
    if (played) return;
  } catch (_) {}

  // Cloud TTS (Piper Backend)
  if (getSettings().useCloudTts) {
    cloudSpeak(text, opts).catch(() => browserSpeak(text, opts));
    return;
  }

  // Debounce rapid taps so we don’t cancel storms
  if (speakDebounce) clearTimeout(speakDebounce);
  speakDebounce = setTimeout(() => browserSpeak(text, opts), SPEAK_DEBOUNCE_MS);
};

export const sayTest = () => {
  const s = getSettings();
  const txt = `Hi ${s.childName || "friend"}! I'm your reading buddy. Let's learn together.`;
  // Attach a small settings version sticker so voice cache stays valid
  s.__v = (s.__v || 0) + 1;
  speak(txt);
};
