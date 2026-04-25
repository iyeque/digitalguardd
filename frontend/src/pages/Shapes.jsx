import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { SHAPES } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { Circle, Square, Triangle, Star, Heart, Hexagon, Check } from "lucide-react";

const ICONS = { Circle, Square, Triangle, Star, Heart, Hexagon };
const COLORS = ["#9CBFA7", "#F2CA7E", "#E89D8A", "#A1BCE3", "#F0B8C6", "#C4B0DD"];

const pickShape = (excludeIdx) => {
  let i;
  do { i = Math.floor(Math.random() * SHAPES.length); } while (i === excludeIdx);
  return i;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Shapes() {
  const [targetIdx, setTargetIdx] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [round, setRound] = useState(0);

  useEffect(() => { trackOpen("shapes"); }, []);
  useEffect(() => {
    speak(`Find the ${SHAPES[targetIdx]}.`);
  }, [targetIdx]);

  const options = useMemo(() => {
    const distractor1 = pickShape(targetIdx);
    const distractor2 = pickShape(distractor1 === targetIdx ? (targetIdx + 1) % SHAPES.length : distractor1);
    let pool = [targetIdx, distractor1, distractor2];
    while (new Set(pool).size < 3) {
      pool = [targetIdx, pickShape(targetIdx), pickShape(targetIdx)];
    }
    return shuffle(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIdx, round]);

  const onTap = (i) => {
    trackTap("shapes");
    if (i === targetIdx) {
      setFeedback("correct");
      speak("Yes! You found it!");
      setTimeout(() => {
        setFeedback(null);
        setTargetIdx(pickShape(targetIdx));
        setRound((r) => r + 1);
      }, 1100);
    } else {
      setFeedback("wrong");
      speak(`Try again. Find the ${SHAPES[targetIdx]}.`);
      setTimeout(() => setFeedback(null), 700);
    }
  };

  return (
    <Layout title="Shapes">
      <section className="max-w-4xl mx-auto">
        <div className="wood-card animate-rise rounded-[2rem] p-8 sm:p-10 text-center mb-10">
          <div className="text-lg sm:text-xl text-[#8A817C] font-bold mb-2">Find the</div>
          <div
            className="font-display font-bold text-5xl sm:text-7xl"
            style={{ color: "#5A524D" }}
            data-testid="shape-target"
          >
            {SHAPES[targetIdx]}
          </div>
          {feedback === "correct" && (
            <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9CBFA7] text-white font-bold animate-pop">
              <Check size={20} strokeWidth={3} /> Yes!
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-5 sm:gap-8" data-testid="shape-options">
          {options.map((shapeIdx, slot) => {
            const Icon = ICONS[SHAPES[shapeIdx]];
            const color = COLORS[shapeIdx % COLORS.length];
            const isTarget = shapeIdx === targetIdx;
            return (
              <button
                key={`${round}-${slot}`}
                onClick={() => onTap(shapeIdx)}
                data-testid={`shape-option-${slot}`}
                className={`wood-card wood-press rounded-3xl flex items-center justify-center animate-rise ${feedback === "correct" && isTarget ? "animate-wiggle" : ""}`}
                style={{ minHeight: 160, animationDelay: `${slot * 80}ms` }}
              >
                <Icon size={88} strokeWidth={2.6} color={color} fill={color} fillOpacity={0.35} />
              </button>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
