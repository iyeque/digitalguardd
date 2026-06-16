import { getSettings, inferGender } from "@/lib/voice-settings";
import { cloudSpeak, stopCloudAudio, warmCloud } from "@/lib/tts-client";
import { tryPlayCustom, stopCustom } from "@/lib/voice-clips";

let voicesCache = null;

const ensureVoices = () => {
  if (!('speechSynthesis' in window)) return [];
  voicesCache = window.speechSynthesis.getVoices() || [];
  return voicesCache;
};

if ('speechSynthesis' in window) {
  ensureVoices();
  window.speechSynthesis.onvoiceschanged = () => { voicesCache = window.speechSynthesis.getVoices(); };
}

warmCloud();

const pickVoice = (settings) => {
  const voices = ensureVoices();
  if (!voices.length) return null;
  
  if (settings.voiceURI) {
    const v = voices.find(x => x.voiceURI === settings.voiceURI);
    if (v) return v;
  }
  
  const langPrefix = (settings.lang || 'en').split('-')[0];
  const sameLang = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  const pool = sameLang.length ? sameLang : voices;
  
  // Prioritize "Premium", "Neural", "Natural" or Online voices
  const isPremium = (v) => /premium|enhanced|natural|neural|online|google.*natural/i.test(v.name);
  
  if (settings.gender && settings.gender !== 'auto') {
    const genderMatches = pool.filter(v => inferGender(v) === settings.gender);
    if (genderMatches.length) {
      const premium = genderMatches.find(isPremium);
      return premium || genderMatches[0];
    }
  }
  
  const premium = pool.find(isPremium);
  const friendly = pool.find(v => /samantha|karen|moira|daniel|alex/i.test(v.name));
  
  return premium || friendly || pool[0];
};

const browserSpeak = (text, opts) => {
  if (!('speechSynthesis' in window)) return;
  try {
    const settings = getSettings();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(settings);
    if (v) u.voice = v;
    u.rate = opts?.rate ?? settings.rate;
    u.pitch = opts?.pitch ?? settings.pitch;
    u.volume = opts?.volume ?? settings.volume;
    u.lang = settings.lang || 'en-US';
    if (opts?.onend) u.onend = opts.onend;
    window.speechSynthesis.speak(u);
  } catch (_) {}
};

// Stop everything that could be playing
export const stopSpeech = () => {
  if ('speechSynthesis' in window) { try { window.speechSynthesis.cancel(); } catch (_) {} }
  stopCloudAudio();
  stopCustom();
};

export const speak = async (text, opts = {}) => {
  stopSpeech();
  const settings = getSettings();
  
  // 1. Custom voice clip wins if available for ACTIVE PROFILE
  try {
    const profileId = settings.activeProfile || 'Mom';
    const scopedKey = `user:${profileId.toLowerCase()}:${text.toLowerCase()}`;
    const played = await tryPlayCustom(scopedKey, opts);
    if (played) return;
  } catch (_) {}

  // 2. Cloud TTS (Piper Backend)
  if (settings.useCloudTts) {
    cloudSpeak(text, opts).catch(() => browserSpeak(text, opts));
    return;
  }

  // 3. Optimized Browser TTS fallback
  browserSpeak(text, opts);
};

export const sayTest = () => {
  const s = getSettings();
  speak(`Hi ${s.childName || "friend"}! I'm your reading buddy. Let's learn together.`);
};
