import { useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { getProgress, resetProgress } from "@/lib/tracking";
import { ACTIVITIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Sparkles, Clock, MousePointerClick } from "lucide-react";

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch (_) { return "—"; }
};

const estMinutes = (taps) => Math.max(1, Math.round((taps || 0) / 6));

export default function ParentDashboard() {
  const [data, setData] = useState(getProgress());
  const totalTaps = data.totalTaps || 0;
  const visited = ACTIVITIES.filter((a) => data.activities[a.id]?.opens > 0).length;

  const reset = () => {
    if (window.confirm("Reset all of Elise's progress?")) {
      resetProgress();
      setData(getProgress());
    }
  };

  return (
    <Layout title="Parent Area" hideGear>
      <section className="max-w-5xl mx-auto">
        <div
          className="rounded-[2.5rem] p-8 sm:p-12 mb-8"
          style={{ background: "rgba(255,255,255,0.85)", border: "4px solid #fff", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(90,82,77,0.10)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={28} strokeWidth={3} color="#9CBFA7" />
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#5A524D]">
              Today with Elise
            </h3>
          </div>
          <p className="text-base sm:text-lg text-[#8A817C] font-medium">
            Started learning on {formatDate(data.startedAt)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-7">
            <Stat
              label="Total taps"
              value={totalTaps}
              icon={MousePointerClick}
              color="#E89D8A"
              testId="stat-total-taps"
            />
            <Stat
              label="Activities visited"
              value={`${visited} / ${ACTIVITIES.length}`}
              icon={Sparkles}
              color="#9CBFA7"
              testId="stat-activities-visited"
            />
            <Stat
              label="Time playing"
              value={`~${estMinutes(totalTaps)} min`}
              icon={Clock}
              color="#A1BCE3"
              testId="stat-time-playing"
            />
          </div>
        </div>

        <h4 className="font-display font-bold text-xl sm:text-2xl text-[#5A524D] mb-4">
          Activity breakdown
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5" data-testid="activity-breakdown">
          {ACTIVITIES.map((a) => {
            const stat = data.activities[a.id] || { opens: 0, taps: 0, lastVisit: null };
            return (
              <Card
                key={a.id}
                className="p-5 sm:p-6 rounded-2xl border-2 border-[#EAE3D9] bg-white"
                data-testid={`breakdown-${a.id}`}
              >
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
          <p className="text-sm text-[#8A817C]">
            Progress is stored locally on this device. No data leaves the browser.
          </p>
          <Button
            onClick={reset}
            variant="outline"
            data-testid="reset-progress-btn"
            className="border-2 border-[#EAE3D9] text-[#5A524D] rounded-full font-bold"
          >
            <Trash2 size={16} className="mr-2" /> Reset progress
          </Button>
        </div>
      </section>
    </Layout>
  );
}

const Stat = ({ label, value, icon: Icon, color, testId }) => (
  <div className="rounded-2xl bg-white border-2 border-[#EAE3D9] p-5" data-testid={testId}>
    <div className="flex items-center gap-3">
      <div
        className="rounded-xl flex items-center justify-center"
        style={{ width: 44, height: 44, background: color + "22" }}
      >
        <Icon size={22} strokeWidth={3} color={color} />
      </div>
      <div>
        <div className="font-display font-bold text-2xl text-[#5A524D]">{value}</div>
        <div className="text-xs sm:text-sm font-bold text-[#8A817C] uppercase tracking-wide">{label}</div>
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
