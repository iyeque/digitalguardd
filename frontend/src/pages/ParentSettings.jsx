import { useEffect, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { Button } from "@/components/ui/button";
import { getSettings, updateSettings, listVoices, DEFAULTS } from "@/lib/voice-settings";
import { sayTest } from "@/lib/speech";
import { Volume2, User, UserRound, Maximize2 } from "lucide-react";

export default function ParentSettings() {
  const [settings, setSettings] = useState(getSettings());
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const refresh = () => setVoices(listVoices());
    refresh();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = refresh;
    }
    const t = setTimeout(refresh, 600);
    return () => clearTimeout(t);
  }, []);

  const apply = (patch) => {
    const next = updateSettings(patch);
    setSettings(next);
  };

  const filteredVoices = voices.filter(v =>
    !settings.lang || v.lang.toLowerCase().startsWith(settings.lang.split('-')[0].toLowerCase())
  );

  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  };

  return (
    <Layout title="Settings" hideGear>
      <section className="max-w-3xl mx-auto space-y-6" data-testid="parent-settings">
        {/* Voice gender */}
        <Panel title="Reading voice" subtitle="Pick the kind of voice that reads to Elise.">
          <div className="grid grid-cols-2 gap-4" data-testid="voice-gender-toggle">
            <ToggleCard
              active={settings.gender === 'female'}
              onClick={() => { apply({ gender: 'female', voiceURI: null }); }}
              testId="voice-gender-female"
              icon={<UserRound size={36} strokeWidth={3} color={settings.gender === 'female' ? '#fff' : '#E89D8A'} />}
              label="Female"
              activeClass="wood-card-coral"
            />
            <ToggleCard
              active={settings.gender === 'male'}
              onClick={() => { apply({ gender: 'male', voiceURI: null }); }}
              testId="voice-gender-male"
              icon={<User size={36} strokeWidth={3} color={settings.gender === 'male' ? '#fff' : '#A1BCE3'} />}
              label="Male"
              activeClass="wood-card-blue"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-bold uppercase tracking-wide text-[#8A817C] block mb-2">
              Specific voice ({filteredVoices.length} available)
            </label>
            <select
              value={settings.voiceURI || ''}
              onChange={(e) => apply({ voiceURI: e.target.value || null })}
              data-testid="voice-picker"
              className="w-full rounded-2xl border-2 border-[#EAE3D9] bg-white px-4 py-3 font-semibold text-[#5A524D] text-base"
            >
              <option value="">Auto (best match)</option>
              {filteredVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.gender}) — {v.lang}
                </option>
              ))}
            </select>
          </div>
        </Panel>

        {/* Rate */}
        <Panel title="Talking speed" subtitle="Slower for younger ears, faster for older toddlers.">
          <input
            type="range" min="0.6" max="1.2" step="0.05"
            value={settings.rate}
            onChange={(e) => apply({ rate: parseFloat(e.target.value) })}
            data-testid="voice-rate-slider"
            className="w-full accent-[#9CBFA7]"
          />
          <div className="flex justify-between text-sm font-bold text-[#8A817C] mt-2">
            <span>Slow</span>
            <span data-testid="voice-rate-value">{settings.rate.toFixed(2)}x</span>
            <span>Faster</span>
          </div>
        </Panel>

        {/* Pitch */}
        <Panel title="Voice pitch" subtitle="Higher feels playful; lower feels calm.">
          <input
            type="range" min="0.8" max="1.4" step="0.05"
            value={settings.pitch}
            onChange={(e) => apply({ pitch: parseFloat(e.target.value) })}
            data-testid="voice-pitch-slider"
            className="w-full accent-[#9CBFA7]"
          />
          <div className="flex justify-between text-sm font-bold text-[#8A817C] mt-2">
            <span>Low</span>
            <span>{settings.pitch.toFixed(2)}</span>
            <span>High</span>
          </div>
        </Panel>

        {/* Language */}
        <Panel title="Language" subtitle="Voice language. Vocabulary stays English.">
          <div className="grid grid-cols-3 gap-3" data-testid="lang-picker">
            {[
              { code: 'en-US', label: 'English' },
              { code: 'es-ES', label: 'Español' },
              { code: 'fr-FR', label: 'Français' },
            ].map(l => (
              <button
                key={l.code}
                onClick={() => apply({ lang: l.code, voiceURI: null })}
                data-testid={`lang-${l.code}`}
                className={`wood-press rounded-2xl py-4 font-display font-bold text-lg ${settings.lang === l.code ? 'wood-card-sage text-white' : 'wood-card text-[#5A524D]'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Panel>

        {/* Background music */}
        <Panel title="Background music" subtitle="Gentle lullaby while rhymes play.">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#5A524D]">
              {settings.bgMusicEnabled ? 'On' : 'Off'}
            </span>
            <button
              onClick={() => apply({ bgMusicEnabled: !settings.bgMusicEnabled })}
              data-testid="bg-music-toggle"
              className={`wood-press rounded-full px-7 py-3 font-display font-bold text-lg ${settings.bgMusicEnabled ? 'wood-card-sage text-white' : 'wood-card text-[#5A524D]'}`}
            >
              {settings.bgMusicEnabled ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </Panel>

        {/* Lock orientation / fullscreen */}
        <Panel title="Toddler-safe mode" subtitle="Hide browser chrome and lock landscape on tablets.">
          <button
            onClick={requestFullscreen}
            data-testid="fullscreen-btn"
            className="wood-card-mustard wood-press rounded-full px-7 py-4 inline-flex items-center gap-3"
          >
            <Maximize2 size={24} strokeWidth={3} color="#5A524D" />
            <span className="font-display font-bold text-lg text-[#5A524D]">Enter full-screen</span>
          </button>
        </Panel>

        {/* Test */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={sayTest}
            data-testid="voice-test-btn"
            className="rounded-full bg-[#9CBFA7] hover:bg-[#82A88D] text-white font-display font-bold text-lg px-7 py-6"
          >
            <Volume2 size={20} className="mr-2" /> Test voice
          </Button>
          <Button
            variant="outline"
            onClick={() => apply({ ...DEFAULTS })}
            data-testid="reset-voice-btn"
            className="ml-4 rounded-full border-2 border-[#EAE3D9] text-[#5A524D] font-bold px-6 py-6"
          >
            Reset
          </Button>
        </div>
      </section>
    </Layout>
  );
}

const Panel = ({ title, subtitle, children }) => (
  <div className="rounded-[2rem] bg-white border-2 border-[#EAE3D9] p-6 sm:p-8" style={{ boxShadow: '0 8px 0 0 #EAE3D9' }}>
    <div className="font-display font-bold text-xl sm:text-2xl text-[#5A524D]">{title}</div>
    {subtitle && <div className="text-sm sm:text-base text-[#8A817C] font-medium mb-4">{subtitle}</div>}
    {children}
  </div>
);

const ToggleCard = ({ active, onClick, testId, icon, label, activeClass }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    className={`wood-press rounded-2xl flex flex-col items-center justify-center py-5 ${active ? activeClass + ' text-white' : 'wood-card text-[#5A524D]'}`}
    style={{ minHeight: 110 }}
  >
    {icon}
    <span className="font-display font-bold text-lg mt-2">{label}</span>
  </button>
);
