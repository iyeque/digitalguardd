// Sync Service: Handles pushing/pulling data between local storage/IndexedDB and the Backend.
import { getSettings, updateSettings } from "./voice-settings";
import { saveClip, listClips, getClipBlob } from "./voice-clips";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8001`;
const API = `${BACKEND_URL}/api`;

const getUserId = () => getSettings().syncId || null;

export const isSyncEnabled = () => !!getUserId();

// Convert Blob to Base64 string
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Convert Base64 string back to Blob
const base64ToBlob = async (b64, type = 'audio/ogg; codecs=opus') => {
  const res = await fetch(`data:${type};base64,${b64}`);
  return await res.blob();
};

export const pushProgress = async () => {
  const userId = getUserId();
  if (!userId) return;

  const progress = localStorage.getItem('elise_learns_progress_v1');
  const settings = localStorage.getItem('elise_voice_settings_v1');
  
  try {
    await fetch(`${API}/sync/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'user-id': userId },
      body: JSON.stringify({
        data: { progress: JSON.parse(progress), settings: JSON.parse(settings) }
      })
    });
  } catch (e) { console.error("Sync push failed", e); }
};

export const pushClips = async () => {
  const userId = getUserId();
  if (!userId) return;

  const clips = await listClips();
  for (const clip of clips) {
    const blob = await getClipBlob(clip.phrase);
    if (!blob) continue;
    
    const b64 = await blobToBase64(blob);
    try {
      await fetch(`${API}/sync/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'user-id': userId },
        body: JSON.stringify({
          phrase: clip.phrase,
          audio_base64: b64,
          label: clip.label
        })
      });
    } catch (e) { console.error(`Clip upload failed for ${clip.phrase}`, e); }
  }
};

export const pullAll = async () => {
  const userId = getUserId();
  if (!userId) return;

  try {
    // 1. Pull Progress & Settings
    const prRes = await fetch(`${API}/sync/progress`, {
      headers: { 'user-id': userId }
    });
    if (prRes.ok) {
      const data = await prRes.json();
      if (data.progress) localStorage.setItem('elise_learns_progress_v1', JSON.stringify(data.progress));
      if (data.settings) updateSettings(data.settings);
    }

    // 2. Pull Clips
    const clRes = await fetch(`${API}/sync/clips`, {
      headers: { 'user-id': userId }
    });
    if (clRes.ok) {
      const { clips } = await clRes.json();
      for (const clip of clips) {
        const blob = await base64ToBlob(clip.audio_base64);
        await saveClip(clip.phrase, blob, clip.label);
      }
    }
  } catch (e) { console.error("Sync pull failed", e); }
};
