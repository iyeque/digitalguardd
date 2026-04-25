import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { RHYMES } from "@/lib/data";
import { speak, stopSpeech } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { Play, Square as Stop, Music } from "lucide-react";

export default function Rhymes() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const lineTimers = useRef([]);

  useEffect(() => { trackOpen("rhymes"); }, []);
  useEffect(() => () => stop(), []);

  const stop = () => {
    stopSpeech();
    lineTimers.current.forEach(clearTimeout);
    lineTimers.current = [];
    setPlaying(false);
    setLineIdx(-1);
  };

  const play = () => {
    stop();
    trackTap("rhymes");
    setPlaying(true);
    const rhyme = RHYMES[active];
    let cumulative = 0;
    rhyme.lines.forEach((line, i) => {
      const t = setTimeout(() => {
        setLineIdx(i);
        speak(line, { rate: 0.78, pitch: 1.2 });
      }, cumulative);
      lineTimers.current.push(t);
      cumulative += Math.max(2200, line.length * 75);
    });
    const endT = setTimeout(() => { setPlaying(false); setLineIdx(-1); }, cumulative + 800);
    lineTimers.current.push(endT);
  };

  const select = (i) => { stop(); setActive(i); trackTap("rhymes"); };

  const rhyme = RHYMES[active];

  return (
    <Layout title="Rhymes">
      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8" data-testid="rhyme-list">
          {RHYMES.map((r, i) => (
            <button
              key={r.title}
              onClick={() => select(i)}
              data-testid={`rhyme-pick-${i}`}
              className={`wood-press rounded-2xl p-5 sm:p-6 text-left flex items-center gap-4 ${i === active ? 'wood-card-sage text-white' : 'wood-card'}`}
              style={{ minHeight: 88 }}
            >
              <Music size={32} strokeWidth={3} color={i === active ? '#fff' : '#9CBFA7'} />
              <span className={`font-display font-bold text-lg sm:text-xl ${i === active ? 'text-white' : 'text-[#5A524D]'}`}>
                {r.title}
              </span>
            </button>
          ))}
        </div>

        <div className="wood-card animate-rise rounded-[2rem] p-6 sm:p-10">
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D] mb-5" data-testid="rhyme-title">
            {rhyme.title}
          </div>
          <div className="space-y-3">
            {rhyme.lines.map((line, i) => (
              <div
                key={i}
                className={`text-lg sm:text-2xl font-semibold transition-all duration-300 ${i === lineIdx ? 'text-[#E89D8A] scale-105' : 'text-[#5A524D]'}`}
                style={{ transformOrigin: 'left' }}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            {!playing ? (
              <button
                onClick={play}
                data-testid="play-rhyme-btn"
                className="wood-card-coral wood-press rounded-full flex items-center gap-3 px-8 py-5"
              >
                <Play size={32} strokeWidth={3} color="#fff" fill="#fff" />
                <span className="font-display font-bold text-2xl text-white">Sing it</span>
              </button>
            ) : (
              <button
                onClick={stop}
                data-testid="stop-rhyme-btn"
                className="wood-card-blue wood-press rounded-full flex items-center gap-3 px-8 py-5"
              >
                <Stop size={32} strokeWidth={3} color="#fff" fill="#fff" />
                <span className="font-display font-bold text-2xl text-white">Stop</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
