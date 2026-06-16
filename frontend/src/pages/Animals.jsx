import { useEffect, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { ANIMALS } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";

export default function Animals() {
  const [active, setActive] = useState(null);

  useEffect(() => { trackOpen("animals"); }, []);

  const onTap = (a) => {
    setActive(a.name);
    trackTap("animals");
    // Natural announcement: "The Lion says Roar!"
    speak(`${a.name} says ${a.sound}`);
    setTimeout(() => setActive(null), 1200);
  };

  return (
    <Layout title="Animals">
      <section className="max-w-5xl mx-auto">
        <p className="text-center text-lg sm:text-xl text-[#8A817C] font-semibold mb-8">
          Tap a friend to hear what they say.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7" data-testid="animals-grid">
          {ANIMALS.map((a, idx) => {
            const isActive = active === a.name;
            
            return (
              <button
                key={a.name}
                onClick={() => onTap(a)}
                data-testid={`animal-${a.name.toLowerCase()}`}
                className={`wood-card wood-press animate-rise rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center transition-all ${isActive ? 'animate-wiggle scale-105' : ''}`}
                style={{ minHeight: 200, animationDelay: `${idx * 70}ms` }}
              >
                <div className="text-7xl sm:text-8xl mb-4 drop-shadow-sm">
                  {a.emoji}
                </div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D]">
                  {a.name}
                </div>
                {isActive && (
                  <div className="mt-2 text-lg font-bold text-[#9CBFA7] animate-pop capitalize">
                    {a.sound}!
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
