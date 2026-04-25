import { getSettings, inferGender } from "@/lib/voice-settings";

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

const pickVoice = (settings) => {
  const voices = ensureVoices();
  if (!voices.length) return null;

  // Explicit selection
  if (settings.voiceURI) {
    const v = voices.find(x => x.voiceURI === settings.voiceURI);
    if (v) return v;
  }

  // Filter by language family
  const langPrefix = (settings.lang || 'en').split('-')[0];
  const sameLang = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  const pool = sameLang.length ? sameLang : voices;

  const wantedGender = settings.gender;
  if (wantedGender && wantedGender !== 'auto') {
    const matches = pool.filter(v => inferGender(v) === wantedGender);
    if (matches.length) {
      // Prefer "premium / enhanced / natural / google" voices
      const premium = matches.find(v => /premium|enhanced|natural|google/i.test(v.name));
      return premium || matches[0];
    }
  }

  // Fallback: prefer high-quality friendly voices
  const friendly = pool.find(v => /samantha|google.*english|karen|moira|daniel|alex/i.test(v.name));
  return friendly || pool[0];
};

export const speak = (text, opts = {}) => {
  if (!('speechSynthesis' in window)) return;
  try {
    const settings = getSettings();
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(settings);
    if (v) u.voice = v;
    u.rate = opts.rate ?? settings.rate;
    u.pitch = opts.pitch ?? settings.pitch;
    u.volume = opts.volume ?? settings.volume;
    u.lang = settings.lang || 'en-US';
    if (opts.onend) u.onend = opts.onend;
    window.speechSynthesis.speak(u);
  } catch (_) { /* noop */ }
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};

// Quick test for the settings page
export const sayTest = () => speak("Hi! I'm your reading buddy. Let's learn together.");
