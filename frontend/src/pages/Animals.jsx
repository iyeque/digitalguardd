import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { ANIMALS } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";

export default function Animals() {
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState("explore"); // explore | quiz
  const [quizTarget, setQuizTarget] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { trackOpen("animals"); }, []);

  const startQuiz = () => {
    const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setQuizTarget(a);
    setFeedback(null);
    speak(`What does the ${a.name} say? Find the ${a.name}!`);
  };

  useEffect(() => {
    if (mode === "quiz" && quizTarget) {
      const t = setTimeout(() => setFeedback(null), 2500);
      return () => clearTimeout(t);
    }
  }, [mode, quizTarget, feedback]);

  const onTap = (a) => {
    setActive(a.name);
    trackTap("animals");

    if (mode === "explore") {
      speak(`${a.name} says ${a.sound}!`);
      setTimeout(() => setActive(null), 1200);
      return;
    }

    if (mode === "quiz" && quizTarget) {
      if (a.name === quizTarget.name) {
        setFeedback("correct");
        speak(`Yes! The ${a.name} goes ${quizTarget.sound}!`);
        setTimeout(() => {
          setFeedback(null);
          setQuizTarget(null);
          startQuiz();
        }, 2000);
      } else {
        setFeedback("wrong");
        speak(`Not this one. What does the ${quizTarget.name} say?`);
      }
    }
  };

  const toggleMode = () => {
    if (mode === "explore") {
      setMode("quiz");
      startQuiz();
      speak("Let's play! Find the animal I name.");
    } else {
      setMode("explore");
      setQuizTarget(null);
      setFeedback(null);
    }
  };

  const shuffled = useMemo(() => {
    return [...ANIMALS].sort(() => Math.random() - 0.5);
  }, [mode]); // re-shuffle when mode changes

  return (
    <Layout title="Animals">
      <section className="max-w-5xl mx-auto">
        <p className="text-center text-lg sm:text-xl text-[#8A817C] font-semibold mb-6">
          {mode === "quiz" && quizTarget
            ? `What does the ${quizTarget.name} say?`
            : "Tap a friend to hear what they say."}
        </p>

        <div className="flex justify-center mb-6 gap-3">
          <button
            onClick={() => setMode("explore")}
            data-testid="animals-mode-explore"
            className={`wood-press rounded-full px-5 py-2 font-bold text-sm ${mode === "explore" ? "wood-card-sage text-white" : "wood-card text-[#5A524D]"}`}
          >
            Tap & hear
          </button>
          <button
            onClick={toggleMode}
            data-testid="animals-mode-quiz"
            className={`wood-press rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "wood-card-coral text-white" : "wood-card text-[#5A524D]"}`}
          >
            Find the animal!
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7" data-testid="animals-grid">
          {shuffled.map((a, idx) => {
            const isTarget = quizTarget && quizTarget.name === a.name;
            const isActive = active === a.name;
            return (
              <button
                key={a.name}
                onClick={() => onTap(a)}
                data-testid={`animal-${a.name.toLowerCase()}`}
                className={`wood-card wood-press animate-rise rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center transition-all ${isActive ? 'animate-wiggle scale-105' : ''}`}
                style={{ ...(isTarget && mode === "quiz" ? { boxShadow: `0 0 0 6px #F2CA7E, 0 8px 0 0 #D9B064` } : {}), ...(feedback === "wrong" && isActive ? { opacity: 0.6 } : {}), minHeight: 200, animationDelay: `${idx * 50}ms` }}
              >
                <div className="text-7xl sm:text-8xl mb-4 drop-shadow-sm">
                  {a.emoji}
                </div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D]">
                  {a.name}
                </div>
                {(isActive || (isTarget && mode === "quiz")) && (
                  <div className="mt-2 text-lg font-bold text-[#9CBFA7] animate-pop capitalize">
                    {a.sound}!
                  </div>
                )}
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
