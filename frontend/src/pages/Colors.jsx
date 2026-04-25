import { useEffect, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { COLORS } from "@/lib/data";
import { speak } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";

export default function Colors() {
  const [active, setActive] = useState(null);

  useEffect(() => { trackOpen("colors"); }, []);

  const onTap = (c) => {
    setActive(c.name);
    trackTap("colors");
    speak(`${c.name}.`);
    setTimeout(() => setActive(null), 800);
  };

  return (
    <Layout title="Colors">
      <section className="max-w-5xl mx-auto">
        <p className="text-center text-lg sm:text-xl text-[#8A817C] font-semibold mb-8">
          Tap each block to hear its color.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8" data-testid="colors-grid">
          {COLORS.map((c, idx) => (
            <button
              key={c.name}
              onClick={() => onTap(c)}
              data-testid={`color-${c.name.toLowerCase()}`}
              className={`wood-press animate-rise rounded-[2rem] flex items-center justify-center text-white font-display font-bold text-2xl sm:text-3xl ${active === c.name ? 'animate-wiggle' : ''}`}
              style={{
                background: c.hex,
                border: `2px solid ${c.border}`,
                boxShadow: `0 8px 0 0 ${c.border}`,
                minHeight: 160,
                animationDelay: `${idx * 70}ms`,
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>
    </Layout>
  );
}
