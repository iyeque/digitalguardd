import { Link } from "react-router-dom";
import { ACTIVITIES } from "@/lib/data";
import { Layout } from "@/components/elise/Layout";
import { Type, Hash, Palette, Shapes, Rabbit, Music, Sparkles, Puzzle } from "lucide-react";
import { speak } from "@/lib/speech";

const ICONS = { Type, Hash, Palette, Shapes, Rabbit, Music, Puzzle };

export default function Home() {
  return (
    <Layout showBack={false}>
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 animate-rise">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#EAE3D9] mb-5">
            <Sparkles size={18} strokeWidth={3} color="#9CBFA7" />
            <span className="text-sm sm:text-base font-bold text-[#8A817C] tracking-wide">
              ELISE LEARNS · for tiny hands
            </span>
          </div>
          <h1
            className="font-display font-bold text-5xl sm:text-7xl"
            style={{ color: "#5A524D" }}
            data-testid="home-title"
          >
            Hi Elise! <span className="inline-block animate-float">Let's play.</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#8A817C] font-medium max-w-xl mx-auto">
            Tap a wooden block to start a tiny adventure.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          data-testid="activity-grid"
        >
          {ACTIVITIES.map((a, idx) => {
            const Icon = ICONS[a.icon];
            return (
              <Link
                key={a.id}
                to={a.path}
                onClick={() => speak(a.title)}
                data-testid={`activity-card-${a.id}`}
                className={`wood-press ${a.colorClass} animate-rise p-7 sm:p-9 flex flex-col items-start justify-between min-h-[200px] sm:min-h-[240px]`}
                style={{ animationDelay: `${idx * 80}ms`, borderRadius: '2rem' }}
              >
                <div
                  className="rounded-2xl p-3 sm:p-4 mb-4"
                  style={{ background: 'rgba(255,255,255,0.25)' }}
                >
                  <Icon size={56} strokeWidth={3} color="#FFFFFF" />
                </div>
                <div>
                  <div className="font-display font-bold text-3xl sm:text-4xl leading-tight">
                    {a.title}
                  </div>
                  <div className="mt-1 text-base sm:text-lg font-semibold opacity-90">
                    {a.subtitle}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-center mt-12 text-sm text-[#8A817C]">
          Hold the gear icon for a moment to open the Parent Area.
        </p>
      </section>
    </Layout>
  );
}
