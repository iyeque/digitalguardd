// Milestone tracker helpers — localStorage + cloud sync

import { MILESTONES, DEFAULT_MILESTONES } from "@/lib/milestones-data";

const M_KEY = "elise_milestones_v1";
const AGE_KEY = "elise_child_age_months";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
};

const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
};

export const getMilestones = () => {
  const data = read(M_KEY, null);
  if (!data || typeof data !== "object") return DEFAULT_MILESTONES();
  // merge with defaults so new milestones appear automatically
  const defaults = DEFAULT_MILESTONES();
  const merged = { ...defaults };
  for (const key of Object.keys(data)) {
    if (merged[key]) {
      merged[key] = { ...merged[key], ...data[key] };
    }
  }
  return merged;
};

export const saveMilestones = (milestones) => {
  write(M_KEY, milestones);
};

export const getChildAgeMonths = () => {
  const raw = read(AGE_KEY, 27);
  return typeof raw === "number" ? raw : 27;
};

export const setChildAgeMonths = (months) => {
  write(AGE_KEY, Math.max(12, Math.min(60, months)));
};

const API_BASE = (() => {
  try {
    // use same backend url logic as ParentSettings
    const url = new URL(window.location.href);
    if (url.hostname !== "localhost") return "https://elise-learns-backend.onrender.com/api";
  } catch (_) {}
  return "http://localhost:8001/api";
})();

export async function syncMilestones(milestones) {
  const user_id = localStorage.getItem("elise_sync_user_id") || "default";
  const res = await fetch(`${API_BASE}/milestones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-id": user_id,
    },
    body: JSON.stringify(milestones),
  });
  if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
  return res.json();
}

export async function fetchMilestones() {
  const user_id = localStorage.getItem("elise_sync_user_id") || "default";
  const res = await fetch(`${API_BASE}/milestones`, {
    headers: { "user-id": user_id },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

// Resize an image file to max dimension, return base64
export function imageFileToBase64(file, maxDim = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
