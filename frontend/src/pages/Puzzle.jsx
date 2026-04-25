import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { Circle, Square, Triangle, Star, Heart, Hexagon, Check, RefreshCw } from "lucide-react";

const SHAPES = [
  { name: "Circle",   Icon: Circle,   color: "#E89D8A" },
  { name: "Square",   Icon: Square,   color: "#F2CA7E" },
  { name: "Triangle", Icon: Triangle, color: "#9CBFA7" },
  { name: "Star",     Icon: Star,     color: "#A1BCE3" },
  { name: "Heart",    Icon: Heart,    color: "#F0B8C6" },
  { name: "Hexagon",  Icon: Hexagon,  color: "#C4B0DD" },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pickRound = () => {
  const indices = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3);
  const slotsOrder = shuffle([...indices]);
  return { piecesOrder: indices, slotsOrder };
};

export default function Puzzle() {
  const [round, setRound] = useState(pickRound());
  const [placed, setPlaced] = useState({}); // { slotIdx: pieceIdx }
  const [dragging, setDragging] = useState(null); // { pieceIdx, x, y, originX, originY }
  const [pulse, setPulse] = useState(null);
  const [done, setDone] = useState(false);
  const slotRefs = useRef({});

  useEffect(() => { trackOpen("puzzle"); speak("Drag each shape into its matching slot."); }, []);

  const remainingPieces = useMemo(() =>
    round.piecesOrder.filter(p => !Object.values(placed).includes(p)),
    [round, placed]
  );

  const startDrag = (e, pieceIdx) => {
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    setDragging({ pieceIdx, x: point.clientX, y: point.clientY });
    speak(SHAPES[pieceIdx].name);
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
      // find slot under pointer
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
          // correct
          const next = { ...placed, [hitSlotIdx]: dragging.pieceIdx };
          setPlaced(next);
          setPulse(hitSlotIdx);
          speak(`Yes! ${SHAPES[dragging.pieceIdx].name}.`);
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
  }, [dragging, placed, round]);

  const reset = () => {
    setPlaced({});
    setDone(false);
    setRound(pickRound());
    speak("New puzzle! Drag the shapes.");
  };

  return (
    <Layout title="Puzzles">
      <section className="max-w-5xl mx-auto" data-testid="puzzle-page">
        <p className="text-center text-lg sm:text-xl text-[#8A817C] font-semibold mb-8">
          Drag each shape into its matching outline.
        </p>

        {/* Slots */}
        <div className="grid grid-cols-3 gap-5 sm:gap-8 mb-12" data-testid="puzzle-slots">
          {round.slotsOrder.map((shapeIdx, slotIdx) => {
            const S = SHAPES[shapeIdx];
            const filledPiece = placed[slotIdx];
            const isDone = filledPiece !== undefined;
            return (
              <div
                key={slotIdx}
                ref={(el) => { slotRefs.current[slotIdx] = el; }}
                data-testid={`puzzle-slot-${slotIdx}`}
                className={`wood-card rounded-3xl flex items-center justify-center transition-transform ${pulse === slotIdx ? 'animate-wiggle' : ''}`}
                style={{
                  minHeight: 160,
                  background: isDone ? S.color + '22' : 'repeating-linear-gradient(45deg, #FAF6EE, #FAF6EE 10px, #F3EFE6 10px, #F3EFE6 20px)',
                  borderStyle: 'dashed',
                }}
              >
                <S.Icon
                  size={88}
                  strokeWidth={3}
                  color={isDone ? S.color : '#C8C0B5'}
                  fill={isDone ? S.color : 'transparent'}
                  fillOpacity={isDone ? 0.45 : 0}
                />
              </div>
            );
          })}
        </div>

        {/* Pieces tray */}
        <div className="wood-card rounded-3xl p-5 sm:p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-[#8A817C] mb-4 text-center">
            Pieces
          </div>
          <div className="flex justify-center flex-wrap gap-5 sm:gap-7" data-testid="puzzle-pieces">
            {remainingPieces.length === 0 ? (
              <div className="text-lg font-bold text-[#9CBFA7]">All placed!</div>
            ) : (
              remainingPieces.map((pieceIdx) => {
                const S = SHAPES[pieceIdx];
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
                      background: S.color,
                      border: `2px solid ${S.color}`,
                      boxShadow: `0 8px 0 0 ${S.color}AA`,
                      visibility: isDragging ? 'hidden' : 'visible',
                      touchAction: 'none',
                    }}
                  >
                    <S.Icon size={70} strokeWidth={3} color="#FFF" fill="#FFF" fillOpacity={0.6} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Floating dragged piece */}
        {dragging && (
          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: dragging.x - 65,
              top: dragging.y - 65,
              transform: 'rotate(-3deg)',
            }}
          >
            <div
              className="rounded-3xl flex items-center justify-center"
              style={{
                width: 130, height: 130,
                background: SHAPES[dragging.pieceIdx].color,
                border: `2px solid ${SHAPES[dragging.pieceIdx].color}`,
                boxShadow: '0 12px 24px rgba(90,82,77,0.3)',
              }}
            >
              {(() => {
                const S = SHAPES[dragging.pieceIdx];
                return <S.Icon size={70} strokeWidth={3} color="#FFF" fill="#FFF" fillOpacity={0.6} />;
              })()}
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
