import { useEffect, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { ALPHABET } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { getSettings } from "@/lib/voice-settings";
import { phoneticsFor } from "@/lib/phonics";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

const PALETTES = ["wood-card-sage", "wood-card-mustard", "wood-card-coral", "wood-card-blue", "wood-card-pink"];

export default function Alphabet() {
  const [idx, setIdx] = useState(0);
  const [bump, setBump] = useState(0);
  const current = ALPHABET[idx];
  const palette = PALETTES[idx % PALETTES.length];

  useEffect(() => { trackOpen("alphabet"); }, []);

  const sayLetter = () => {
    trackTap("alphabet");
    setBump(b => b + 1);
    const settings = getSettings();
    if (settings.phonicsMode) {
      const sound = phoneticsFor(current.letter);
      speak(`${sound}. ${current.letter} is for ${current.word}.`);
    } else {
      speak(`${current.letter} is for ${current.word}.`);
    }
  };

  const next = () => { setIdx((i) => (i + 1) % ALPHABET.length); };
  const prev = () => { setIdx((i) => (i - 1 + ALPHABET.length) % ALPHABET.length); };

  return (
    <Layout title="ABC">
      <section className="max-w-3xl mx-auto">
        <div
          key={idx}
          className={`${palette} animate-rise rounded-[2.5rem] p-10 sm:p-16 text-center cursor-pointer wood-press`}
          onClick={sayLetter}
          data-testid="alphabet-flashcard"
          style={{ minHeight: 420 }}
        >
          <div
            key={bump}
            className="font-display font-bold animate-pop"
            style={{ fontSize: 'clamp(180px, 30vw, 280px)', lineHeight: 1, color: '#fff' }}
            data-testid="current-letter"
          >
            {current.letter}
          </div>
          <div className="mt-6 text-3xl sm:text-4xl font-bold font-display" style={{ color: '#fff' }}>
            {current.word}
          </div>
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/30 backdrop-blur">
            <Volume2 size={22} strokeWidth={3} color="#fff" />
            <span className="text-base font-bold text-white">Tap me</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={prev}
            data-testid="prev-letter-btn"
            className="wood-card wood-press p-5 rounded-3xl flex items-center gap-3"
            aria-label="Previous letter"
          >
            <ChevronLeft size={36} strokeWidth={3} color="#5A524D" />
            <span className="font-bold text-lg text-[#5A524D] hidden sm:inline">Back</span>
          </button>

          <div className="text-base sm:text-lg font-bold text-[#8A817C]" data-testid="alphabet-progress">
            {idx + 1} / 26
          </div>

          <button
            onClick={next}
            data-testid="next-letter-btn"
            className="wood-card wood-press p-5 rounded-3xl flex items-center gap-3"
            aria-label="Next letter"
          >
            <span className="font-bold text-lg text-[#5A524D] hidden sm:inline">Next</span>
            <ChevronRight size={36} strokeWidth={3} color="#5A524D" />
          </button>
        </div>
      </section>
    </Layout>
  );
}
