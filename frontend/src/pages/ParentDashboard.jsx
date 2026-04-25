import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/elise/Layout";
import { getProgress, resetProgress } from "@/lib/tracking";
import { ACTIVITIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { computeAchievements } from "@/lib/achievements";
import { buildShareCard, shareCanvas, downloadCanvas } from "@/lib/share-card";
import { getWeeklySeconds, getTodaySeconds } from "@/lib/session-time";
import { getSettings } from "@/lib/voice-settings";
import {
  Trash2, Sparkles, Clock, MousePointerClick, Settings, Share2, Download,
  Star, Trophy, Type, Hash, Palette as PaletteIcon, Shapes as ShapesIcon, Rabbit, Music, Puzzle, Crown, PenLine, CalendarDays,
} from "lucide-react";

const STICKER_ICONS = {
  Sparkles, Star, Trophy, Type, Hash, Palette: PaletteIcon, Shapes: ShapesIcon, Rabbit, Music, Puzzle, Crown, PenLine,
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
  catch (_) { return "—"; }
};

const fmtMins = (sec) => {
  const m = Math.round((sec || 0) / 60);
  return m === 0 ? "—" : `${m}m`;
};

export default function ParentDashboard() {
  const [data, setData] = useState(getProgress());
  const childName = getSettings().childName || "Elise";
  const totalTaps = data.totalTaps || 0;
  const visited = ACTIVITIES.filter((a) => data.activities[a.id]?.opens > 0).length;
  const achievements = useMemo(() => computeAchievements(data), [data]);
  const earned = achievements.filter(a => a.earned).length;
  const week = useMemo(() => getWeeklySeconds(), []);
  const todaySec = getTodaySeconds();
  const todayMin = Math.round(todaySec / 60);
  const weekMin = Math.round(week.reduce((s, d) => s + d.seconds, 0) / 60);
  const maxSec = Math.max(60, ...week.map(d => d.seconds));
  const [shareBusy, setShareBusy] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const reset = () => {
    if (window.confirm(`Reset all of ${childName}'s progress?`)) {
      resetProgress();
      setData(getProgress());
    }
  };

  const buildCanvas = () => buildShareCard({
    childName,
    activities: ACTIVITIES.map(a => ({ title: a.title, opened: (data.activities[a.id]?.opens || 0) > 0 })),
    totalTaps,
    minutesPlayed: highlight ? weekMin : todayMin || 1,
    earnedCount: earned,
    achievementCount: achievements.length,
    mode: highlight ? 'week' : 'today',
  });

  const onShare = async () => {
    setShareBusy(true);
    try { await shareCanvas(buildCanvas()); } finally { setShareBusy(false); }
  };
  const onDownload = () => downloadCanvas(buildCanvas());

  return (
    <Layout title="Parent Area" hideGear>
      <section className="max-w-5xl mx-auto">
        <div
          className="rounded-[2.5rem] p-8 sm:p-12 mb-8"
          style={{ background: "rgba(255,255,255,0.85)", border: "4px solid #fff", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(90,82,77,0.10)" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Sparkles size={28} strokeWidth={3} color="#9CBFA7" />
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D]">
                  Today with {childName}
                </h3>
              </div>
              <p className="text-base sm:text-lg text-[#8A817C] font-medium">
                Started learning on {formatDate(data.startedAt)}
              </p>
            </div>
            <Link
              to="/parent/settings"
              data-testid="open-settings-btn"
              className="wood-card wood-press rounded-2xl px-5 py-3 inline-flex items-center gap-2"
            >
              <Settings size={18} strokeWidth={3} color="#5A524D" />
              <span className="font-display font-bold text-base text-[#5A524D]">Settings</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7">
            <Stat label="Total taps"   value={totalTaps}                       icon={MousePointerClick} color="#E89D8A" testId="stat-total-taps" />
            <Stat label="Activities"   value={`${visited} / ${ACTIVITIES.length}`} icon={Sparkles}     color="#9CBFA7" testId="stat-activities-visited" />
            <Stat label="Today"        value={`${todayMin || 0}m`}              icon={Clock}            color="#A1BCE3" testId="stat-time-today" />
            <Stat label="Stickers"     value={`${earned}/${achievements.length}`} icon={Trophy}        color="#F2CA7E" testId="stat-stickers" />
          </div>
        </div>

        {/* Weekly highlight reel */}
        <div
          className="rounded-[2rem] p-6 sm:p-8 mb-8"
          style={{ background: '#FFFFFF', border: '2px solid #EAE3D9', boxShadow: '0 8px 0 0 #EAE3D9' }}
          data-testid="weekly-highlight"
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <CalendarDays size={26} strokeWidth={3} color="#9CBFA7" />
              <div className="font-display font-bold text-xl sm:text-2xl text-[#5A524D]">
                This week
              </div>
            </div>
            <div className="text-sm font-bold text-[#8A817C]" data-testid="week-total-mins">
              {weekMin} min total
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end" style={{ minHeight: 140 }}>
            {week.map((d) => {
              const h = Math.max(8, Math.round((d.seconds / maxSec) * 110));
              const isToday = d.day === new Date().toISOString().slice(0, 10);
              return (
                <div key={d.day} className="flex flex-col items-center justify-end" data-testid={`week-bar-${d.day}`}>
                  <div
                    className="w-full rounded-xl transition-all"
                    style={{
                      height: h,
                      background: isToday ? '#9CBFA7' : '#A1BCE3',
                      boxShadow: `0 4px 0 0 ${isToday ? '#82A88D' : '#89A6CF'}`,
                    }}
                    title={`${Math.round(d.seconds / 60)} min`}
                  />
                  <div className="text-xs font-bold text-[#8A817C] mt-2">{d.label.slice(0, 3)}</div>
                  <div className="text-[10px] font-bold text-[#5A524D]">{fmtMins(d.seconds)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Magic moment share card */}
        <div
          className="rounded-[2rem] p-6 sm:p-8 mb-10"
          style={{ background: 'linear-gradient(135deg, #FFF7E8, #FFE9DC)', border: '4px solid #fff', boxShadow: '0 12px 30px rgba(90,82,77,0.10)' }}
          data-testid="magic-moment-card"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
            <div
              className="rounded-2xl flex items-center justify-center shrink-0"
              style={{ width: 80, height: 80, background: '#fff', boxShadow: '0 6px 0 0 #EAE3D9' }}
            >
              <Share2 size={36} strokeWidth={3} color="#E89D8A" />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-xl sm:text-2xl text-[#5A524D]">
                Share {childName}'s magic moment
              </div>
              <p className="text-sm sm:text-base text-[#8A817C] font-medium">
                A pretty card with {highlight ? "this week's" : "today's"} activities and stickers — perfect for grandparents.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setHighlight(false)}
                  data-testid="share-mode-today"
                  className={`text-sm font-bold rounded-full px-4 py-1.5 ${!highlight ? 'bg-[#5A524D] text-white' : 'bg-white text-[#5A524D] border border-[#EAE3D9]'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setHighlight(true)}
                  data-testid="share-mode-week"
                  className={`text-sm font-bold rounded-full px-4 py-1.5 ${highlight ? 'bg-[#5A524D] text-white' : 'bg-white text-[#5A524D] border border-[#EAE3D9]'}`}
                >
                  This week
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onShare} disabled={shareBusy} data-testid="share-moment-btn" className="wood-card-coral wood-press rounded-full px-5 py-3 inline-flex items-center gap-2">
                <Share2 size={18} strokeWidth={3} color="#fff" />
                <span className="font-display font-bold text-base text-white">Share</span>
              </button>
              <button onClick={onDownload} data-testid="download-moment-btn" className="wood-card wood-press rounded-full px-5 py-3 inline-flex items-center gap-2">
                <Download size={18} strokeWidth={3} color="#5A524D" />
                <span className="font-display font-bold text-base text-[#5A524D]">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stickers */}
        <h4 className="font-display font-bold text-xl sm:text-2xl text-[#5A524D] mb-4 flex items-center gap-2">
          <Trophy size={24} strokeWidth={3} color="#F2CA7E" /> Stickers
          <span className="text-sm font-bold text-[#8A817C]" data-testid="stickers-count">
            ({earned} of {achievements.length})
          </span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10" data-testid="achievements-grid">
          {achievements.map((a) => {
            const Icon = STICKER_ICONS[a.sticker] || Sparkles;
            return (
              <div
                key={a.id}
                data-testid={`sticker-${a.id}`}
                className={`rounded-2xl p-4 border-2 text-center transition-all ${a.earned ? 'bg-white border-[#EAE3D9]' : 'bg-[#F3EFE6] border-[#EAE3D9] opacity-60'}`}
                style={a.earned ? { boxShadow: `0 6px 0 0 ${a.color}66` } : {}}
              >
                <div className="rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ width: 64, height: 64, background: a.earned ? a.color : '#EAE3D9' }}>
                  <Icon size={32} strokeWidth={3} color={a.earned ? '#fff' : '#8A817C'} fill={a.earned ? '#fff' : 'none'} fillOpacity={a.earned ? 0.25 : 0} />
                </div>
                <div className="font-display font-bold text-base text-[#5A524D]">{a.label}</div>
                <div className="text-xs text-[#8A817C] font-semibold mt-1">{a.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Activity breakdown */}
        <h4 className="font-display font-bold text-xl sm:text-2xl text-[#5A524D] mb-4">Activity breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5" data-testid="activity-breakdown">
          {ACTIVITIES.map((a) => {
            const stat = data.activities[a.id] || { opens: 0, taps: 0, lastVisit: null };
            return (
              <Card key={a.id} className="p-5 sm:p-6 rounded-2xl border-2 border-[#EAE3D9] bg-white" data-testid={`breakdown-${a.id}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display font-bold text-xl text-[#5A524D]">{a.title}</div>
                    <div className="text-sm font-semibold text-[#8A817C]">{a.subtitle}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${stat.opens > 0 ? "bg-[#9CBFA7] text-white" : "bg-[#F3EFE6] text-[#8A817C]"}`}>
                    {stat.opens > 0 ? "Played" : "Not yet"}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <Mini label="Opens" value={stat.opens} />
                  <Mini label="Taps" value={stat.taps} />
                  <Mini label="Last" value={stat.lastVisit ? new Date(stat.lastVisit).toLocaleDateString() : "—"} />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-sm text-[#8A817C]">Progress is stored locally on this device.</p>
          <Button onClick={reset} variant="outline" data-testid="reset-progress-btn" className="border-2 border-[#EAE3D9] text-[#5A524D] rounded-full font-bold">
            <Trash2 size={16} className="mr-2" /> Reset progress
          </Button>
        </div>
      </section>
    </Layout>
  );
}

const Stat = ({ label, value, icon: Icon, color, testId }) => (
  <div className="rounded-2xl bg-white border-2 border-[#EAE3D9] p-4" data-testid={testId}>
    <div className="flex items-center gap-3">
      <div className="rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, background: color + "22" }}>
        <Icon size={20} strokeWidth={3} color={color} />
      </div>
      <div>
        <div className="font-display font-bold text-xl text-[#5A524D]">{value}</div>
        <div className="text-[10px] sm:text-xs font-bold text-[#8A817C] uppercase tracking-wide">{label}</div>
      </div>
    </div>
  </div>
);

const Mini = ({ label, value }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-[#8A817C] font-bold">{label}</div>
    <div className="font-display font-bold text-base text-[#5A524D]">{value}</div>
  </div>
);
