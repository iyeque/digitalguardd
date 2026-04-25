// Gentle ambient lullaby using Web Audio API. No external assets.
let ctx = null;
let masterGain = null;
let nodes = [];
let timer = null;
let running = false;

const ensureCtx = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
};

// C major lullaby pattern (do mi sol mi do mi sol high...)
const NOTES_HZ = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
};

const PATTERN = [
  ['C4', 0.6], ['E4', 0.6], ['G4', 0.6], ['E4', 0.6],
  ['F4', 0.6], ['A4', 0.6], ['G4', 1.2],
  ['D4', 0.6], ['F4', 0.6], ['A4', 0.6], ['F4', 0.6],
  ['E4', 0.6], ['G4', 0.6], ['C5', 1.2],
];

const playNote = (audioCtx, hz, dur, startAt) => {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = hz;

  // gentle ADSR
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(0.18, startAt + 0.08);
  g.gain.linearRampToValueAtTime(0.12, startAt + dur * 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);

  osc.connect(g);
  g.connect(masterGain);
  osc.start(startAt);
  osc.stop(startAt + dur + 0.05);
  nodes.push(osc, g);
};

const scheduleLoop = () => {
  if (!ctx || !running) return;
  let t = ctx.currentTime + 0.05;
  PATTERN.forEach(([note, dur]) => {
    playNote(ctx, NOTES_HZ[note], dur, t);
    t += dur;
  });
  // Schedule next loop slightly before end
  const totalMs = (t - ctx.currentTime) * 1000;
  timer = setTimeout(scheduleLoop, Math.max(500, totalMs - 200));
};

export const startBgMusic = () => {
  const audio = ensureCtx();
  if (!audio) return false;
  if (running) return true;
  running = true;
  if (!masterGain) {
    masterGain = audio.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(audio.destination);
  } else {
    masterGain.gain.cancelScheduledValues(audio.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audio.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.35, audio.currentTime + 0.4);
  }
  scheduleLoop();
  return true;
};

export const stopBgMusic = () => {
  running = false;
  if (timer) { clearTimeout(timer); timer = null; }
  if (masterGain && ctx) {
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  }
  // Disconnect oscillators a bit later
  setTimeout(() => {
    nodes.forEach(n => { try { n.disconnect(); } catch (_) {} });
    nodes = [];
  }, 600);
};

export const isBgMusicSupported = () => !!(window.AudioContext || window.webkitAudioContext);
