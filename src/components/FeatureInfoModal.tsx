import React from 'react';
import { X, Info, ExternalLink, Sparkles } from 'lucide-react';

export interface FeatureHelpItem {
  title: string;
  badge?: string;
  description: string;
  howToUse: string[];
  shortcut?: string;
}

export const FEATURE_EXPLANATIONS: Record<string, FeatureHelpItem> = {
  // Visualizers
  visualizer: {
    title: 'Time Visualizer Modes',
    badge: 'Signature Feature',
    description: 'Switch between 5 visually distinct timer displays suited for different use cases and aesthetics: Digital (high contrast numbers), Circular (progress rings), Analog (classic chronograph with sweeping sub-dials), Fluid (animated liquid waves), and Minimal (clean typography).',
    howToUse: [
      'Click any pill in the visualizer bar below the timer to switch modes instantly.',
      'All 5 modes remain synchronized to the exact same millisecond timestamp engine.',
      'Works in both Stopwatch and Countdown modes.'
    ],
  },
  // Stopwatch controls
  start: {
    title: 'Start & Resume Timer',
    badge: 'Core Engine',
    description: 'Launches or resumes the high-accuracy timing engine using sub-millisecond timestamp deltas (performance.now) so timing never drifts even when the browser tab is minimized or inactive.',
    howToUse: [
      'Click the green Start/Resume button with your mouse or tap on touchscreens.',
      'Press the Spacebar anywhere on the page to toggle start/pause.'
    ],
    shortcut: 'Space'
  },
  pause: {
    title: 'Pause Timer',
    badge: 'Core Engine',
    description: 'Freezes the active timer without losing any accumulated elapsed time. You can resume at any time from the exact millisecond you paused.',
    howToUse: [
      'Click the amber Pause button.',
      'Press Spacebar to pause instantly.'
    ],
    shortcut: 'Space'
  },
  reset: {
    title: 'Reset Timer',
    badge: 'Core Engine',
    description: 'Clears the stopwatch back to 00:00.00 and empties the recorded lap table, or resets the countdown timer back to the selected starting duration.',
    howToUse: [
      'Click the red/rose Reset button.',
      'Press the R key on your keyboard.'
    ],
    shortcut: 'R'
  },
  lap: {
    title: 'Lap & Split Timing',
    badge: 'Analytics',
    description: 'Records an individual segment (Lap Time) along with the cumulative session duration (Split Time) without stopping or pausing the running clock.',
    howToUse: [
      'Click the Lap button while the stopwatch is running.',
      'Press the L key on your keyboard to instantly log a lap.',
      'Review pace deltas, fastest/slowest markers, and export to CSV below the timer.'
    ],
    shortcut: 'L'
  },
  // Ghost lap
  ghost: {
    title: 'Ghost Lap Benchmark',
    badge: 'Signature Feature',
    description: 'Compete against your past self! Lock your current stopwatch session as a Ghost Session. On future runs, TIMEFRAME automatically compares each lap in real-time, showing whether you are faster (green) or slower (red) than your benchmark.',
    howToUse: [
      'Record at least one lap, then click "Lock as Ghost Benchmark".',
      'Saved automatically to your device (localStorage) — no account needed.',
      'Start a new run to see live delta comparisons against the ghost run.'
    ],
  },
  // Countdown presets
  presets: {
    title: 'Countdown Presets & Custom Time',
    badge: 'Productivity',
    description: 'Instant quick-launch presets (10s, 30s, 1m, 5m, 10m, 25m Pomodoro) or custom hour:minute:second timer entry with audio fanfare and victory confetti upon completion.',
    howToUse: [
      'Click any duration pill (10s, 1m, 25m, etc.) to set the duration.',
      'Click "Custom" to set specific hours, minutes, and seconds.',
      'Enable browser notifications in Settings to get alerted if you are in another tab.'
    ],
  },
  // Creator Studio
  creator: {
    title: 'Creator Studio & Aspect Framing',
    badge: 'Streamers & Video Creators',
    description: 'Dedicated studio mode designed for YouTube, Twitch, Instagram Reels, and TikTok. Provides true 16:9, 9:16 vertical, and 1:1 square canvas framing, customizable fonts, digit sizing, and color overrides.',
    howToUse: [
      'Click the "Creator" button in the top navigation bar or footer.',
      'Select your aspect ratio (16:9 for YouTube, 9:16 for Reels/Shorts).',
      'Pick a curated theme or use the custom color pickers for your stream palette.'
    ],
  },
  // OBS Overlay
  overlay: {
    title: 'OBS Transparent Stream Overlay',
    badge: 'Live Streaming',
    description: 'Direct browser source for OBS Studio, Streamlabs, and vMix with 100% native alpha transparency. Digits feature heavy outlines so they stay crisp over fast gaming footage or bright camera feeds.',
    howToUse: [
      'In OBS Studio, add a Browser Source.',
      'Set the URL to: http://localhost:5173/#overlay (or your deployed URL).',
      'Set dimensions to 1920x1080. The background is natively transparent with zero chroma artifacts!'
    ],
  },
  // Themes
  themes: {
    title: 'Ambient Themes Gallery (14 Themes)',
    badge: 'Customization',
    description: '14 curated, beautifully balanced visual themes including Midnight Purple, Cyberpunk, Aurora, Deep Space, Neon Green, Sunset Orange, Retro Terminal, Gold, and Pink Neon.',
    howToUse: [
      'Click "Themes" in the top navigation bar.',
      'Click any theme card to preview and apply it instantly across all modes.',
      'Customize accent highlights, digit text color, and background tone.'
    ],
  },
  // Challenges
  challenge: {
    title: 'Time Challenges & Shareable Links',
    badge: 'Community',
    description: 'Create workout, study, or gaming challenges with preset durations, visualizers, and themes, and generate a link to share with friends, students, or viewers.',
    howToUse: [
      'Click the "Challenge" button with the flame icon.',
      'Pick a template (Pomodoro, 100-Pushups, Plank Challenge, Speedrun).',
      'Copy the generated link — when anyone opens it, the exact challenge loads automatically!'
    ],
  },
  // Share Card
  shareCard: {
    title: 'Social Share Card Generator',
    badge: 'Social Media',
    description: 'Transform your completed timing session into an Instagram Story / Reel / YouTube Community post result graphic with custom titles, theme aesthetics, and best lap highlights.',
    howToUse: [
      'After finishing or pausing a timer, click "Generate Shareable Time Card".',
      'Select Story (9:16), Square (1:1), or Landscape (16:9).',
      'Click "Download PNG" or "Share Card" to post directly to social apps.'
    ],
  },
};

interface FeatureInfoModalProps {
  featureKey: string | null;
  onClose: () => void;
}

export const FeatureInfoModal: React.FC<FeatureInfoModalProps> = ({ featureKey, onClose }) => {
  if (!featureKey) return null;
  const item = FEATURE_EXPLANATIONS[featureKey];
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-white animate-scale-up">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">Feature Guide & Instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs sm:text-sm text-white/80">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 leading-relaxed text-white/90">
            {item.description}
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>How To Use</span>
            </h4>
            <ul className="space-y-2 pl-1">
              {item.howToUse.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-purple-600/40 border border-purple-400 text-purple-200 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-white/70 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {item.shortcut && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
              <span className="text-white/60">Keyboard Shortcut:</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 font-mono text-purple-300 font-bold text-xs">
                {item.shortcut}
              </kbd>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 shadow-xl transition-all cursor-pointer"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
