import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { speak, stopSpeech } from "@/lib/speech";
import { trackOpen, trackTap } from "@/lib/tracking";
import { tryPlayStoryClip, saveStoryClip, getStoryClipBlob } from "@/lib/voice-clips";
import { Play, Square as Stop, BookOpen, ChevronLeft, ChevronRight, Mic, Check, Trash2 } from "lucide-react";
import { getSettings } from "@/lib/voice-settings";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8001`;
const API = `${BACKEND_URL}/api`;

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const [isRecordMode, setIsRecordMode] = useState(false);
  const [recordingLine, setRecordingLine] = useState(-1);
  const [hasClips, setHasClips] = useState({}); // { lineIdx: bool }
  const timers = useRef([]);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    trackOpen("stories");
    fetch(`${API}/stories`).then(r => r.ok ? r.json() : { stories: [] })
      .then(d => setStories(d.stories || []))
      .catch(() => setStories([]));
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const story = stories[activeIdx];

  // Refresh clip status when story changes
  useEffect(() => {
    if (!story) return;
    const check = async () => {
      const profileId = getSettings().activeProfile || 'Mom';
      const map = {};
      for (let i = 0; i < story.lines.length; i++) {
        const blob = await getStoryClipBlob(profileId, story.id, i);
        map[i] = !!blob;
      }
      setHasClips(map);
    };
    check();
  }, [story]);

  const stop = () => {
    stopSpeech();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(false);
    setLineIdx(-1);
  };

  const play = async () => {
    if (!story) return;
    stop();
    trackTap("stories");
    setPlaying(true);
    
    const profileId = getSettings().activeProfile || 'Mom';
    let cumulative = 0;
    for (let i = 0; i < story.lines.length; i++) {
      const line = story.lines[i];
      const t = setTimeout(async () => {
        setLineIdx(i);
        // Priority: Custom Story Clip > Standard Speak (which handles global clips/TTS)
        const played = await tryPlayStoryClip(profileId, story.id, i, { rate: 0.85 });
        if (!played) {
          speak(line, { rate: 0.85 });
        }
      }, cumulative);
      timers.current.push(t);
      
      // Heuristic for line duration
      cumulative += Math.max(2800, line.length * 80);
    }
    
    timers.current.push(setTimeout(() => { 
      setPlaying(false); 
      setLineIdx(-1); 
    }, cumulative + 800));
  };

  const startRecording = async (idx) => {
    if (recordingLine !== -1) return;
    const profileId = getSettings().activeProfile || 'Mom';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const mimeType =
          MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : MediaRecorder.isTypeSupported('audio/mp4')
              ? 'audio/mp4'
              : '';
        const blob = new Blob(chunks.current, mimeType ? { type: mimeType } : undefined);
        await saveStoryClip(profileId, story.id, idx, blob);
        setHasClips(prev => ({ ...prev, [idx]: true }));
        setRecordingLine(-1);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.current.start();
      setRecordingLine(idx);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recordingLine !== -1) {
      mediaRecorder.current.stop();
    }
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <p className="text-[#8A817C] font-semibold text-lg">
            {isRecordMode ? "Tap a line to record your voice." : "Pick a story and listen along."}
          </p>
          <button 
            onClick={() => setIsRecordMode(!isRecordMode)}
            className={`wood-press px-5 py-2 rounded-full font-bold text-sm transition-all ${isRecordMode ? 'wood-card-coral text-white' : 'wood-card text-[#8A817C]'}`}
          >
            <Mic size={16} className="inline mr-2" />
            {isRecordMode ? "Exit Record Mode" : "Record this story"}
          </button>
        </div>

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
          <div className="text-xs uppercase tracking-widest font-bold text-[#8A817C] mb-5">
            {Object.values(hasClips).filter(Boolean).length === story.lines.length ? "✨ Fully recorded in your voice" : `A tiny story · ${story.lines.length} lines`}
          </div>
          
          <div className="space-y-4">
            {story.lines.map((line, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div 
                  onClick={isRecordMode ? (recordingLine === i ? stopRecording : () => startRecording(i)) : undefined}
                  className={`flex-1 text-lg sm:text-2xl font-semibold transition-all duration-300 rounded-xl p-3 
                    ${isRecordMode ? 'hover:bg-black/5 cursor-pointer border-2 border-dashed border-transparent hover:border-black/10' : ''} 
                    ${i === lineIdx ? 'scale-105 text-[#E89D8A] bg-[#FFF9F5] shadow-sm' : 'text-[#5A524D]/70'}`}
                  style={{ transformOrigin: 'left' }}
                >
                  {line}
                  {recordingLine === i && (
                    <span className="ml-3 inline-flex items-center text-red-500 text-sm animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2" /> Recording...
                    </span>
                  )}
                </div>
                {isRecordMode && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {hasClips[i] && <Check size={20} className="text-green-500" />}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isRecordMode && (
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
          )}
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
