import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { COLORS } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";

export default function Colors() {
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState("explore"); // explore | challenge
  const [target, setTarget] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { trackOpen("colors"); }, []);

  const startChallenge = () => {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTarget(c);
    setFeedback(null);
    speak(`Find the ${c.name}!`);
  };

  useEffect(() => {
    if (mode === "challenge" && target) {
      const t = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(t);
    }
  }, [mode, target, feedback]);

  const onTap = (c) => {
    setActive(c.name);
    trackTap("colors");

    if (mode === "explore") {
      speak(`${c.name}.`);
      setTimeout(() => setActive(null), 800);
      return;
    }

    if (mode === "challenge" && target) {
      if (c.name === target.name) {
        setFeedback("correct");
        speak("Yay!");
        setTimeout(() => {
          setFeedback(null);
          setTarget(null);
          startChallenge();
        }, 1500);
      } else {
        setFeedback("wrong");
        speak(`Not this one. Find the ${target.name}!`);
      }
    }
  };

  const toggleMode = () => {
    if (mode === "explore") {
      setMode("challenge");
      startChallenge();
      speak("Find the color I say!");
    } else {
      setMode("explore");
      setTarget(null);
      setFeedback(null);
    }
  };

  return (
    <Layout title="Colors">
      <section className="max-w-5xl mx-auto">
        <p className="text-center text-lg sm:text-xl text-[#8A817C] font-semibold mb-6">
          {mode === "challenge" && target
            ? `Find the ${target.name}!`
            : "Tap each block to hear its color."}
        </p>

        <div className="flex justify-center mb-6 gap-3">
          <button
            onClick={() => setMode("explore")}
            data-testid="colors-mode-explore"
            className={`wood-press rounded-full px-5 py-2 font-bold text-sm ${mode === "explore" ? "wood-card-sage text-white" : "wood-card text-[#5A524D]"}`}
          >
            Explore
          </button>
          <button
            onClick={toggleMode}
            data-testid="colors-mode-challenge"
            className={`wood-press rounded-full px-5 py-2 font-bold text-sm ${mode === "challenge" ? "wood-card-coral text-white" : "wood-card text-[#5A524D]"}`}
          >
            Find the color!
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8" data-testid="colors-grid">
          {COLORS.map((c, idx) => {
            const isTarget = target && target.name === c.name;
            return (
              <button
                key={c.name}
                onClick={() => onTap(c)}
                data-testid={`color-${c.name.toLowerCase()}`}
                className={`wood-press animate-rise rounded-[2rem] flex items-center justify-center text-white font-display font-bold text-2xl sm:text-3xl transition ${active === c.name ? 'animate-wiggle' : ''} ${feedback === "correct" && isTarget ? 'animate-pulse' : ''}`}
                style={{ ...(isTarget && mode === "challenge" ? { boxShadow: `0 0 0 6px #F2CA7E, 0 8px 0 0 ${c.border}` } : {}), ...(feedback === "wrong" && active === c.name ? { opacity: 0.6 } : {}), background: c.hex, border: `2px solid ${c.border}`, minHeight: 160, animationDelay: `${idx * 70}ms` }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        {feedback === "correct" && (
          <p className="text-center mt-4 text-[#9CBFA7] font-display font-bold text-xl">Amazing!</p>
        )}
      </section>
    </Layout>
  );
}
