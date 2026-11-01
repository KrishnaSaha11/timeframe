import React from 'react';
import {
  Timer,
  Clock,
  Tv,
  Ghost,
  Share2,
  Sparkles,
  Zap,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AboutSectionProps {
  onNavigate: (page: any) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in text-white space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Next-Generation Online Timer Studio</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          About TIMEFRAME
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          TIMEFRAME is a precision stopwatch and countdown timer built for creators, athletes, streamers, students, and speedrunners who demand accuracy, aesthetic design, and zero clutter.
        </p>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stopwatch & High Accuracy */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Timer className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">High-Accuracy Timestamp Engine</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Unlike basic web timers that decrement counters using naive intervals (which suffer from browser background throttling and clock drift), TIMEFRAME tracks time deltas using <code>performance.now()</code> and high-refresh <code>requestAnimationFrame</code>. It stays accurate across tab switches and system pauses.
          </p>
        </div>

        {/* Lap vs Split Times Explained */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Lap Time vs. Split Time Explained</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            <strong>Lap Time:</strong> The duration of a single segment or lap (e.g. 25 seconds for lap 2).<br />
            <strong>Split Time:</strong> The total cumulative time elapsed from the initial start until that lap was clicked (e.g. 55 seconds total at lap 2).<br />
            TIMEFRAME tracks both simultaneously with instant delta pacing.
          </p>
        </div>

        {/* Ghost Lap System */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Ghost className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Ghost Lap Real-Time Racing</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Inspired by racing video games, Ghost Lap allows you to race against your own previous recorded session saved safely in your browser’s local storage. You receive immediate color-coded visual feedback indicating whether your current lap is faster (emerald green) or slower (crimson red).
          </p>
        </div>

        {/* Creator Studio & OBS Overlays */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Tv className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">OBS Studio Overlays & Creator Studio</h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Designed for YouTube video recording, gaming challenges, TikToks, and Twitch livestreams. Creators can frame the timer in 16:9, 9:16, or 1:1, or use the direct <code>/#overlay</code> Browser Source URL for 100% native transparency over gameplay and video feeds.
          </p>
        </div>
      </div>

      {/* Guide: How to use with OBS Studio */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-black/80 border border-purple-500/30 backdrop-blur-xl space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span>How to use TIMEFRAME as an OBS Browser Source</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center font-bold">1</span>
            <span className="font-bold text-white block">Copy Overlay URL</span>
            <p className="text-white/60 leading-relaxed">
              Open Creator Studio and click <strong>Copy OBS URL</strong>, or navigate to <code>{typeof window !== 'undefined' ? `${window.location.origin}/#overlay` : 'http://localhost:5173/#overlay'}</code>.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center font-bold">2</span>
            <span className="font-bold text-white block">Add to OBS Scene</span>
            <p className="text-white/60 leading-relaxed">
              In OBS Studio, add a <strong>Browser Source</strong>, paste the link, set width to 1920 and height to 1080. The background is natively transparent!
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center font-bold">3</span>
            <span className="font-bold text-white block">Interact via Hotkeys</span>
            <p className="text-white/60 leading-relaxed">
              Right-click the Browser source and select <strong>Interact</strong> to control your timer using Spacebar, R, and L hotkeys during live recording.
            </p>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Summary Table */}
      <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <h3 className="text-base font-bold text-white mb-3">Global Keyboard Controls</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-white/70">Start / Pause</span>
            <kbd className="px-2 py-1 rounded bg-black/60 border border-white/20 font-mono text-purple-300">Space</kbd>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-white/70">Reset Timer</span>
            <kbd className="px-2 py-1 rounded bg-black/60 border border-white/20 font-mono text-purple-300">R</kbd>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-white/70">Record Lap</span>
            <kbd className="px-2 py-1 rounded bg-black/60 border border-white/20 font-mono text-purple-300">L</kbd>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-white/70">Exit / Close</span>
            <kbd className="px-2 py-1 rounded bg-black/60 border border-white/20 font-mono text-purple-300">Esc</kbd>
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('stopwatch')}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer"
        >
          Launch Stopwatch Studio
        </button>
      </div>
    </div>
  );
};
