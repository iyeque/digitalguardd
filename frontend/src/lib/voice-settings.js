// Voice settings persisted in localStorage. Used by speech.js and Settings UI.
const KEY = 'elise_voice_settings_v1';

export const DEFAULTS = {
  voiceURI: null,        // null => auto-pick best
  gender: 'female',      // 'female' | 'male' | 'auto' — used for auto-pick
  rate: 0.9,             // 0.6 - 1.1
  pitch: 1.1,            // 0.9 - 1.3
  volume: 1,
  lang: 'en-US',
  bgMusicEnabled: false, // for rhymes page
};

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (_) { return { ...DEFAULTS }; }
};

const write = (s) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {}
};

export const getSettings = () => read();
export const updateSettings = (patch) => {
  const next = { ...read(), ...patch };
  write(next);
  // Notify listeners
  try { window.dispatchEvent(new CustomEvent('elise-voice-changed')); } catch (_) {}
  return next;
};

// Heuristic male voice detection — names commonly used across platforms
const MALE_HINTS = [
  'male', 'man', 'guy',
  'daniel', 'alex', 'fred', 'aaron', 'oliver', 'arthur', 'thomas', 'george',
  'james', 'rishi', 'david', 'mark', 'paul', 'tom', 'reed', 'eddy', 'rocko',
  'grandpa', 'jorge', 'diego', 'yannick', 'lee',
];
const FEMALE_HINTS = [
  'female', 'woman', 'girl',
  'samantha', 'karen', 'moira', 'tessa', 'victoria', 'zira', 'susan', 'allison',
  'ava', 'kate', 'serena', 'fiona', 'veena', 'rishi', 'paulina', 'monica', 'mia',
];

const looksMale = (v) => {
  const n = (v.name || '').toLowerCase();
  if (MALE_HINTS.some(h => n.includes(h))) return true;
  if (FEMALE_HINTS.some(h => n.includes(h))) return false;
  return null;
};

export const inferGender = (voice) => {
  const m = looksMale(voice);
  if (m === true) return 'male';
  if (m === false) return 'female';
  return 'unknown';
};

export const listVoices = () => {
  if (!('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.map(v => ({
    name: v.name,
    lang: v.lang,
    voiceURI: v.voiceURI,
    default: v.default,
    gender: inferGender(v),
  }));
};
