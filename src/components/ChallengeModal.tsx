import React, { useState } from 'react';
import { ChallengeConfig, TimerMode, VisualizerMode, ThemeId, ThemeConfig } from '../types';
import { THEMES } from '../utils/themes';
import { getShareableUrl } from '../utils/challengeUrl';
import { X, Flame, Copy, Check, Play, Zap, Trophy, Sparkles } from 'lucide-react';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchChallenge: (challenge: ChallengeConfig) => void;
  currentTheme: ThemeConfig;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  onLaunchChallenge,
  currentTheme,
}) => {
  const [title, setTitle] = useState('1-Minute Speed Challenge');
  const [mode, setMode] = useState<TimerMode>('countdown');
  const [durationMin, setDurationMin] = useState(1);
  const [durationSec, setDurationSec] = useState(0);
  const [visualizer, setVisualizer] = useState<VisualizerMode>('digital');
  const [theme, setTheme] = useState<ThemeId>('cyberpunk');
  const [timeWarp, setTimeWarp] = useState(true);
  const [sound, setSound] = useState(true);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const challengeTemplates = [
    { title: '1-Minute Plank Sprint', m: 'countdown' as TimerMode, min: 1, sec: 0, v: 'circular' as VisualizerMode, th: 'cyberpunk' as ThemeId },
    { title: 'Rubik\'s Cube Speedrun', m: 'stopwatch' as TimerMode, min: 0, sec: 0, v: 'digital' as VisualizerMode, th: 'sunset-orange' as ThemeId },
    { title: '25m Deep Work Pomodoro', m: 'countdown' as TimerMode, min: 25, sec: 0, v: 'minimal' as VisualizerMode, th: 'midnight-purple' as ThemeId },
    { title: '3-Minute Cold Shower', m: 'countdown' as TimerMode, min: 3, sec: 0, v: 'fluid' as VisualizerMode, th: 'ocean-blue' as ThemeId },
    { title: '100-Pushups Challenge', m: 'stopwatch' as TimerMode, min: 0, sec: 0, v: 'analog' as VisualizerMode, th: 'crimson-red' as ThemeId },
  ];

  const handleApplyTemplate = (tpl: typeof challengeTemplates[0]) => {
    setTitle(tpl.title);
    setMode(tpl.m);
    setDurationMin(tpl.min);
    setDurationSec(tpl.sec);
    setVisualizer(tpl.v);
    setTheme(tpl.th);
    setGeneratedUrl('');
  };

  const handleGenerateLink = () => {
    const durationMs = (durationMin * 60 + durationSec) * 1000;
    const url = getShareableUrl({
      title,
      mode,
      durationMs: mode === 'countdown' ? durationMs : undefined,
      visualizer,
      theme,
      timeWarp,
      sound,
    });
    setGeneratedUrl(url);
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStartNow = () => {
    const durationMs = (durationMin * 60 + durationSec) * 1000;
    const challenge: ChallengeConfig = {
      id: 'custom_' + Date.now(),
      title,
      mode,
      durationMs: mode === 'countdown' ? durationMs : undefined,
      visualizer,
      theme,
      timeWarp,
      sound,
      createdAt: Date.now(),
    };
    onLaunchChallenge(challenge);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Time Challenge Studio</h3>
              <p className="text-xs text-white/50">Configure a challenge & generate a viral shareable link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Templates */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-2">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-1.5">
            {challengeTemplates.map((tpl) => (
              <button
                key={tpl.title}
                onClick={() => handleApplyTemplate(tpl)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-all cursor-pointer"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-1">
              Challenge Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setGeneratedUrl('');
              }}
              maxLength={60}
              placeholder="e.g. 1-Minute Plank Sprint"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                Timer Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setMode('countdown')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'countdown' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Countdown
                </button>
                <button
                  type="button"
                  onClick={() => setMode('stopwatch')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'stopwatch' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Stopwatch
                </button>
              </div>
            </div>

            {mode === 'countdown' && (
              <div>
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                  Target Duration
                </label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={durationMin}
                    onChange={(e) => setDurationMin(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 bg-black/50 border border-white/10 rounded-lg py-1 px-2 text-center text-xs font-mono text-white"
                  />
                  <span className="text-xs text-white/40">m</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={durationSec}
                    onChange={(e) => setDurationSec(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 bg-black/50 border border-white/10 rounded-lg py-1 px-2 text-center text-xs font-mono text-white"
                  />
                  <span className="text-xs text-white/40">s</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                Display Visualizer
              </label>
              <select
                value={visualizer}
                onChange={(e) => setVisualizer(e.target.value as VisualizerMode)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none capitalize"
              >
                <option value="digital">Digital Studio</option>
                <option value="circular">Circular Sweep</option>
                <option value="analog">Analog Chrono</option>
                <option value="fluid">Fluid Wave</option>
                <option value="minimal">Minimal Typography</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeId)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {(Object.keys(THEMES) as ThemeId[]).map((t) => (
                  <option key={t} value={t}>
                    {THEMES[t].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Generated Shareable Link Output */}
        {generatedUrl && (
          <div className="mb-5 p-3 rounded-2xl bg-black/60 border border-amber-500/40">
            <span className="text-[11px] font-bold text-amber-300 block mb-1 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Shareable Challenge URL (Copied!)</span>
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="w-full bg-transparent text-xs text-white/80 font-mono outline-none truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(generatedUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleGenerateLink}
            className="flex-1 py-3 px-4 rounded-xl text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Generate Challenge URL'}</span>
          </button>

          <button
            onClick={handleStartNow}
            className="py-3 px-5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-white/90" />
            <span>Launch Here</span>
          </button>
        </div>
      </div>
    </div>
  );
};
