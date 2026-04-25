// Browser TTS wrapper for toddler-friendly speech
let cachedVoice = null;

const pickVoice = () => {
  if (cachedVoice) return cachedVoice;
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  // Prefer female English voices that sound friendly
  const preferredNames = ['Samantha', 'Google US English', 'Karen', 'Moira', 'Tessa', 'Victoria', 'Microsoft Zira'];
  for (const name of preferredNames) {
    const v = voices.find(v => v.name.includes(name));
    if (v) { cachedVoice = v; return v; }
  }
  const en = voices.find(v => v.lang && v.lang.startsWith('en'));
  cachedVoice = en || voices[0];
  return cachedVoice;
};

if ('speechSynthesis' in window) {
  // Prime voices
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null; pickVoice(); };
}

export const speak = (text, opts = {}) => {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = opts.rate ?? 0.85;
    u.pitch = opts.pitch ?? 1.15;
    u.volume = opts.volume ?? 1;
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  } catch (_) { /* noop */ }
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};
