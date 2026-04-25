import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { speak, stopSpeech } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { Play, Square as Stop, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const timers = useRef([]);

  useEffect(() => {
    trackOpen("stories");
    fetch(`${API}/stories`).then(r => r.ok ? r.json() : { stories: [] })
      .then(d => setStories(d.stories || []))
      .catch(() => setStories([]));
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const story = stories[activeIdx];

  const stop = () => {
    stopSpeech();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(false);
    setLineIdx(-1);
  };

  const play = () => {
    if (!story) return;
    stop();
    trackTap("stories");
    setPlaying(true);
    let cumulative = 0;
    story.lines.forEach((line, i) => {
      const t = setTimeout(() => { setLineIdx(i); speak(line, { rate: 0.85 }); }, cumulative);
      timers.current.push(t);
      cumulative += Math.max(2400, line.length * 70);
    });
    timers.current.push(setTimeout(() => { setPlaying(false); setLineIdx(-1); }, cumulative + 800));
  };

  const pickStory = (i) => { stop(); setActiveIdx(i); };

  if (!stories.length) {
    return (
      <Layout title="Stories">
        <div className="text-center text-[#8A817C] mt-10" data-testid="stories-loading">Loading stories…</div>
      </Layout>
    );
  }

  return (
    <Layout title="Stories">
      <section className="max-w-4xl mx-auto" data-testid="stories-page">
        <p className="text-center text-base sm:text-lg text-[#8A817C] font-semibold mb-6">
          Pick a story. Tap "Read it" and listen along.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8" data-testid="stories-grid">
          {stories.map((s, i) => (
            <button
              key={s.id}
              onClick={() => pickStory(i)}
              data-testid={`story-pick-${s.id}`}
              className={`wood-press rounded-2xl p-4 text-left transition ${activeIdx === i ? 'text-white' : 'wood-card text-[#5A524D]'}`}
              style={activeIdx === i ? { background: s.color, border: `2px solid ${s.color}`, boxShadow: `0 8px 0 0 ${s.color}` } : {}}
            >
              <BookOpen size={24} strokeWidth={3} color={activeIdx === i ? '#fff' : s.color} />
              <div className="font-display font-bold text-base mt-2 leading-tight">{s.title}</div>
            </button>
          ))}
        </div>

        <div
          className="rounded-[2rem] p-6 sm:p-10 animate-rise"
          style={{
            background: `linear-gradient(135deg, ${story.color}26, #FFFFFF)`,
            border: `2px solid ${story.color}`,
            boxShadow: `0 8px 0 0 ${story.color}66`,
          }}
        >
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D] mb-1" data-testid="story-title">
            {story.title}
          </div>
          <div className="text-xs uppercase tracking-widest font-bold text-[#8A817C] mb-5">A tiny story · {story.lines.length} lines</div>
          <div className="space-y-3">
            {story.lines.map((line, i) => (
              <div key={i}
                className={`text-lg sm:text-2xl font-semibold transition-all duration-300 ${i === lineIdx ? 'scale-105 text-[#5A524D]' : 'text-[#5A524D]/70'}`}
                style={{ transformOrigin: 'left' }}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            {!playing ? (
              <button onClick={play} data-testid="play-story-btn" className="wood-press rounded-full flex items-center gap-3 px-8 py-5"
                style={{ background: story.color, color: '#fff', border: `2px solid ${story.color}`, boxShadow: `0 8px 0 0 ${story.color}99` }}>
                <Play size={28} strokeWidth={3} color="#fff" fill="#fff" />
                <span className="font-display font-bold text-2xl">Read it</span>
              </button>
            ) : (
              <button onClick={stop} data-testid="stop-story-btn" className="wood-card-blue wood-press rounded-full flex items-center gap-3 px-8 py-5">
                <Stop size={28} strokeWidth={3} color="#fff" fill="#fff" />
                <span className="font-display font-bold text-2xl text-white">Stop</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => pickStory((activeIdx - 1 + stories.length) % stories.length)}
            data-testid="story-prev"
            className="wood-card wood-press p-4 rounded-2xl"
          >
            <ChevronLeft size={28} strokeWidth={3} color="#5A524D" />
          </button>
          <div className="text-sm font-bold text-[#8A817C]" data-testid="story-progress">
            {activeIdx + 1} / {stories.length}
          </div>
          <button
            onClick={() => pickStory((activeIdx + 1) % stories.length)}
            data-testid="story-next"
            className="wood-card wood-press p-4 rounded-2xl"
          >
            <ChevronRight size={28} strokeWidth={3} color="#5A524D" />
          </button>
        </div>
      </section>
    </Layout>
  );
}
