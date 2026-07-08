import { Link } from "react-router-dom";
import { ACTIVITIES, AVATARS } from "@/lib/data";
import { Layout } from "@/components/elise/Layout";
import { Type, Hash, Palette, Shapes, Rabbit, Music, Puzzle, PenLine, BookOpen, Star } from "lucide-react";
import { speak } from "@/lib/speech";
import { getSettings } from "@/lib/voice-settings";
import { getMilestones } from "@/lib/milestones";
import { MILESTONES, MILESTONE_CATEGORIES } from "@/lib/milestones-data";

const ICONS = { Type, Hash, Palette, Shapes, Rabbit, Music, Puzzle, PenLine, BookOpen };

export default function Home() {
  const settings = getSettings();
  const avatar = AVATARS.find(a => a.id === settings.avatar) || AVATARS[0];
  const ms = getMilestones();
  const mastered = MILESTONES.filter(m => ms[m.id]?.status === "mastered" && ms[m.id]?.date)
    .sort((a, b) => (ms[b.id].date || "").localeCompare(ms[a.id].date || ""))
    .slice(0, 4);
  const catEmoji = {};
  for (const c of MILESTONE_CATEGORIES) catEmoji[c.id] = c.emoji;

  return (
    <Layout showBack={false}>
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 animate-rise">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#EAE3D9] mb-5">
            <Star size={18} strokeWidth={3} color="#F2CA7E" />
            <span className="text-sm sm:text-base font-bold text-[#8A817C] tracking-wide">
              {(settings.childName || "ELISE").toUpperCase()} LEARNS · for tiny hands
            </span>
          </div>

          <div className="mb-4 text-7xl animate-float inline-block">
            {avatar.emoji}
          </div>

          <h1
            className="font-display font-bold text-5xl sm:text-7xl"
            style={{ color: "#5A524D" }}
            data-testid="home-title"
          >
            Hi {settings.childName || "friend"}! <span className="inline-block">Let's play.</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#8A817C] font-medium max-w-xl mx-auto">
            Tap a wooden block to start a tiny adventure.
          </p>
        </div>

        {mastered.length > 0 && (
          <div className="mb-8">
            <div className="text-xs font-bold text-[#8A817C] uppercase tracking-widest mb-2 text-center">
              Latest skills
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {mastered.map((m) => (
                <div
                  key={m.id}
                  className="rounded-full px-4 py-1.5 border-2 border-[#EAE3D9] bg-white"
                  style={{ boxShadow: "0 3px 0 0 #EAE3D9" }}
                >
                  <span className="text-sm">{catEmoji[m.category] || ""}</span>
                  <span className="ml-1 text-sm font-bold text-[#5A524D]">{m.label}</span>
                  <span className="ml-2 text-[10px] font-bold text-[#8A817C]">
                    {new Date(ms[m.id].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
