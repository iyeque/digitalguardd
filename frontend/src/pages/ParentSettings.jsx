import { useEffect, useState } from "react";
import { Layout } from "@/components/elise/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSettings, updateSettings, listVoices, DEFAULTS } from "@/lib/voice-settings";
import { sayTest } from "@/lib/speech";
import { AVATARS, AI_MODELS } from "@/lib/data";
import { pushProgress, pushClips, pullAll } from "@/lib/sync";
import { Volume2, User, UserRound, Maximize2, Cloud, Monitor, CloudUpload, CloudDownload, Cpu, DownloadCloud, Sparkles, Heart } from "lucide-react";
import VoiceLibrary from "@/components/elise/VoiceLibrary";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8001`;
const API = `${BACKEND_URL}/api`;

export default function ParentSettings() {
  const [settings, setSettings] = useState(getSettings());
  const [browserVoices, setBrowserVoices] = useState([]);
  const [cloudVoices, setCloudVoices] = useState([]);
  const [cloudAvailable, setCloudAvailable] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);

  useEffect(() => {
    const refresh = () => setBrowserVoices(listVoices());
    refresh();
    if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = refresh;
    const t = setTimeout(refresh, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch(`${API}/tts/voices`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setCloudVoices(data.voices || []);
        setCloudAvailable(!!data.available);
      })
      .catch(() => setCloudAvailable(false));
  }, []);

  const apply = (patch) => { setSettings(updateSettings(patch)); };

  const handlePush = async () => {
    setSyncing(true);
    await pushProgress();
    await pushClips();
    setSyncing(false);
    alert("Data pushed to cloud!");
  };

  const handlePull = async () => {
    setSyncing(true);
    await pullAll();
    setSettings(getSettings());
    setSyncing(false);
    alert("Data pulled from cloud!");
  };

  const handleDownloadModel = async () => {
    const lang = settings.lang || "en-US";
    setDownloadProgress(1);
    try {
      // Piper models are now handled by backend, this is legacy/placeholder
      setDownloadProgress(null);
      apply({ localAiEnabled: true });
    } catch (e) {
      alert("Download failed: " + e.message);
      setDownloadProgress(null);
    }
  };

  const filteredBrowserVoices = browserVoices.filter(v =>
    !settings.lang || v.lang.toLowerCase().startsWith(settings.lang.split('-')[0].toLowerCase())
  );

  const currentModelDownloaded = settings.downloadedModels?.includes(settings.lang || 'en-US');

  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  };

  return (
    <Layout title="Settings" hideGear>
      <section className="max-w-3xl mx-auto space-y-6 pb-10" data-testid="parent-settings">
        {/* Child Name */}
        <Panel title="Child's name" subtitle="We'll greet them on the home screen.">
          <Input
            id="child-name"
            name="childName"
            value={settings.childName || ''}
            onChange={(e) => apply({ childName: e.target.value.slice(0, 24) })}
            placeholder="Elise"
            data-testid="child-name-input"
            className="rounded-2xl border-2 border-[#EAE3D9] py-6 text-lg font-semibold text-[#5A524D]"
          />
        </Panel>

        {/* Caregiver Profile */}
        <Panel title="Active Caregiver" subtitle="Switch whose voice recordings the child hears.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="caregiver-grid">
            {['Mom', 'Dad', 'Grandma', 'Grandpa'].map(profile => (
              <button
                key={profile}
                onClick={() => apply({ activeProfile: profile })}
                className={`wood-press rounded-2xl py-4 flex flex-col items-center justify-center transition ${settings.activeProfile === profile ? 'wood-card-coral text-white' : 'wood-card text-[#5A524D]'}`}
              >
                <Heart size={24} className={`mb-1 ${settings.activeProfile === profile ? 'fill-white' : 'text-[#E89D8A]'}`} />
                <span className="font-bold text-sm">{profile}</span>
              </button>
            ))}
          </div>
        </Panel>

        {/* Avatar Selection */}
        <Panel title="Toddler Avatar" subtitle="Choose a friendly face for your child.">
          <div className="grid grid-cols-4 gap-3" data-testid="avatar-grid">
            {AVATARS.map(a => (
              <button
                key={a.id}
                onClick={() => apply({ avatar: a.id })}
                data-testid={`avatar-${a.id}`}
                className={`wood-press rounded-2xl py-3 flex flex-col items-center justify-center transition ${settings.avatar === a.id ? 'wood-card-sage text-white' : 'wood-card text-[#5A524D]'}`}
              >
                <span className="text-3xl mb-1">{a.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{a.label}</span>
              </button>
            ))}
          </div>
        </Panel>

        {/* Cloud Sync */}
        <Panel title="Cloud Sync" subtitle="Enter a secret code to sync your recordings across devices.">
          <div className="space-y-4">
            <Input
              id="sync-id"
              name="syncId"
              value={settings.syncId || ''}
              onChange={(e) => apply({ syncId: e.target.value.trim() })}
              placeholder="Enter a secret code (e.g. MyFamily2026)"
              className="rounded-2xl border-2 border-[#EAE3D9] py-6 text-lg font-semibold text-[#5A524D]"
            />
            {settings.syncId && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={handlePush}
                  disabled={syncing}
                  className="wood-press wood-card-blue rounded-2xl py-4 flex flex-col items-center justify-center text-white"
                >
                  <CloudUpload size={24} className="mb-1" />
                  <span className="font-bold text-sm">Push to Cloud</span>
                </button>
                <button
                  onClick={handlePull}
                  disabled={syncing}
                  className="wood-press wood-card-sage rounded-2xl py-4 flex flex-col items-center justify-center text-white"
                >
                  <CloudDownload size={24} className="mb-1" />
                  <span className="font-bold text-sm">Pull from Cloud</span>
                </button>
              </div>
            )}
          </div>
        </Panel>

        {/* TTS engine */}
        <Panel title="Voice engine" subtitle={cloudAvailable ? "Cloud voices sound much more natural." : "Cloud voices unavailable — using device voices."}>
          <div className="grid grid-cols-2 gap-3" data-testid="tts-engine-toggle">
            <ToggleCard
              active={settings.useCloudTts && cloudAvailable}
              onClick={() => apply({ useCloudTts: true })}
              testId="tts-engine-cloud"
              icon={<Cloud size={32} strokeWidth={3} color={settings.useCloudTts && cloudAvailable ? '#fff' : '#9CBFA7'} />}
              label="Cloud (best)"
              activeClass="wood-card-sage"
              disabled={!cloudAvailable}
            />
            <ToggleCard
              active={!settings.useCloudTts}
              onClick={() => apply({ useCloudTts: false })}
              testId="tts-engine-browser"
              icon={<Monitor size={32} strokeWidth={3} color={!settings.useCloudTts ? '#fff' : '#A1BCE3'} />}
              label="Device"
              activeClass="wood-card-blue"
            />
          </div>
        </Panel>

        {/* Cloud voice picker */}
        {settings.useCloudTts && cloudAvailable && (
          <Panel title="Cloud voice" subtitle="Pick the personality that reads aloud.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="cloud-voice-grid">
              {cloudVoices.map(v => (
                <button
                  key={v.id}
                  onClick={() => apply({ cloudVoice: v.id })}
                  data-testid={`cloud-voice-${v.id}`}
                  className={`wood-press rounded-2xl py-4 px-3 text-left transition ${settings.cloudVoice === v.id ? (v.gender === 'male' ? 'wood-card-blue' : v.gender === 'female' ? 'wood-card-coral' : 'wood-card-sage') + ' text-white' : 'wood-card text-[#5A524D]'}`}
                >
                  <div className="font-display font-bold text-lg capitalize">{v.id}</div>
                  <div className="text-xs font-bold opacity-90">{v.label.replace(/^[A-Z][a-z]+\s/, '')}</div>
                  <div className="text-[10px] uppercase tracking-widest mt-1 opacity-80">{v.gender}</div>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {/* Browser voice gender + picker */}
        {(!settings.useCloudTts || !cloudAvailable) && (
          <Panel title="Device voice" subtitle="Choose a voice your device has installed.">
            <div className="grid grid-cols-2 gap-4" data-testid="voice-gender-toggle">
              <ToggleCard
                active={settings.gender === 'female'}
                onClick={() => apply({ gender: 'female', voiceURI: null })}
                testId="voice-gender-female"
                icon={<UserRound size={32} strokeWidth={3} color={settings.gender === 'female' ? '#fff' : '#E89D8A'} />}
                label="Female"
                activeClass="wood-card-coral"
              />
              <ToggleCard
                active={settings.gender === 'male'}
                onClick={() => apply({ gender: 'male', voiceURI: null })}
                testId="voice-gender-male"
                icon={<User size={32} strokeWidth={3} color={settings.gender === 'male' ? '#fff' : '#A1BCE3'} />}
                label="Male"
                activeClass="wood-card-blue"
              />
            </div>
            <div className="mt-5">
              <label className="text-sm font-bold uppercase tracking-wide text-[#8A817C] block mb-2">
                Specific voice ({filteredBrowserVoices.length} available)
              </label>
              <select
                value={settings.voiceURI || ''}
                onChange={(e) => apply({ voiceURI: e.target.value || null })}
                data-testid="voice-picker"
                className="w-full rounded-2xl border-2 border-[#EAE3D9] bg-white px-4 py-3 font-semibold text-[#5A524D] text-base"
              >
                <option value="">Auto (best match)</option>
                {filteredBrowserVoices.map((v, index) => (
                  <option key={`${v.voiceURI}-${index}`} value={v.voiceURI}>
                    {`${v.name} (${v.gender}) — ${v.lang}`}
                  </option>
                ))}
              </select>
            </div>
          </Panel>
        )}

        {/* Phonics */}
        <Panel title="Phonics mode (ABC)" subtitle="Speak letter sounds (buh) instead of names (bee).">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#5A524D]">{settings.phonicsMode ? 'On' : 'Off'}</span>
            <button
              onClick={() => apply({ phonicsMode: !settings.phonicsMode })}
              data-testid="phonics-toggle"
              className={`wood-press rounded-full px-7 py-3 font-display font-bold text-lg ${settings.phonicsMode ? 'wood-card-sage text-white' : 'wood-card text-[#5A524D]'}`}
            >
              {settings.phonicsMode ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </Panel>

        {/* Speed & Pitch (apply to both engines where supported) */}
        <Panel title="Talking speed" subtitle="Slower for younger ears.">
          <input
            type="range" min="0.6" max="1.2" step="0.05"
            value={settings.rate}
            onChange={(e) => apply({ rate: parseFloat(e.target.value) })}
            data-testid="voice-rate-slider"
            className="w-full accent-[#9CBFA7]"
          />
          <div className="flex justify-between text-sm font-bold text-[#8A817C] mt-2">
            <span>Slow</span><span data-testid="voice-rate-value">{settings.rate.toFixed(2)}x</span><span>Faster</span>
          </div>
        </Panel>

        <Panel title="Voice pitch (device only)" subtitle="Cloud voices have a fixed pitch.">
          <input
            type="range" min="0.8" max="1.4" step="0.05"
            value={settings.pitch}
            onChange={(e) => apply({ pitch: parseFloat(e.target.value) })}
            data-testid="voice-pitch-slider"
            className="w-full accent-[#9CBFA7]"
          />
          <div className="flex justify-between text-sm font-bold text-[#8A817C] mt-2">
            <span>Low</span><span>{settings.pitch.toFixed(2)}</span><span>High</span>
          </div>
        </Panel>

        {/* Language */}
        <Panel title="Language" subtitle="TTS language (vocab stays English for now).">
          <div className="grid grid-cols-3 gap-3" data-testid="lang-picker">
            {[
              { code: 'en-US', label: 'English' },
              { code: 'es-ES', label: 'Español' },
              { code: 'fr-FR', label: 'Français' },
              { code: 'sw-KE', label: 'Kiswahili' },
              { code: 'ar-SA', label: 'العربية' },
              { code: 'de-DE', label: 'Deutsch' },
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

        {/* Daily session limit */}
        <Panel title="Daily session limit" subtitle={settings.dailyLimitMins ? `Reminder after ${settings.dailyLimitMins} minutes per day.` : 'No reminder set.'}>
          <input
            type="range" min="0" max="60" step="5"
            value={settings.dailyLimitMins || 0}
            onChange={(e) => apply({ dailyLimitMins: parseInt(e.target.value, 10) })}
            data-testid="daily-limit-slider"
            className="w-full accent-[#F2CA7E]"
          />
          <div className="flex justify-between text-sm font-bold text-[#8A817C] mt-2">
            <span>Off</span>
            <span data-testid="daily-limit-value">
              {settings.dailyLimitMins ? `${settings.dailyLimitMins} min/day` : 'No limit'}
            </span>
            <span>60 min</span>
          </div>
        </Panel>

        {/* Background music */}
        <Panel title="Background music (rhymes)" subtitle="Gentle lullaby while rhymes play.">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#5A524D]">{settings.bgMusicEnabled ? 'On' : 'Off'}</span>
            <button
              onClick={() => apply({ bgMusicEnabled: !settings.bgMusicEnabled })}
              data-testid="bg-music-toggle"
              className={`wood-press rounded-full px-7 py-3 font-display font-bold text-lg ${settings.bgMusicEnabled ? 'wood-card-sage text-white' : 'wood-card text-[#5A524D]'}`}
            >
              {settings.bgMusicEnabled ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </Panel>

        <Panel title="Toddler-safe mode" subtitle="Hide browser chrome and lock landscape.">
          <button
            onClick={requestFullscreen}
            data-testid="fullscreen-btn"
            className="wood-card-mustard wood-press rounded-full px-7 py-4 inline-flex items-center gap-3"
          >
            <Maximize2 size={24} strokeWidth={3} color="#5A524D" />
            <span className="font-display font-bold text-lg text-[#5A524D]">Enter full-screen</span>
          </button>
        </Panel>

        {/* Custom voice library */}
        <Panel title="Your own voice clips" subtitle="Record or upload phrases — they'll play automatically when the app says them.">
          <VoiceLibrary childName={settings.childName} activeProfile={settings.activeProfile} />
        </Panel>

        <div className="flex justify-center gap-3 pt-2 flex-wrap">
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
            className="rounded-full border-2 border-[#EAE3D9] text-[#5A524D] font-bold px-6 py-6"
          >
            Reset all
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

const ToggleCard = ({ active, onClick, testId, icon, label, activeClass, disabled }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    data-testid={testId}
    className={`wood-press rounded-2xl flex flex-col items-center justify-center py-5 ${active ? activeClass + ' text-white' : 'wood-card text-[#5A524D]'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    style={{ minHeight: 110 }}
  >
    {icon}
    <span className="font-display font-bold text-lg mt-2">{label}</span>
  </button>
);
