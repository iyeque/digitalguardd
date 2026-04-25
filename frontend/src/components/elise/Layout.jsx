import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BreakReminder } from "@/components/elise/BreakReminder";

export const Layout = ({ children, title, showBack = true, hideGear = false }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="elise-bg" aria-hidden="true" />
      <header className="flex items-center justify-between px-5 sm:px-10 pt-5 sm:pt-7">
        {showBack ? (
          <button
            onClick={() => navigate("/")}
            data-testid="back-to-home-btn"
            aria-label="Go home"
            className="wood-card wood-press flex items-center justify-center"
            style={{ width: 80, height: 80, borderRadius: 24 }}
          >
            <ArrowLeft size={36} strokeWidth={3} color="#5A524D" />
          </button>
        ) : (
          <span style={{ width: 80, height: 80 }} />
        )}

        {title && (
          <h2
            className="font-display font-bold text-3xl sm:text-4xl"
            style={{ color: "#5A524D" }}
            data-testid="page-title"
          >
            {title}
          </h2>
        )}

        {!hideGear ? <ParentGear /> : <span style={{ width: 80, height: 80 }} />}
      </header>

      <main className="px-5 sm:px-10 pb-16 pt-6">{children}</main>
      <BreakReminder />
    </div>
  );
};

const ParentGear = () => {
  const navigate = useNavigate();
  const timer = useRef(null);
  const [progress, setProgress] = useState(0);

  const start = () => {
    setProgress(1);
    timer.current = setTimeout(() => {
      navigate("/parent");
    }, 1500);
  };
  const cancel = () => {
    setProgress(0);
    if (timer.current) clearTimeout(timer.current);
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <button
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={cancel}
      data-testid="parent-gear-btn"
      aria-label="Parent area (hold)"
      className="wood-card wood-press flex items-center justify-center relative"
      style={{ width: 80, height: 80, borderRadius: 24 }}
    >
      <Settings
        size={32}
        strokeWidth={3}
        color="#8A817C"
        className={progress ? "animate-wiggle" : ""}
      />
    </button>
  );
};

export default Layout;
