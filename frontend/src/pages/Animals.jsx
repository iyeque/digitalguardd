import { useEffect, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { ANIMALS } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { Rabbit, Cat, Dog, Bird, Squirrel, Fish } from "lucide-react";

const FALLBACK_ICONS = {
  Cow: Squirrel, Duck: Bird, Sheep: Rabbit, Cat: Cat, Dog: Dog, Default: Fish,
};

export default function Animals() {
  const [active, setActive] = useState(null);

  useEffect(() => { trackOpen("animals"); }, []);

  const onTap = (a) => {
    setActive(a.name);
    trackTap("animals");
    speak(`${a.name}. ${a.emoji}`);
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
            const Icon = FALLBACK_ICONS[a.name] || FALLBACK_ICONS.Default;
            const isActive = active === a.name;
            return (
              <button
                key={a.name}
                onClick={() => onTap(a)}
                data-testid={`animal-${a.name.toLowerCase()}`}
                className={`wood-card wood-press animate-rise rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-end ${isActive ? 'animate-wiggle' : ''}`}
                style={{ minHeight: 200, animationDelay: `${idx * 70}ms` }}
              >
                <div className="flex-1 flex items-center justify-center w-full">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.name}
                      className="w-full h-32 sm:h-36 object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{ width: 110, height: 110, background: '#F3EFE6' }}
                    >
                      <Icon size={64} strokeWidth={2.6} color="#5A524D" />
                    </div>
                  )}
                </div>
                <div className="mt-3 font-display font-bold text-2xl text-[#5A524D]">
                  {a.name}
                </div>
                {isActive && (
                  <div className="mt-1 text-base font-bold text-[#9CBFA7] animate-pop">
                    {a.emoji}
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
