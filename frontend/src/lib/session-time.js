// Daily session-time tracking. Records seconds played per UTC day.
const KEY = "elise_daily_v1";

const today = () => new Date().toISOString().slice(0, 10);

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { day: today(), seconds: 0, lastPing: 0, history: {} };
    const o = JSON.parse(raw);
    if (!o.history) o.history = {};
    if (o.day !== today()) {
      // roll over
      if (o.day && o.seconds) o.history[o.day] = (o.history[o.day] || 0) + o.seconds;
      o.day = today();
      o.seconds = 0;
      o.lastPing = 0;
    }
    return o;
  } catch (_) {
    return { day: today(), seconds: 0, lastPing: 0, history: {} };
  }
};

const write = (o) => {
  try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (_) {}
};

let pingTimer = null;

export const startSessionTimer = () => {
  if (pingTimer) return;
  let lastTick = Date.now();
  pingTimer = setInterval(() => {
    if (document.hidden) { lastTick = Date.now(); return; }
    const now = Date.now();
    const delta = Math.min(20, Math.floor((now - lastTick) / 1000));
    lastTick = now;
    if (delta <= 0) return;
    const o = read();
    o.seconds += delta;
    o.lastPing = now;
    write(o);
  }, 5000);
};

export const stopSessionTimer = () => {
  if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
};

export const getTodaySeconds = () => read().seconds;

export const getHistory = () => {
  const o = read();
  // Include today's running seconds
  return { ...o.history, [o.day]: o.seconds };
};

export const getWeeklySeconds = () => {
  const hist = getHistory();
  const out = [];
  const t = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, label: d.toLocaleDateString(undefined, { weekday: 'short' }), seconds: hist[key] || 0 });
  }
  return out;
};
