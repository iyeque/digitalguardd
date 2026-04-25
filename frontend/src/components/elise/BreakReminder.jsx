import { useEffect, useState } from "react";
import { getSettings } from "@/lib/voice-settings";
import { getTodaySeconds } from "@/lib/session-time";
import { Clock, X } from "lucide-react";

const DISMISS_KEY = "elise_break_dismissed_v1";

const dismissedToday = () => {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    return v === new Date().toISOString().slice(0, 10);
  } catch (_) { return false; }
};

const markDismissed = () => {
  try { localStorage.setItem(DISMISS_KEY, new Date().toISOString().slice(0, 10)); } catch (_) {}
};

export const BreakReminder = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const s = getSettings();
      if (!s.dailyLimitMins) return;
      if (dismissedToday()) return;
      const minsToday = Math.floor(getTodaySeconds() / 60);
      if (minsToday >= s.dailyLimitMins) setShow(true);
    }, 15000);
    return () => clearInterval(id);
  }, []);

  if (!show) return null;

  const close = () => { markDismissed(); setShow(false); };

  return (
    <div
      className="fixed inset-x-0 bottom-6 mx-auto z-50 max-w-md px-4"
      data-testid="break-reminder"
    >
      <div
        className="rounded-3xl p-5 flex items-start gap-4"
        style={{
          background: '#FFF7E8',
          border: '2px solid #F2CA7E',
          boxShadow: '0 12px 30px rgba(90,82,77,0.18)',
        }}
      >
        <div
          className="rounded-2xl flex items-center justify-center shrink-0"
          style={{ width: 48, height: 48, background: '#F2CA7E' }}
        >
          <Clock size={24} strokeWidth={3} color="#fff" />
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-lg text-[#5A524D]">
            Time for a little break
          </div>
          <p className="text-sm text-[#8A817C] font-medium">
            You've been playing for a while — try a snack, stretch, or a hug.
          </p>
        </div>
        <button
          onClick={close}
          data-testid="break-reminder-close"
          className="rounded-full bg-white border-2 border-[#EAE3D9] p-2"
          aria-label="Dismiss"
        >
          <X size={18} strokeWidth={3} color="#5A524D" />
        </button>
      </div>
    </div>
  );
};
