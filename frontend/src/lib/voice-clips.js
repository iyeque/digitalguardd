// Custom voice library — parents can record or upload audio clips that
// override the TTS for specific phrases. Stored in IndexedDB (handles blobs).

const DB_NAME = "elise-voice-clips";
const STORE = "clips";

let dbPromise = null;

const openDB = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "phrase" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
};

const tx = async (mode) => {
  const db = await openDB();
  return db.transaction(STORE, mode).objectStore(STORE);
};

const norm = (s) => (s || "").trim().toLowerCase();

export const saveClip = async (phrase, blob, label = "") => {
  const store = await tx("readwrite");
  return new Promise((resolve, reject) => {
    const req = store.put({
      phrase: norm(phrase),
      label: label || phrase,
      blob,
      createdAt: Date.now(),
    });
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
};

// Story specific recordings use key "story:{profileId}:{storyId}:{idx}"
export const saveStoryClip = async (profileId, storyId, lineIdx, blob) => {
  return saveClip(`story:${profileId}:${storyId}:${lineIdx}`, blob, `Story ${storyId} Line ${lineIdx} (${profileId})`);
};

export const getClipBlob = async (phrase) => {
  try {
    const store = await tx("readonly");
    return new Promise((resolve) => {
      const req = store.get(norm(phrase));
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => resolve(null);
    });
  } catch (_) { return null; }
};

export const getStoryClipBlob = async (profileId, storyId, lineIdx) => {
  return getClipBlob(`story:${profileId}:${storyId}:${lineIdx}`);
};

export const listClips = async () => {
  try {
    const store = await tx("readonly");
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const out = (req.result || []).map(({ phrase, label, createdAt }) => ({ phrase, label, createdAt }));
        resolve(out);
      };
      req.onerror = () => resolve([]);
    });
  } catch (_) { return []; }
};

export const deleteClip = async (phrase) => {
  const store = await tx("readwrite");
  return new Promise((resolve) => {
    const req = store.delete(norm(phrase));
    req.onsuccess = () => resolve(true);
    req.onerror = () => resolve(false);
  });
};

// Plays a custom clip if one exists for `text`; returns true if played.
let currentCustom = null;
export const tryPlayCustom = async (text, opts = {}) => {
  const blob = await getClipBlob(text);
  if (!blob) return false;
  return playBlob(blob, opts);
};

export const tryPlayStoryClip = async (profileId, storyId, lineIdx, opts = {}) => {
  const blob = await getStoryClipBlob(profileId, storyId, lineIdx);
  if (!blob) return false;
  return playBlob(blob, opts);
};

const playBlob = async (blob, opts = {}) => {
  if (currentCustom) { try { currentCustom.pause(); } catch (_) {} }
  return await new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = opts.volume ?? 1;
    audio.onended = () => { URL.revokeObjectURL(url); if (opts.onend) opts.onend(); resolve(true); };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(false); };
    currentCustom = audio;
    audio.play().then(() => {}).catch(() => resolve(false));
  });
};

export const stopCustom = () => {
  if (currentCustom) { try { currentCustom.pause(); } catch (_) {} currentCustom = null; }
};
