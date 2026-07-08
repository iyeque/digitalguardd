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

export default function VoiceLibrary({ childName, activeProfile }) {
  const [clips, setClips] = useState([]);
  const [recordingPhrase, setRecordingPhrase] = useState(null);
  const [customPhrase, setCustomPhrase] = useState("");
  const recRef = useRef(null);
  const chunksRef = useRef([]);

  const refresh = async () => setClips(await listClips());
  useEffect(() => { refresh(); }, []);

  const expand = (phrase) => phrase.replaceAll("{name}", childName || "Elise");
  
  // Scoped key for caregiver profile
  const getScopedKey = (phrase) => `user:${activeProfile.toLowerCase()}:${expand(phrase).toLowerCase()}`;

  const startRec = async (phrase) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const mimeType =
          MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : MediaRecorder.isTypeSupported('audio/mp4')
              ? 'audio/mp4'
              : '';
        const blob = new Blob(chunksRef.current, mimeType ? { type: mimeType } : undefined);
        await saveClip(getScopedKey(phrase), blob, `${expand(phrase)} (${activeProfile})`);
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
    await saveClip(getScopedKey(phrase), file, `${expand(phrase)} (${activeProfile})`);
    refresh();
  };

  const onDelete = async (phrase) => {
    await deleteClip(getScopedKey(phrase));
    refresh();
  };

  const playClip = async (phrase) => {
    const { getClipBlob } = await import("@/lib/voice-clips");
    const blob = await getClipBlob(getScopedKey(phrase));
    if (!blob) return;
    const a = new Audio(URL.createObjectURL(blob));
    a.play();
  };

  const isRecorded = (phrase) => clips.some(c => c.phrase === getScopedKey(phrase).toLowerCase());

  return (
    <div className="space-y-3" data-testid="voice-library">
      <div className="bg-[#FFF9F5] rounded-2xl p-4 border-2 border-[#E89D8A] mb-4">
        <p className="text-sm text-[#5A524D] font-bold">
          Currently recording for: <span className="text-[#E89D8A] uppercase">{activeProfile}</span>
        </p>
        <p className="text-xs text-[#8A817C] mt-1">
          Record phrases in your own voice. The child will hear the version from the active caregiver.
        </p>
      </div>

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
              {recorded && <div className="text-xs text-[#9CBFA7] font-bold">✓ Recorded by {activeProfile}</div>}
            </div>
            <div className="flex gap-2 shrink-0">
              {recorded && (
                <>
                  <button onClick={() => playClip(preset)} className="wood-card wood-press p-2 rounded-xl" title="Play">
                    <Play size={16} strokeWidth={3} color="#9CBFA7" />
                  </button>
                  <button onClick={() => onDelete(preset)} className="wood-card wood-press p-2 rounded-xl" title="Delete">
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
                />
              </label>
              {!isActive ? (
                <button onClick={() => startRec(preset)} className="wood-card-coral wood-press p-2 rounded-xl" title="Record">
                  <Mic size={16} strokeWidth={3} color="#fff" />
                </button>
              ) : (
                <button onClick={stopRec} className="wood-card-blue wood-press p-2 rounded-xl animate-pop" title="Stop">
                  <Square size={16} strokeWidth={3} color="#fff" fill="#fff" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Custom phrase */}
      <div className="rounded-2xl border-2 border-dashed border-[#EAE3D9] p-4 mt-2 bg-[#FDFBF7]">
        <div className="text-sm font-bold text-[#5A524D] mb-2">Add a custom phrase</div>
        <div className="flex flex-col gap-3">
          <input
            value={customPhrase}
            onChange={(e) => setCustomPhrase(e.target.value)}
            placeholder='e.g. "Time for a snack!"'
            className="w-full rounded-xl border-2 border-[#EAE3D9] bg-white px-4 py-3 text-sm font-semibold text-[#5A524D]"
          />
          <div className="flex gap-2">
             <label className="flex-1 wood-card wood-press py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2">
              <Upload size={18} strokeWidth={3} color="#A1BCE3" />
              <span className="text-sm font-bold text-[#5A524D]">Upload</span>
              <input
                type="file" accept="audio/*" className="hidden"
                disabled={!customPhrase.trim()}
                onChange={(e) => { if (customPhrase.trim()) onUpload(customPhrase, e.target.files?.[0]); }}
              />
            </label>
            
            {!recordingPhrase ? (
              <button 
                onClick={() => startRec(customPhrase)}
                disabled={!customPhrase.trim()}
                className="flex-1 wood-card-coral wood-press py-3 rounded-xl flex items-center justify-center gap-2 text-white disabled:opacity-50"
              >
                <Mic size={18} strokeWidth={3} />
                <span className="text-sm font-bold">Record</span>
              </button>
            ) : (
              <button 
                onClick={stopRec}
                className="flex-1 wood-card-blue wood-press py-3 rounded-xl flex items-center justify-center gap-2 text-white"
              >
                <Square size={18} strokeWidth={3} fill="#fff" />
                <span className="text-sm font-bold">Stop</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
