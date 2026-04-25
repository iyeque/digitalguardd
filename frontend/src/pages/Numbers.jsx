import { useEffect, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { NUMBERS } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { Apple } from "lucide-react";

export default function Numbers() {
  const [n, setN] = useState(1);
  const [counted, setCounted] = useState([]);

  useEffect(() => { trackOpen("numbers"); }, []);
  useEffect(() => { setCounted([]); speak(`Let's count to ${n}.`); }, [n]);

  const tapApple = (i) => {
    if (counted.includes(i)) return;
    const next = [...counted, i];
    setCounted(next);
    trackTap("numbers");
    const isLast = next.length === n;
    speak(String(next.length), {
      onend: () => {
        if (isLast) {
          // small breath, then celebrate — onend ensures the number was fully spoken first
          setTimeout(() => speak(`Great job! ${n}!`), 350);
        }
      },
    });
  };

  return (
    <Layout title="1 2 3">
      <section className="max-w-4xl mx-auto">
        <div className="wood-card-mustard animate-rise rounded-[2.5rem] p-8 sm:p-12 text-center">
          <div className="font-display font-bold" style={{ fontSize: 'clamp(120px, 22vw, 220px)', lineHeight: 1, color: '#5A524D' }} data-testid="current-number">
            {n}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-[#5A524D]">
            Tap {n} {n === 1 ? "apple" : "apples"}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-5 gap-4 sm:gap-6 justify-items-center" data-testid="apple-grid">
          {Array.from({ length: n }).map((_, i) => {
            const tapped = counted.includes(i);
            return (
              <button
                key={i}
                onClick={() => tapApple(i)}
                data-testid={`apple-${i}`}
                className={`wood-press rounded-3xl flex items-center justify-center ${tapped ? 'wood-card-coral' : 'wood-card'}`}
                style={{ width: 88, height: 88 }}
              >
                <Apple size={48} strokeWidth={3} color={tapped ? '#fff' : '#E89D8A'} />
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-5 gap-3 sm:gap-4 max-w-3xl mx-auto" data-testid="number-pad">
          {NUMBERS.map((num) => (
            <button
              key={num}
              onClick={() => { setN(num); trackTap("numbers"); }}
              data-testid={`number-btn-${num}`}
              className={`wood-press rounded-2xl font-display font-bold text-3xl sm:text-4xl ${num === n ? 'wood-card-sage' : 'wood-card'}`}
              style={{ minHeight: 80, color: num === n ? '#fff' : '#5A524D' }}
            >
              {num}
            </button>
          ))}
        </div>
      </section>
    </Layout>
  );
}
