import { useEffect, useRef, useState } from "react";
import { saveClip, listClips, deleteClip } from "@/lib/voice-clips";
import { Mic, Square, Trash2, Upload, Play } from "lucide-react";

const PRESETS = [
  "Hi {name}",
  "Great job!",
  "Try again.",
  "All done!",
  "Let's play.",
  "I love you.",
];

export default function VoiceLibrary({ childName }) {
  const [clips, setClips] = useState([]);
  const [recordingPhrase, setRecordingPhrase] = useState(null);
  const [customPhrase, setCustomPhrase] = useState("");
  const recRef = useRef(null);
  const chunksRef = useRef([]);

  const refresh = async () => setClips(await listClips());
  useEffect(() => { refresh(); }, []);

  const expand = (phrase) => phrase.replaceAll("{name}", childName || "Elise");

  const startRec = async (phrase) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await saveClip(expand(phrase), blob, expand(phrase));
        stream.getTracks().forEach(t => t.stop());
        setRecordingPhrase(null);
        refresh();
      };
      mr.start();
      recRef.current = mr;
      setRecordingPhrase(phrase);
    } catch (e) {
      alert("Microphone access denied. You can also upload an audio file.");
    }
  };

  const stopRec = () => {
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
  };

  const onUpload = async (phrase, file) => {
    if (!file) return;
    await saveClip(expand(phrase), file, expand(phrase));
    refresh();
  };

  const onDelete = async (phrase) => {
    await deleteClip(phrase);
    refresh();
  };

  const playClip = async (phrase) => {
    const { getClipBlob } = await import("@/lib/voice-clips");
    const blob = await getClipBlob(phrase);
    if (!blob) return;
    const a = new Audio(URL.createObjectURL(blob));
    a.play();
  };

  const isRecorded = (phrase) => clips.some(c => c.phrase === expand(phrase).toLowerCase());

  return (
    <div className="space-y-3" data-testid="voice-library">
      <p className="text-sm text-[#8A817C] font-semibold">
        Record short phrases in your own voice. They'll play automatically when the app says them.
        Phrase matching is exact — say it the same way each time.
      </p>

      {PRESETS.map((preset) => {
        const expanded = expand(preset);
        const recorded = isRecorded(preset);
        const isActive = recordingPhrase === preset;
        return (
          <div key={preset}
            className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#EAE3D9] bg-white p-3"
            data-testid={`voice-preset-${preset.replaceAll(/\W/g, "_")}`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#5A524D] text-sm sm:text-base truncate">"{expanded}"</div>
              {recorded && <div className="text-xs text-[#9CBFA7] font-bold">Custom recording active</div>}
            </div>
            <div className="flex gap-2 shrink-0">
              {recorded && (
                <>
                  <button onClick={() => playClip(expanded)} className="wood-card wood-press p-2 rounded-xl" title="Play"
                    data-testid={`voice-play-${preset.replaceAll(/\W/g, "_")}`}>
                    <Play size={16} strokeWidth={3} color="#9CBFA7" />
                  </button>
                  <button onClick={() => onDelete(expanded)} className="wood-card wood-press p-2 rounded-xl" title="Delete"
                    data-testid={`voice-delete-${preset.replaceAll(/\W/g, "_")}`}>
                    <Trash2 size={16} strokeWidth={3} color="#E89D8A" />
                  </button>
                </>
              )}
              <label className="wood-card wood-press p-2 rounded-xl cursor-pointer" title="Upload audio">
                <Upload size={16} strokeWidth={3} color="#A1BCE3" />
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => onUpload(preset, e.target.files?.[0])}
                  data-testid={`voice-upload-${preset.replaceAll(/\W/g, "_")}`}
                />
              </label>
              {!isActive ? (
                <button onClick={() => startRec(preset)} className="wood-card-coral wood-press p-2 rounded-xl" title="Record"
                  data-testid={`voice-record-${preset.replaceAll(/\W/g, "_")}`}>
                  <Mic size={16} strokeWidth={3} color="#fff" />
                </button>
              ) : (
                <button onClick={stopRec} className="wood-card-blue wood-press p-2 rounded-xl animate-pop" title="Stop"
                  data-testid={`voice-stop-${preset.replaceAll(/\W/g, "_")}`}>
                  <Square size={16} strokeWidth={3} color="#fff" fill="#fff" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Custom phrase */}
      <div className="rounded-2xl border-2 border-dashed border-[#EAE3D9] p-3 mt-2">
        <div className="text-sm font-bold text-[#5A524D] mb-2">Add your own phrase</div>
        <div className="flex gap-2">
          <input
            value={customPhrase}
            onChange={(e) => setCustomPhrase(e.target.value)}
            placeholder='e.g. "Bedtime sweetheart"'
            data-testid="voice-custom-phrase-input"
            className="flex-1 rounded-xl border-2 border-[#EAE3D9] bg-white px-3 py-2 text-sm text-[#5A524D]"
          />
          <label className="wood-card-mustard wood-press p-2 px-3 rounded-xl cursor-pointer flex items-center gap-2" title="Upload">
            <Upload size={16} strokeWidth={3} color="#5A524D" />
            <span className="text-sm font-bold text-[#5A524D]">Upload</span>
            <input
              type="file" accept="audio/*" className="hidden"
              disabled={!customPhrase.trim()}
              onChange={(e) => { if (customPhrase.trim()) onUpload(customPhrase, e.target.files?.[0]); }}
              data-testid="voice-custom-upload"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
