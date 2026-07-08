import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { ALPHABET } from "@/lib/data";
import { phoneticsFor } from "@/lib/phonics";
import { getSettings } from "@/lib/voice-settings";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { ChevronLeft, ChevronRight, RefreshCw, Check, PenLine } from "lucide-react";

const PALETTES = [
  { bg: "#9CBFA7", border: "#82A88D" },
  { bg: "#F2CA7E", border: "#D9B064" },
  { bg: "#E89D8A", border: "#D1826E" },
  { bg: "#A1BCE3", border: "#89A6CF" },
  { bg: "#F0B8C6", border: "#D89AAD" },
];

export default function Trace() {
  const [idx, setIdx] = useState(0);
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const [strokes, setStrokes] = useState(0);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState("guided"); // guided | free
  const palette = PALETTES[idx % PALETTES.length];
  const letter = ALPHABET[idx];

  useEffect(() => { trackOpen("trace"); }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (mode === "guided") {
      drawGuide(ctx, rect.width, rect.height, letter.letter, palette.bg);
    } else {
      drawBlank(ctx, rect.width, rect.height, palette.bg);
    }
    setStrokes(0);
    setDone(false);
    const settings = getSettings();
    const sound = settings.phonicsMode ? phoneticsFor(letter.letter) : letter.letter;
    if (mode === "guided") {
      speak(`Trace the ${sound}.`);
    } else {
      speak("Draw anything!");
    }
  }, [idx, mode, letter.letter, palette.bg]);

  const drawGuide = (ctx, w, h, ch, color) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFCF6';
    ctx.fillRect(0, 0, w, h);
    ctx.font = `bold ${Math.min(w, h) * 0.92}px Fredoka, system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color + '33';
    ctx.fillText(ch, w / 2, h / 2 + 4);
    ctx.strokeStyle = color + '66';
    ctx.lineWidth = 3;
    ctx.strokeText(ch, w / 2, h / 2 + 4);
  };

  const drawBlank = (ctx, w, h, color) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFCF6';
    ctx.fillRect(0, 0, w, h);
  };

  const pos = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    lastRef.current = pos(e);
  };

  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const p = pos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = palette.bg;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
  };

  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setStrokes((s) => {
      const next = s + 1;
      if (next === 1) {
        trackTap("trace");
        const settings = getSettings();
        const sound = settings.phonicsMode ? phoneticsFor(letter.letter) : letter.letter;
        speak(`Lovely tracing! ${sound} for ${letter.word}.`);
      }
      if (mode === "guided" && next >= 3) {
        setTimeout(() => {
          speak("Great try! Let's do the next one.");
          setIdx((i) => (i + 1) % ALPHABET.length);
        }, 1200);
      }
      return next;
    });
  };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const rect = c.getBoundingClientRect();
    if (mode === "guided") {
      drawGuide(ctx, rect.width, rect.height, letter.letter, palette.bg);
    } else {
      drawBlank(ctx, rect.width, rect.height, palette.bg);
    }
    setStrokes(0);
    setDone(false);
  };

  const next = () => { setIdx((i) => (i + 1) % ALPHABET.length); };
  const prev = () => { setIdx((i) => (i - 1 + ALPHABET.length) % ALPHABET.length); };

  const finish = () => {
    setDone(true);
    trackTap("trace");
    speak("All done! Wonderful tracing!");
  };

  return (
    <Layout title="Tracing">
      <section className="max-w-3xl mx-auto" data-testid="trace-page">
        <p className="text-center text-base sm:text-lg text-[#8A817C] font-semibold mb-5">
          Use your finger to draw over the letter.
        </p>

        <div
          className="rounded-[2rem] mx-auto"
          style={{
            background: '#FFFCF6',
            border: `2px solid ${palette.border}`,
            boxShadow: `0 8px 0 0 ${palette.border}`,
            width: 'min(560px, 92vw)',
            height: 'min(560px, 92vw)',
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
            data-testid="trace-canvas"
            className="w-full h-full rounded-[2rem]"
            style={{ touchAction: 'none' }}
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <button
            onClick={() => setMode("guided")}
            data-testid="trace-mode-guided"
            className={`wood-press rounded-full px-4 py-2 font-bold text-sm ${mode === "guided" ? "wood-card-sage text-white" : "wood-card text-[#5A524D]"}`}
          >
            Letters
          </button>
          <button
            onClick={() => { setMode("free"); speak("Draw anything!"); }}
            data-testid="trace-mode-free"
            className={`wood-press rounded-full px-4 py-2 font-bold text-sm ${mode === "free" ? "wood-card-coral text-white" : "wood-card text-[#5A524D]"}`}
          >
            Free draw
          </button>
          <button
            onClick={clear}
            data-testid="trace-clear"
            className="wood-press wood-card rounded-full px-5 py-3 inline-flex items-center gap-2 text-[#5A524D]"
          >
            <RefreshCw size={20} strokeWidth={3} color="#5A524D" />
            <span className="font-display font-bold text-base text-[#5A524D]">Clear</span>
          </button>
          <button
            onClick={finish}
            data-testid="trace-done"
            className="wood-card-sage wood-press rounded-full px-5 py-3 inline-flex items-center gap-2"
          >
            <Check size={20} strokeWidth={3} color="#fff" />
            <span className="font-display font-bold text-base text-white">All done</span>
          </button>
          <button
            onClick={next}
            data-testid="trace-next"
            className="wood-card wood-press p-4 rounded-2xl"
            aria-label="Next letter"
          >
            <ChevronRight size={28} strokeWidth={3} color="#5A524D" />
          </button>
        </div>

        <div className="text-center mt-3 text-sm text-[#8A817C] font-bold" data-testid="trace-progress">
          {letter.letter} — {idx + 1} / 26 {done && <span className="text-[#9CBFA7]">· Done!</span>}
        </div>
      </section>
    </Layout>
  );
}
