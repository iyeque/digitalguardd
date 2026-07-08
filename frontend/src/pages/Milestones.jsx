import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import {
  MILESTONES,
  MILESTONE_CATEGORIES,
  STATUS_LABELS,
  STATUS_COLORS,
  DEFAULT_MILESTONES,
} from "@/lib/milestones-data";
import {
  getMilestones,
  saveMilestones,
  getChildAgeMonths,
  setChildAgeMonths,
  syncMilestones,
  fetchMilestones,
  imageFileToBase64,
} from "@/lib/milestones";
import { speak } from "@/lib/speech";
import { trackOpen } from "@/lib/tracking";
import { getSettings } from "@/lib/voice-settings";
import {
  Camera, Upload, Trash2, CloudUpload, CloudDownload,
  CalendarDays, ChevronRight, Sparkles
} from "lucide-react";

const CATEGORY_ORDER = ["grossMotor", "fineMotor", "cognitive", "emotional"];
const STATUS_KEYS = ["not-yet", "in-progress", "mastered"];

function ageLabel(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

export default function Milestones() {
  const childName = getSettings().childName || "Elise";
  const [ms, setMs] = useState(() => getMilestones());
  const [age, setAge] = useState(() => getChildAgeMonths());
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [activeCat, setActiveCat] = useState(CATEGORY_ORDER[0]);
  const photoRefs = useRef({});

  useEffect(() => { trackOpen("milestones"); }, []);

  const categorized = useMemo(() => {
    const map = {};
    for (const cat of MILESTONE_CATEGORIES) map[cat.id] = [];
    for (const m of MILESTONES) {
      if (map[m.category]) map[m.category].push(m);
    }
    return map;
  }, []);

  const stats = useMemo(() => {
    const relevant = MILESTONES.filter(
      (m) => age >= m.ageMin - 3 && age <= m.ageMax + 6
    );
    const mastered = relevant.filter((m) => ms[m.id]?.status === "mastered").length;
    return { total: relevant.length, mastered };
  }, [ms, age]);

  useEffect(() => {
    setMs(getMilestones());
  }, []);

  const update = (id, patch) => {
    const next = { ...ms, [id]: { ...(ms[id] || {}), ...patch } };
    setMs(next);
    saveMilestones(next);
  };

  const onStatus = (id, status) => {
    const entry = ms[id] || {};
    const patch = { status };
    if (status === "mastered" && !entry.date) {
      patch.date = new Date().toISOString().slice(0, 10);
    }
    if (status === "in-progress") {
      patch.date = patch.date || new Date().toISOString().slice(0, 10);
    }
    update(id, patch);
    const m = MILESTONES.find((x) => x.id === id);
    if (status === "mastered" && m) speak("Great job, " + childName + "!");
  };

  const onNote = (id, note) => update(id, { note });
  const onDate = (id, date) => update(id, { date });

  const onPhoto = async (id, file) => {
    if (!file) return;
    try {
      const b64 = await imageFileToBase64(file, 400);
      update(id, { photo: b64 });
    } catch (_) {
      alert("Could not read photo.");
    }
  };

  const removePhoto = (id) => update(id, { photo: null });

  const handleSyncPush = async () => {
    setSyncing(true);
    try {
      await syncMilestones(ms);
      setLastSync(new Date().toLocaleString());
      speak("Growth saved to cloud!");
    } catch (e) {
      alert("Sync failed: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncPull = async () => {
    setSyncing(true);
    try {
      const remote = await fetchMilestones();
      setMs(remote);
      saveMilestones(remote);
      setLastSync(new Date().toLocaleString());
      speak("Growth pulled from cloud!");
    } catch (e) {
      alert("Sync failed: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const relevantForAge = (m) => {
    return age >= m.ageMin - 3 && age <= m.ageMax + 6;
  };

  return (
    <Layout title="Growth" showBack={true}>
      <section className="max-w-5xl mx-auto space-y-5">
        {/* Header + age */}
        <div
          className="rounded-[2rem] p-6 sm:p-8"
          style={{ background: "#FFFFFF", border: "2px solid #EAE3D9", boxShadow: "0 8px 0 0 #EAE3D9" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D]">
                {childName}'s Growth
              </h3>
              <p className="text-[#8A817C] font-medium mt-1">
                Tracking milestones like a pediatrician would — month by month.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { const a = Math.max(12, age - 1); setAge(a); setChildAgeMonths(a); }}
                className="wood-press rounded-full w-10 h-10 flex items-center justify-center"
              >
                <ChevronRight size={18} strokeWidth={3} color="#5A524D" style={{ transform: "rotate(180deg)" }} />
              </button>
              <div className="wood-card rounded-2xl px-4 py-2 min-w-[90px] text-center">
                <div className="font-display font-bold text-xl text-[#5A524D]">
                  {ageLabel(age)}
                </div>
              </div>
              <button
                onClick={() => { const a = Math.min(60, age + 1); setAge(a); setChildAgeMonths(a); }}
                className="wood-press rounded-full w-10 h-10 flex items-center justify-center"
              >
                <ChevronRight size={18} strokeWidth={3} color="#5A524D" />
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="rounded-2xl bg-[#F3EFE6] border-2 border-[#EAE3D9] p-3 text-center">
              <div className="font-display font-bold text-xl text-[#5A524D]">{stats.mastered}</div>
              <div className="text-[10px] sm:text-xs font-bold text-[#8A817C] uppercase tracking-wide">Mastered</div>
            </div>
            <div className="rounded-2xl bg-[#F3EFE6] border-2 border-[#EAE3D9] p-3 text-center">
              <div className="font-display font-bold text-xl text-[#5A524D]">{stats.total - stats.mastered}</div>
              <div className="text-[10px] sm:text-xs font-bold text-[#8A817C] uppercase tracking-wide">To go</div>
            </div>
            <div className="rounded-2xl bg-[#F3EFE6] border-2 border-[#EAE3D9] p-3 text-center">
              <div className="font-display font-bold text-xl text-[#5A524D]">{stats.total}</div>
              <div className="text-[10px] sm:text-xs font-bold text-[#8A817C] uppercase tracking-wide">Expected</div>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
            {MILESTONE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                data-testid={`milestone-tab-${cat.id}`}
                className={`rounded-full px-4 py-2 font-bold text-sm whitespace-nowrap ${
                  activeCat === cat.id ? "text-white" : "bg-white text-[#5A524D] border-2 border-[#EAE3D9]"
                }`}
                style={activeCat === cat.id ? { background: cat.color } : {}}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Cloud sync */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSyncPush}
              disabled={syncing}
              className="wood-press wood-card-sage rounded-2xl px-4 py-2 inline-flex items-center gap-2 text-white text-sm font-bold"
            >
              <CloudUpload size={16} /> Save to cloud
            </button>
            <button
              onClick={handleSyncPull}
              disabled={syncing}
              className="wood-press wood-card-blue rounded-2xl px-4 py-2 inline-flex items-center gap-2 text-white text-sm font-bold"
            >
              <CloudDownload size={16} /> Load from cloud
            </button>
            {lastSync && (
              <span className="text-xs font-bold text-[#8A817C] self-center">
                Last sync: {lastSync}
              </span>
            )}
          </div>
        </div>

        {/* Milestone list for active category */}
        <div className="space-y-3">
          {categorized[activeCat]
            .filter(relevantForAge)
            .map((m) => {
              const entry = ms[m.id] || { status: "not-yet", date: "", note: "", photo: null };
              return (
                <div
                  key={m.id}
                  className="rounded-[2rem] bg-white border-2 border-[#EAE3D9] p-4 sm:p-5"
                  style={{ boxShadow: "0 6px 0 0 #EAE3D9" }}
                  data-testid={`milestone-${m.id}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-[180px]">
                      <div className="font-display font-bold text-base sm:text-lg text-[#5A524D]">
                        {m.label}
                      </div>
                      <div className="text-xs font-bold text-[#8A817C] mt-0.5">
                        Usually {ageLabel(m.ageMin)} – {ageLabel(m.ageMax)}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {STATUS_KEYS.map((sk) => (
                        <button
                          key={sk}
                          onClick={() => onStatus(m.id, sk)}
                          data-testid={`milestone-${m.id}-${sk}`}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold border-2 transition ${
                            entry.status === sk ? "text-white" : "bg-white text-[#5A524D]"
                          }`}
                          style={entry.status === sk ? { background: STATUS_COLORS[sk], borderColor: STATUS_COLORS[sk] } : { borderColor: "#EAE3D9" }}
                        >
                          {STATUS_LABELS[sk]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date + note + photo row */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <input
                      type="date"
                      value={entry.date || ""}
                      onChange={(e) => onDate(m.id, e.target.value)}
                      data-testid={`milestone-date-${m.id}`}
                      className="rounded-xl border-2 border-[#EAE3D9] px-3 py-2 text-sm font-semibold text-[#5A524D]"
                    />
                    <input
                      type="text"
                      value={entry.note}
                      onChange={(e) => onNote(m.id, e.target.value)}
                      placeholder="Add a note..."
                      data-testid={`milestone-note-${m.id}`}
                      className="rounded-xl border-2 border-[#EAE3D9] px-3 py-2 text-sm font-semibold text-[#5A524D] flex-1 min-w-[140px]"
                    />
                    <label
                      className="rounded-full w-9 h-9 flex items-center justify-center cursor-pointer bg-white border-2 border-[#EAE3D9]"
                      data-testid={`milestone-photo-${m.id}`}
                    >
                      <Camera size={16} strokeWidth={3} color="#5A524D" />
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => onPhoto(m.id, e.target.files[0])}
                      />
                    </label>
                    {entry.photo && (
                      <button
                        onClick={() => removePhoto(m.id)}
                        className="rounded-full w-9 h-9 flex items-center justify-center bg-white border-2 border-[#E89D8A]"
                        data-testid={`milestone-photo-remove-${m.id}`}
                      >
                        <Trash2 size={14} strokeWidth={3} color="#E89D8A" />
                      </button>
                    )}
                  </div>

                  {/* Photo preview */}
                  {entry.photo && (
                    <div className="mt-3">
                      <img src={entry.photo} alt="" className="rounded-2xl border-2 border-[#EAE3D9] max-h-40 object-cover" />
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Simple timeline of mastered milestones */}
        <div
          className="rounded-[2rem] p-6 sm:p-8"
          style={{ background: "#FFFFFF", border: "2px solid #EAE3D9", boxShadow: "0 8px 0 0 #EAE3D9" }}
        >
          <h4 className="font-display font-bold text-xl text-[#5A524D] flex items-center gap-2 mb-4">
            <CalendarDays size={22} strokeWidth={3} color="#9CBFA7" />
            Mastered timeline
          </h4>
          {(() => {
            const mastered = MILESTONES.filter((m) => ms[m.id]?.status === "mastered" && ms[m.id]?.date);
            if (!mastered.length) {
              return (
                <p className="text-[#8A817C] font-medium text-sm">
                  Tap "Mastered" on any milestone to pin it here.
                </p>
              );
            }
            // sort by date
            const sorted = [...mastered].sort((a, b) => (ms[a.id].date || "").localeCompare(ms[b.id].date || ""));
            return (
              <div className="flex flex-wrap gap-3">
                {sorted.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl px-4 py-2 border-2 border-[#EAE3D9] flex items-center gap-2"
                    style={{ background: "#F3EFE6" }}
                  >
                    <span className="text-lg">{MILESTONE_CATEGORIES.find((c) => c.id === m.category)?.emoji}</span>
                    <div>
                      <div className="text-sm font-bold text-[#5A524D]">{m.label}</div>
                      <div className="text-[10px] font-bold text-[#8A817C]">
                        {new Date(ms[m.id].date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>
    </Layout>
  );
}
