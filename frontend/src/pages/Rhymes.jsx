import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { RHYMES } from "@/lib/data";
import { speak, stopSpeech } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { getSettings } from "@/lib/voice-settings";
import { startBgMusic, stopBgMusic, isBgMusicSupported } from "@/lib/audio-bg";
import { Play, Square as Stop, Music, Mic, Speaker } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Map our local rhymes to the backend's audio slugs (when available).
const SUNG_SLUG = {
  "Twinkle Twinkle Little Star": "twinkle",
  "Old MacDonald Had a Farm": "macdonald",
  "Baa Baa Black Sheep": "baabaa",
};

export default function Rhymes() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const [mode, setMode] = useState("sung"); // 'sung' | 'spoken'
  const audioRef = useRef(null);
  const lineTimers = useRef([]);
  const rhyme = RHYMES[active];
  const slug = SUNG_SLUG[rhyme.title];
  const sungAvailable = !!slug;

  useEffect(() => { trackOpen("rhymes"); }, []);
  useEffect(() => () => stop(), []);
  useEffect(() => {
    // If the chosen rhyme has no recording, force spoken mode
    if (!sungAvailable && mode === "sung") setMode("spoken");
  }, [active, sungAvailable]); // eslint-disable-line react-hooks/exhaustive-deps

  const stop = () => {
    stopSpeech();
    stopBgMusic();
    lineTimers.current.forEach(clearTimeout);
    lineTimers.current = [];
    if (audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.src = ''; } catch (_) {}
      audioRef.current = null;
    }
    setPlaying(false);
    setLineIdx(-1);
  };

  const playSung = () => {
    stop();
    trackTap("rhymes");
    setPlaying(true);

    const audio = new Audio(`${API}/audio/rhyme/${slug}`);
    audioRef.current = audio;
    audio.volume = 1;

    // Distribute lyric highlights evenly across the audio's duration
    audio.onloadedmetadata = () => {
      const dur = audio.duration && isFinite(audio.duration) ? audio.duration : rhyme.lines.length * 3;
      const each = (dur * 1000) / rhyme.lines.length;
      rhyme.lines.forEach((_, i) => {
        lineTimers.current.push(setTimeout(() => setLineIdx(i), Math.round(each * i)));
      });
    };
    audio.onended = () => { setPlaying(false); setLineIdx(-1); };
    audio.onerror = () => { stop(); setMode("spoken"); playSpoken(); };
    audio.play().catch(() => { stop(); setMode("spoken"); playSpoken(); });
  };

  const playSpoken = () => {
    stop();
    trackTap("rhymes");
    setPlaying(true);
    if (getSettings().bgMusicEnabled && isBgMusicSupported()) startBgMusic();
    let cumulative = 0;
    rhyme.lines.forEach((line, i) => {
      const t = setTimeout(() => {
        setLineIdx(i);
        speak(line, { rate: 0.78 });
      }, cumulative);
      lineTimers.current.push(t);
      cumulative += Math.max(2200, line.length * 75);
    });
    const endT = setTimeout(() => { setPlaying(false); setLineIdx(-1); stopBgMusic(); }, cumulative + 800);
    lineTimers.current.push(endT);
  };

  const play = () => { (mode === "sung" && sungAvailable) ? playSung() : playSpoken(); };
  const select = (i) => { stop(); setActive(i); trackTap("rhymes"); };

  return (
    <Layout title="Rhymes">
      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6" data-testid="rhyme-list">
          {RHYMES.map((r, i) => (
            <button
              key={r.title}
              onClick={() => select(i)}
              data-testid={`rhyme-pick-${i}`}
              className={`wood-press rounded-2xl p-5 sm:p-6 text-left flex items-center gap-4 ${i === active ? 'wood-card-sage text-white' : 'wood-card'}`}
              style={{ minHeight: 88 }}
            >
              <Music size={32} strokeWidth={3} color={i === active ? '#fff' : '#9CBFA7'} />
              <div className="flex-1">
                <div className={`font-display font-bold text-lg sm:text-xl ${i === active ? 'text-white' : 'text-[#5A524D]'}`}>{r.title}</div>
                {SUNG_SLUG[r.title] ? (
                  <div className={`text-xs font-bold ${i === active ? 'text-white/80' : 'text-[#9CBFA7]'}`}>Sung version available</div>
                ) : (
                  <div className={`text-xs font-bold ${i === active ? 'text-white/80' : 'text-[#8A817C]'}`}>Spoken version</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Sung / spoken toggle */}
        {sungAvailable && (
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6" data-testid="rhyme-mode-toggle">
            <button
              onClick={() => { stop(); setMode("sung"); }}
              data-testid="rhyme-mode-sung"
              className={`wood-press rounded-2xl py-3 font-display font-bold text-base ${mode === "sung" ? 'wood-card-coral text-white' : 'wood-card text-[#5A524D]'}`}
            >
              <Mic size={18} className="inline mr-2" /> Sung
            </button>
            <button
              onClick={() => { stop(); setMode("spoken"); }}
              data-testid="rhyme-mode-spoken"
              className={`wood-press rounded-2xl py-3 font-display font-bold text-base ${mode === "spoken" ? 'wood-card-blue text-white' : 'wood-card text-[#5A524D]'}`}
            >
              <Speaker size={18} className="inline mr-2" /> Spoken
            </button>
          </div>
        )}

        <div className="wood-card animate-rise rounded-[2rem] p-6 sm:p-10">
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D] mb-5" data-testid="rhyme-title">
            {rhyme.title}
          </div>
          <div className="space-y-3">
            {rhyme.lines.map((line, i) => (
              <div key={i}
                className={`text-lg sm:text-2xl font-semibold transition-all duration-300 ${i === lineIdx ? 'text-[#E89D8A] scale-105' : 'text-[#5A524D]'}`}
                style={{ transformOrigin: 'left' }}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            {!playing ? (
              <button onClick={play} data-testid="play-rhyme-btn" className="wood-card-coral wood-press rounded-full flex items-center gap-3 px-8 py-5">
                <Play size={32} strokeWidth={3} color="#fff" fill="#fff" />
                <span className="font-display font-bold text-2xl text-white">{mode === "sung" && sungAvailable ? "Sing it" : "Play"}</span>
              </button>
            ) : (
              <button onClick={stop} data-testid="stop-rhyme-btn" className="wood-card-blue wood-press rounded-full flex items-center gap-3 px-8 py-5">
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
