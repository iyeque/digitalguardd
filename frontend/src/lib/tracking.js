// Local-storage based progress tracking for the parent dashboard
const KEY = 'elise_learns_progress_v1';

const empty = () => ({
  activities: {},        // { alphabet: { opens: 0, taps: 0, lastVisit: iso } }
  totalTaps: 0,
  startedAt: new Date().toISOString(),
});

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    if (!parsed.activities) return empty();
    return parsed;
  } catch (_) {
    return empty();
  }
};

const write = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
};

export const trackOpen = (activityId) => {
  const data = read();
  if (!data.activities[activityId]) {
    data.activities[activityId] = { opens: 0, taps: 0, lastVisit: null };
  }
  data.activities[activityId].opens += 1;
  data.activities[activityId].lastVisit = new Date().toISOString();
  write(data);
};

export const trackTap = (activityId) => {
  const data = read();
  if (!data.activities[activityId]) {
    data.activities[activityId] = { opens: 0, taps: 0, lastVisit: null };
  }
  data.activities[activityId].taps += 1;
  data.activities[activityId].lastVisit = new Date().toISOString();
  data.totalTaps = (data.totalTaps || 0) + 1;
  write(data);
};

export const getProgress = () => read();

export const resetProgress = () => write(empty());
