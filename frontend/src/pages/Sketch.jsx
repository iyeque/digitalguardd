import { useEffect, useRef, useState, useCallback } from "react";
import { Layout } from "@/components/elise/Layout";
import { speak } from "@/lib/speech";
import { trackOpen } from "@/lib/tracking";
import {
  Undo2, Trash2, Download, Palette, Eraser, Move,
  Check, X, ChevronLeft, ChevronRight
} from "lucide-react";

const PALETTE = [
  { name: "Coral",   hex: "#E89D8A" },
  { name: "Mustard", hex: "#F2CA7E" },
  { name: "Sage",    hex: "#9CBFA7" },
  { name: "Sky",     hex: "#A1BCE3" },
  { name: "Pink",    hex: "#F0B8C6" },
  { name: "Plum",    hex: "#C4B0DD" },
  { name: "Brown",   hex: "#7A5C3E" },
  { name: "White",   hex: "#FFFFFF" },
];

const GALLERY_KEY = "elise_sketch_gallery_v1";

const readGallery = () => {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const writeGallery = (items) => {
  try { localStorage.setItem(GALLERY_KEY, JSON.stringify(items)); } catch (_) {}
};

export default function Sketch() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const drawingRef = useRef(false);
  const undoStackRef = useRef([]);
  const lastPosRef = useRef(null);
  const [color, setColor] = useState(PALETTE[2].hex);
  const [size, setSize] = useState(12);
  const [tool, setTool] = useState("brush"); // brush | eraser
  const [showGallery, setShowGallery] = useState(false);
  const [gallery, setGallery] = useState(readGallery);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    trackOpen("sketch");
    speak("Draw anything!");
  }, []);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    const box = containerRef.current?.getBoundingClientRect();
    if (!c || !box) return;
    const dpr = window.devicePixelRatio || 1;
    // preserve current image
    const img = c.toDataURL();
    c.width = box.width * dpr;
    c.height = box.height * dpr;
    c.style.width = box.width + "px";
    c.style.height = box.height + "px";
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // restore
    const restore = new Image();
    restore.onload = () => {
      ctx.drawImage(restore, 0, 0, box.width, box.height);
    };
    restore.src = img;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: src.clientX - rect.left,
      y: src.clientY - rect.top,
    };
  };

  const start = (e) => {
    if (showGallery) return;
    e.preventDefault();
    drawingRef.current = true;
    const pos = getPos(e);
    lastPosRef.current = pos;
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    // draw a dot for taps
    ctx.lineTo(pos.x + 0.01, pos.y + 0.01);
    ctx.stroke();
    setDirty(true);
    setSaved(false);
  };

  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const end = (e) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    saveUndo();
  };

  const saveUndo = () => {
    const c = canvasRef.current;
    if (!c) return;
    undoStackRef.current.push(c.toDataURL());
    if (undoStackRef.current.length > 25) undoStackRef.current.shift();
  };

  const handleUndo = () => {
    const c = canvasRef.current;
    if (!c || undoStackRef.current.length === 0) return;
    const img = new Image();
    img.onload = () => {
      const ctx = c.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const w = c.width / dpr;
      const h = c.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    };
    undoStackRef.current.pop();
    const prev = undoStackRef.current[undoStackRef.current.length - 1];
    if (prev) {
      img.src = prev;
    } else {
      // blank
      const ctx = c.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, c.width / dpr, c.height / dpr);
    }
  };

  const handleClear = () => {
    if (!dirty) return;
    const c = canvasRef.current;
    if (!c) return;
    if (window.confirm("Clear your drawing?")) {
      const ctx = c.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, c.width / dpr, c.height / dpr);
      undoStackRef.current = [];
      setDirty(false);
      setSaved(false);
      speak("All clear!");
    }
  };

  const handleSave = () => {
    const c = canvasRef.current;
    if (!c) return;
    saveUndo();
    const dataUrl = c.toDataURL("image/png");
    const item = {
      id: Date.now(),
      date: new Date().toISOString(),
      dataUrl,
    };
    const next = [item, ...gallery].slice(0, 50);
    setGallery(next);
    writeGallery(next);
    setSaved(true);
    setDirty(false);
    speak("Saved to your gallery!");
  };

  const handleDelete = (id) => {
    const next = gallery.filter((g) => g.id !== id);
    setGallery(next);
    writeGallery(next);
  };

  const handleDownload = (item) => {
    const a = document.createElement("a");
    a.href = item.dataUrl;
    a.download = `elise-sketch-${new Date(item.date).toISOString().slice(0, 10)}.png`;
    a.click();
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch (_) { return ""; }
  };

  return (
    <Layout title="Sketch" showBack={true}>
      <section ref={containerRef} className="flex flex-col h-[calc(100vh-140px)]">
        {/* Canvas area */}
        <div className="flex-1 relative rounded-[2rem] overflow-hidden border-4 border-white bg-white"
             style={{ boxShadow: "0 8px 0 0 #EAE3D9" }}>
          <canvas
            ref={canvasRef}
            data-testid="sketch-canvas"
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
            onTouchCancel={end}
            className="w-full h-full touch-none"
            style={{ cursor: tool === "eraser" ? "cell" : "crosshair" }}
          />
          {saved && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#9CBFA7] text-white font-display font-bold px-5 py-2 rounded-full shadow-lg">
              Saved!
            </div>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="mt-4 space-y-3">
          {/* Colors */}
          <div className="flex gap-2 overflow-x-auto pb-1" data-testid="sketch-palette">
            {PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => { setColor(c.hex); setTool("brush"); }}
                data-testid={`sketch-color-${c.name.toLowerCase()}`}
                className={`rounded-full shrink-0 border-2 transition ${color === c.hex && tool === "brush" ? "border-[#5A524D] scale-110" : "border-transparent"}`}
                style={{ background: c.hex, width: 40, height: 40, boxShadow: "0 3px 0 0 rgba(0,0,0,0.08)" }}
                aria-label={c.name}
              />
            ))}
          </div>

          {/* Brush size + tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTool("brush")}
              data-testid="tool-brush"
              className={`wood-press rounded-2xl px-4 py-3 inline-flex items-center gap-2 ${tool === "brush" ? "wood-card-sage text-white" : "wood-card text-[#5A524D]"}`}
            >
              <Palette size={18} strokeWidth={3} />
              <span className="font-bold text-sm">Brush</span>
            </button>
            <button
              onClick={() => setTool("eraser")}
              data-testid="tool-eraser"
              className={`wood-press rounded-2xl px-4 py-3 inline-flex items-center gap-2 ${tool === "eraser" ? "wood-card-mustard text-white" : "wood-card text-[#5A524D]"}`}
            >
              <Eraser size={18} strokeWidth={3} />
              <span className="font-bold text-sm">Eraser</span>
            </button>
            <button
              onClick={handleUndo}
              data-testid="sketch-undo"
              className="wood-press wood-card rounded-2xl px-4 py-3 inline-flex items-center gap-2 text-[#5A524D]"
            >
              <Undo2 size={18} strokeWidth={3} />
            </button>
            <button
              onClick={handleClear}
              data-testid="sketch-clear"
              className="wood-press wood-card-coral rounded-2xl px-4 py-3 inline-flex items-center gap-2 text-white"
            >
              <Trash2 size={18} strokeWidth={3} />
            </button>
            <button
              onClick={handleSave}
              disabled={!dirty}
              data-testid="sketch-save"
              className="wood-press wood-card-sage rounded-2xl px-5 py-3 inline-flex items-center gap-2 text-white disabled:opacity-40"
            >
              <Check size={18} strokeWidth={3} />
              <span className="font-bold text-sm">Save</span>
            </button>
            <button
              onClick={() => setShowGallery(true)}
              data-testid="sketch-gallery"
              className="wood-press wood-card rounded-2xl px-4 py-3 inline-flex items-center gap-2 text-[#5A524D]"
            >
              <Move size={18} strokeWidth={3} />
              <span className="font-bold text-sm">Gallery ({gallery.length})</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-bold text-[#8A817C] uppercase tracking-wide">Size</span>
              <input
                type="range"
                min="4"
                max="40"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                data-testid="brush-size-slider"
                className="accent-[#9CBFA7]"
                style={{ width: 100 }}
              />
            </div>
          </div>
        </div>

        {/* Gallery modal */}
        {showGallery && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-lg max-h-[80vh] flex flex-col border-2 border-[#EAE3D9]"
                 style={{ boxShadow: "0 20px 40px rgba(90,82,77,0.15)" }}>
              <div className="flex items-center justify-between p-5 border-b-2 border-[#EAE3D9]">
                <h3 className="font-display font-bold text-xl text-[#5A524D]">
                  Your Gallery ({gallery.length})
                </h3>
                <button
                  onClick={() => setShowGallery(false)}
                  data-testid="close-gallery"
                  className="wood-press rounded-full w-10 h-10 flex items-center justify-center"
                >
                  <X size={20} strokeWidth={3} color="#5A524D" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {gallery.length === 0 ? (
                  <p className="text-center text-[#8A817C] py-10 font-medium">
                    No sketches yet. Save your first drawing!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {gallery.map((item) => (
                      <div key={item.id} className="rounded-2xl border-2 border-[#EAE3D9] bg-white overflow-hidden">
                        <img src={item.dataUrl} alt="" className="w-full aspect-square object-cover" />
                        <div className="p-2 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#8A817C]">
                            {formatDate(item.date)}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDownload(item)}
                              data-testid={`gallery-download-${item.id}`}
                              className="rounded-full p-1.5 hover:bg-[#F3EFE6]"
                            >
                              <Download size={14} strokeWidth={3} color="#5A524D" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              data-testid={`gallery-delete-${item.id}`}
                              className="rounded-full p-1.5 hover:bg-[#F3EFE6]"
                            >
                              <Trash2 size={14} strokeWidth={3} color="#E89D8A" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
