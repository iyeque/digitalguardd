import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { Circle, Square, Triangle, Star, Heart, Hexagon, Check, RefreshCw, Apple } from "lucide-react";

const SHAPE_DEFS = [
  { name: "Circle",   Icon: Circle,   color: "#E89D8A" },
  { name: "Square",   Icon: Square,   color: "#F2CA7E" },
  { name: "Triangle", Icon: Triangle, color: "#9CBFA7" },
  { name: "Star",     Icon: Star,     color: "#A1BCE3" },
  { name: "Heart",    Icon: Heart,    color: "#F0B8C6" },
  { name: "Hexagon",  Icon: Hexagon,  color: "#C4B0DD" },
];

const NUMBER_DEFS = [
  { name: "1", color: "#E89D8A" },
  { name: "2", color: "#F2CA7E" },
  { name: "3", color: "#9CBFA7" },
  { name: "4", color: "#A1BCE3" },
  { name: "5", color: "#F0B8C6" },
  { name: "6", color: "#C4B0DD" },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pickRound = (defs) => {
  const indices = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3);
  const slotsOrder = shuffle([...indices]);
  return { piecesOrder: indices, slotsOrder, defs };
};

export default function Puzzle() {
  const [variant, setVariant] = useState("shapes"); // 'shapes' | 'numbers'
  const defs = variant === "shapes" ? SHAPE_DEFS : NUMBER_DEFS;
  const [round, setRound] = useState(() => pickRound(defs));
  const [placed, setPlaced] = useState({});
  const [dragging, setDragging] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [done, setDone] = useState(false);
  const slotRefs = useRef({});

  useEffect(() => { trackOpen("puzzle"); speak("Drag each piece into its matching slot."); }, []);

  // When variant changes, reset
  useEffect(() => {
    setRound(pickRound(defs));
    setPlaced({});
    setDone(false);
    speak(variant === "numbers" ? "Match the numbers." : "Match the shapes.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const remainingPieces = useMemo(() =>
    round.piecesOrder.filter(p => !Object.values(placed).includes(p)),
    [round, placed]
  );

  const startDrag = (e, pieceIdx) => {
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    setDragging({ pieceIdx, x: point.clientX, y: point.clientY });
    speak(defs[pieceIdx].name);
    trackTap("puzzle");
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const point = e.touches ? e.touches[0] : e;
      setDragging(d => d ? { ...d, x: point.clientX, y: point.clientY } : d);
    };
    const end = (e) => {
      const point = (e.changedTouches ? e.changedTouches[0] : e);
      const x = point.clientX, y = point.clientY;
      let hitSlotIdx = null;
      Object.entries(slotRefs.current).forEach(([key, el]) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          hitSlotIdx = parseInt(key, 10);
        }
      });
      if (hitSlotIdx !== null) {
        const slotShape = round.slotsOrder[hitSlotIdx];
        if (slotShape === dragging.pieceIdx && placed[hitSlotIdx] === undefined) {
          const next = { ...placed, [hitSlotIdx]: dragging.pieceIdx };
          setPlaced(next);
          setPulse(hitSlotIdx);
          speak(`Yes! ${defs[dragging.pieceIdx].name}.`);
          trackTap("puzzle");
          setTimeout(() => setPulse(null), 700);
          if (Object.keys(next).length === round.slotsOrder.length) {
            setDone(true);
            setTimeout(() => speak("All done! Wonderful job!"), 800);
          }
        } else if (slotShape !== dragging.pieceIdx) {
          speak(`Try another spot.`);
        }
      }
      setDragging(null);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
  }, [dragging, placed, round, defs]);

  const reset = () => {
    setPlaced({});
    setDone(false);
    setRound(pickRound(defs));
    speak("New puzzle!");
  };

  const renderPiece = (def, opts = {}) => {
    const size = opts.size || 70;
    if (variant === "shapes") {
      const Icon = def.Icon;
      return <Icon size={size} strokeWidth={3} color="#FFF" fill="#FFF" fillOpacity={0.6} />;
    }
    return (
      <span className="font-display font-bold text-white" style={{ fontSize: size }}>
        {def.name}
      </span>
    );
  };

  const renderSlotIcon = (def, isDone) => {
    if (variant === "shapes") {
      const Icon = def.Icon;
      return <Icon size={88} strokeWidth={3} color={isDone ? def.color : '#C8C0B5'} fill={isDone ? def.color : 'transparent'} fillOpacity={isDone ? 0.45 : 0} />;
    }
    return (
      <span className="font-display font-bold" style={{ fontSize: 88, color: isDone ? def.color : '#C8C0B5', opacity: isDone ? 1 : 0.4 }}>
        {def.name}
      </span>
    );
  };

  return (
    <Layout title="Puzzles">
      <section className="max-w-5xl mx-auto" data-testid="puzzle-page">
        {/* Variant selector */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6" data-testid="puzzle-variant-toggle">
          <button
            onClick={() => setVariant("shapes")}
            data-testid="puzzle-variant-shapes"
            className={`wood-press rounded-2xl py-4 font-display font-bold text-lg ${variant === "shapes" ? 'wood-card-blue text-white' : 'wood-card text-[#5A524D]'}`}
          >
            Shapes
          </button>
          <button
            onClick={() => setVariant("numbers")}
            data-testid="puzzle-variant-numbers"
            className={`wood-press rounded-2xl py-4 font-display font-bold text-lg ${variant === "numbers" ? 'wood-card-mustard text-[#5A524D]' : 'wood-card text-[#5A524D]'}`}
          >
            Numbers
          </button>
        </div>

        <p className="text-center text-base sm:text-lg text-[#8A817C] font-semibold mb-7">
          Drag each piece into its matching outline.
        </p>

        <div className="grid grid-cols-3 gap-5 sm:gap-8 mb-12" data-testid="puzzle-slots">
          {round.slotsOrder.map((idx, slotIdx) => {
            const def = defs[idx];
            const filled = placed[slotIdx] !== undefined;
            return (
              <div
                key={slotIdx}
                ref={(el) => { slotRefs.current[slotIdx] = el; }}
                data-testid={`puzzle-slot-${slotIdx}`}
                className={`wood-card rounded-3xl flex items-center justify-center transition-transform ${pulse === slotIdx ? 'animate-wiggle' : ''}`}
                style={{
                  minHeight: 160,
                  background: filled ? def.color + '22' : 'repeating-linear-gradient(45deg, #FAF6EE, #FAF6EE 10px, #F3EFE6 10px, #F3EFE6 20px)',
                  borderStyle: 'dashed',
                }}
              >
                {renderSlotIcon(def, filled)}
              </div>
            );
          })}
        </div>

        <div className="wood-card rounded-3xl p-5 sm:p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-[#8A817C] mb-4 text-center">Pieces</div>
          <div className="flex justify-center flex-wrap gap-5 sm:gap-7" data-testid="puzzle-pieces">
            {remainingPieces.length === 0 ? (
              <div className="text-lg font-bold text-[#9CBFA7]">All placed!</div>
            ) : (
              remainingPieces.map((pieceIdx) => {
                const def = defs[pieceIdx];
                const isDragging = dragging?.pieceIdx === pieceIdx;
                return (
                  <button
                    key={pieceIdx}
                    onMouseDown={(e) => startDrag(e, pieceIdx)}
                    onTouchStart={(e) => startDrag(e, pieceIdx)}
                    data-testid={`puzzle-piece-${pieceIdx}`}
                    className="wood-press rounded-3xl flex items-center justify-center cursor-grab"
                    style={{
                      width: 130, height: 130,
                      background: def.color,
                      border: `2px solid ${def.color}`,
                      boxShadow: `0 8px 0 0 ${def.color}AA`,
                      visibility: isDragging ? 'hidden' : 'visible',
                      touchAction: 'none',
                    }}
                  >
                    {renderPiece(def)}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {dragging && (
          <div className="fixed pointer-events-none z-50" style={{ left: dragging.x - 65, top: dragging.y - 65, transform: 'rotate(-3deg)' }}>
            <div
              className="rounded-3xl flex items-center justify-center"
              style={{
                width: 130, height: 130,
                background: defs[dragging.pieceIdx].color,
                border: `2px solid ${defs[dragging.pieceIdx].color}`,
                boxShadow: '0 12px 24px rgba(90,82,77,0.3)',
              }}
            >
              {renderPiece(defs[dragging.pieceIdx])}
            </div>
          </div>
        )}

        {done && (
          <div className="mt-10 text-center animate-pop">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9CBFA7] text-white font-display font-bold text-2xl mb-5" data-testid="puzzle-done">
              <Check size={28} strokeWidth={3} /> All done!
            </div>
            <div>
              <button
                onClick={reset}
                data-testid="puzzle-reset-btn"
                className="wood-card-mustard wood-press rounded-full px-8 py-4 inline-flex items-center gap-3"
              >
                <RefreshCw size={28} strokeWidth={3} color="#5A524D" />
                <span className="font-display font-bold text-2xl text-[#5A524D]">New puzzle</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
