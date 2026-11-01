import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { ThemeConfig, Lap, TimerMode, ChallengeConfig } from '../types';
import { FormattedTime, formatMilliseconds } from '../utils/time';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Square,
  Monitor,
  ArrowLeft,
  Flame,
  Trophy,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  time: FormattedTime;
  rawMs: number;
  mode: TimerMode;
  laps: Lap[];
  theme: ThemeConfig;
  activeChallenge?: ChallengeConfig | null;
  totalDurationMs?: number;
  isFinished?: boolean;
}

type AspectRatio = 'story' | 'square' | 'landscape';
type TimeDisplayOption = 'current' | 'target' | 'elapsed';

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  time,
  rawMs,
  mode,
  laps,
  theme,
  activeChallenge,
  totalDurationMs = 60000,
  isFinished = false,
}) => {
  const [aspect, setAspect] = useState<AspectRatio>('story');
  const [sessionTitle, setSessionTitle] = useState<string>('Sprint Lap Record');
  const [timeDisplayOption, setTimeDisplayOption] = useState<TimeDisplayOption>('current');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Synchronize title whenever challenge or modal opens
  useEffect(() => {
    if (isOpen) {
      if (activeChallenge?.title) {
        setSessionTitle(activeChallenge.title);
      } else if (mode === 'countdown') {
        setSessionTitle('Focus Session');
      } else {
        setSessionTitle('Sprint Lap Record');
      }

      // If timer is finished in countdown mode, default to showing the target goal achieved!
      if (isFinished && mode === 'countdown') {
        setTimeDisplayOption('target');
      } else {
        setTimeDisplayOption('current');
      }
    }
  }, [isOpen, activeChallenge, mode, isFinished]);

  if (!isOpen) return null;

  // Best lap calculation
  let bestLapTime: number | null = null;
  if (laps.length > 0) {
    bestLapTime = Math.min(...laps.map((l) => l.lapTime));
  }
  const bestLapFmt = bestLapTime ? formatMilliseconds(bestLapTime) : null;

  // Formatted display date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate target duration
  const targetMs = activeChallenge?.durationMs || activeChallenge?.targetTimeMs || totalDurationMs || 60000;
  const targetFmt = formatMilliseconds(targetMs);

  // Calculate elapsed duration for countdown
  const countdownElapsedMs = Math.max(0, targetMs - rawMs);
  const elapsedFmt = formatMilliseconds(mode === 'stopwatch' ? rawMs : countdownElapsedMs);

  // Determine which time object to display on the card
  let activeDisplayTime = time;
  if (timeDisplayOption === 'target') {
    activeDisplayTime = targetFmt;
  } else if (timeDisplayOption === 'elapsed') {
    activeDisplayTime = elapsedFmt;
  }

  // Completeness percentage
  let completenessPercent = 100;
  if (mode === 'countdown') {
    if (isFinished) {
      completenessPercent = 100;
    } else {
      completenessPercent = Math.min(100, Math.max(0, Math.round(((targetMs - rawMs) / targetMs) * 100)));
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Ultra-crisp 3x retina quality for Instagram Reels & Stories
      });
      const link = document.createElement('a');
      link.download = `TIMEFRAME-${sessionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to export card image', e);
      handleCopyText();
      alert('PNG generation fallback: copied formatted session summary to your clipboard!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        const dataUrl = await toPng(cardRef.current, { pixelRatio: 2.5 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'timeframe-achievement-card.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `TIMEFRAME — ${sessionTitle}`,
            text: `🔥 ${sessionTitle}: ${activeDisplayTime.displayTime} achieved on TIMEFRAME Studio! ⏱️`,
            files: [file],
          });
          return;
        } else {
          await navigator.share({
            title: `TIMEFRAME — ${sessionTitle}`,
            text: `🔥 ${sessionTitle}: ${activeDisplayTime.displayTime} achieved on TIMEFRAME Studio! ⏱️`,
            url: window.location.href,
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Share API cancelled or not supported', e);
    } finally {
      setIsExporting(false);
    }

    handleCopyText();
  };

  const handleCopyText = () => {
    const text = `🏆 TIMEFRAME ACHIEVEMENT RECORD\nSession: ${sessionTitle}\nResult: ${activeDisplayTime.displayTime}\nMode: ${mode.toUpperCase()}${
      activeChallenge ? `\nChallenge: ${activeChallenge.title}` : ''
    }${
      mode === 'countdown' ? `\nTarget Duration: ${targetFmt.displayTime} (${completenessPercent}% Complete)` : ''
    }${
      bestLapFmt ? `\nBest Lap: ${bestLapFmt.displayTime} (Total Laps: ${laps.length})` : ''
    }\nTheme: ${theme.name}\nPrecision-timed on https://timeframe.app`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Card aspect sizing
  const getAspectClasses = () => {
    switch (aspect) {
      case 'square':
        return 'w-[320px] h-[320px] sm:w-[390px] sm:h-[390px]';
      case 'landscape':
        return 'w-[340px] h-[210px] sm:w-[500px] sm:h-[280px]';
      case 'story':
      default:
        return 'w-[310px] h-[520px] sm:w-[350px] sm:h-[590px]';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl relative text-white animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              title="Go Back to Timer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Shareable Achievement Card</span>
                  {activeChallenge && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Challenge Mode
                    </span>
                  )}
                </h3>
                <p className="text-xs text-white/50">Export high-resolution cards for Reels, Stories & Posts</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close and return to timer"
            title="Close [Esc]"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Title Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                Card Achievement Title
              </label>
              {activeChallenge && sessionTitle !== activeChallenge.title && (
                <button
                  type="button"
                  onClick={() => setSessionTitle(activeChallenge.title)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset to Challenge</span>
                </button>
              )}
            </div>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              maxLength={45}
              placeholder="e.g. 1-Minute Plank Sprint"
              className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400 font-semibold"
            />
          </div>

          {/* Social Aspect Selector */}
          <div>
            <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-1">
              Format & Aspect Ratio
            </label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setAspect('story')}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  aspect === 'story'
                    ? 'bg-purple-600/40 border-purple-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16 Story</span>
              </button>
              <button
                onClick={() => setAspect('square')}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  aspect === 'square'
                    ? 'bg-purple-600/40 border-purple-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>1:1 Post</span>
              </button>
              <button
                onClick={() => setAspect('landscape')}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  aspect === 'landscape'
                    ? 'bg-purple-600/40 border-purple-400 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>16:9 Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Optional Time Display Selector (for Countdown/Challenge) */}
        {mode === 'countdown' && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/10 mb-3 text-xs">
            <span className="text-white/60 font-medium">Display on Card:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTimeDisplayOption('target')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  timeDisplayOption === 'target'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                Target Goal ({targetFmt.displayTime})
              </button>
              <button
                type="button"
                onClick={() => setTimeDisplayOption('current')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  timeDisplayOption === 'current'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                Remaining ({time.displayTime})
              </button>
              <button
                type="button"
                onClick={() => setTimeDisplayOption('elapsed')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  timeDisplayOption === 'elapsed'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                Elapsed ({elapsedFmt.displayTime})
              </button>
            </div>
          </div>
        )}

        {/* Live Card Preview (Export Target) */}
        <div className="flex items-center justify-center py-3 sm:py-5 bg-black/60 rounded-2xl border border-white/5 overflow-hidden">
          <div
            ref={cardRef}
            className={`relative flex flex-col justify-between p-5 sm:p-7 rounded-3xl border border-white/25 shadow-2xl transition-all duration-300 overflow-hidden ${theme.bgGradient} ${getAspectClasses()}`}
            style={{
              boxShadow: `0 25px 60px -10px ${theme.accentGlow}, inset 0 0 40px -10px ${theme.accentGlow}`,
            }}
          >
            {/* Ambient Background Glow Radiance */}
            <div
              className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-50 pointer-events-none"
              style={{ backgroundColor: activeChallenge ? '#f59e0b' : theme.accent }}
            />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full blur-3xl opacity-35 pointer-events-none bg-blue-600" />

            {/* Subtle Geometric Diagonal Hatch Overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* TOP BAR: Brand, Verified Badge, Date */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-black shadow-lg"
                  style={{
                    background: activeChallenge
                      ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                      : `linear-gradient(135deg, ${theme.accent}, #6366f1)`,
                  }}
                >
                  TF
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-xs sm:text-sm tracking-tight text-white font-sans">
                      TIMEFRAME
                    </span>
                    <span className="text-[8px] font-extrabold uppercase px-1 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                      STUDIO
                    </span>
                  </div>
                  <span className="text-[9px] text-white/50 tracking-wider block font-mono">
                    PRECISION TIMING ENGINE
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end space-x-1 text-[10px] font-mono tracking-widest uppercase text-white/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>VERIFIED</span>
                </div>
                <span className="text-[9px] text-white/40 font-mono tracking-wider">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* MIDDLE HERO: Challenge Pill, Bold Digits, Progress & Completeness */}
            <div className="relative z-10 my-auto text-center py-2 flex flex-col items-center">
              {/* Category / Achievement Ribbon */}
              <div className="mb-2 sm:mb-3">
                {activeChallenge ? (
                  <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/25 via-purple-500/25 to-blue-500/25 border border-amber-500/50 backdrop-blur-md shadow-lg">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-amber-300">
                      {sessionTitle}
                    </span>
                  </div>
                ) : isFinished ? (
                  <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 backdrop-blur-md shadow-lg">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-yellow-200">
                      {sessionTitle} • COMPLETED
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white/90">
                      {sessionTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Main Number Display with High-Impact Contrast */}
              <div className="tabular-nums font-mono font-black text-white tracking-tight flex items-baseline justify-center select-none my-1">
                <span
                  className={
                    aspect === 'landscape'
                      ? 'text-4xl sm:text-5xl drop-shadow-md'
                      : aspect === 'square'
                      ? 'text-5xl sm:text-6xl drop-shadow-lg'
                      : 'text-5xl sm:text-6xl md:text-7xl drop-shadow-xl'
                  }
                >
                  {activeDisplayTime.hasHours
                    ? `${activeDisplayTime.hours}:${activeDisplayTime.minutes}:${activeDisplayTime.seconds}`
                    : `${activeDisplayTime.minutes}:${activeDisplayTime.seconds}`}
                </span>
                <span
                  className={
                    aspect === 'landscape'
                      ? 'text-2xl sm:text-3xl ml-1 font-bold'
                      : 'text-3xl sm:text-4xl ml-1 font-bold'
                  }
                  style={{
                    color: activeChallenge ? '#fbbf24' : theme.accent,
                    filter: `drop-shadow(0 0 12px ${activeChallenge ? '#f59e0b' : theme.accent})`,
                  }}
                >
                  .{activeDisplayTime.milliseconds}
                </span>
              </div>

              {/* Sub-label for digits */}
              <div className="flex items-center justify-center space-x-6 text-[9px] font-mono tracking-widest text-white/40 uppercase mb-3">
                <span>MINUTES</span>
                <span>SECONDS</span>
                <span>MS</span>
              </div>

              {/* Completeness / Progress Visual Meter */}
              {mode === 'countdown' && (
                <div className="w-full max-w-[260px] sm:max-w-[280px] mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-white/60">
                    <span className="flex items-center space-x-1">
                      <Target className="w-3 h-3 text-amber-400" />
                      <span>Goal: {targetFmt.displayTime}</span>
                    </span>
                    <span className="font-bold text-amber-300">
                      {isFinished ? '100% DONE' : `${completenessPercent}% COMPLETE`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/10 p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-md"
                      style={{
                        width: `${completenessPercent}%`,
                        background:
                          completenessPercent >= 100
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : `linear-gradient(90deg, ${theme.accent}, #fbbf24)`,
                        boxShadow: `0 0 10px ${activeChallenge ? '#f59e0b' : theme.accent}`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 3-Column Glass Metric Badges */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full max-w-[310px] mt-1">
                <div className="p-1.5 sm:p-2 rounded-xl bg-white/[0.06] border border-white/10 text-center">
                  <span className="text-[8px] uppercase tracking-wider text-white/40 block font-mono">
                    MODE
                  </span>
                  <span className="text-[11px] font-bold text-white uppercase block line-clamp-1">
                    {mode}
                  </span>
                </div>

                <div className="p-1.5 sm:p-2 rounded-xl bg-white/[0.06] border border-white/10 text-center">
                  <span className="text-[8px] uppercase tracking-wider text-white/40 block font-mono">
                    {bestLapFmt ? 'BEST LAP' : mode === 'countdown' ? 'TARGET' : 'STATUS'}
                  </span>
                  <span className="text-[11px] font-bold text-amber-300 font-mono block line-clamp-1">
                    {bestLapFmt
                      ? bestLapFmt.displayTime
                      : mode === 'countdown'
                      ? targetFmt.displayTime
                      : 'COMPLETED'}
                  </span>
                </div>

                <div className="p-1.5 sm:p-2 rounded-xl bg-white/[0.06] border border-white/10 text-center">
                  <span className="text-[8px] uppercase tracking-wider text-white/40 block font-mono">
                    PRECISION
                  </span>
                  <span className="text-[11px] font-bold text-emerald-300 font-mono flex items-center justify-center space-x-0.5">
                    <Zap className="w-2.5 h-2.5" />
                    <span>0.1ms</span>
                  </span>
                </div>
              </div>
            </div>

            {/* BOTTOM WATERMARK: Verified Signature & Link */}
            <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-white/15 text-[9px] sm:text-[10px] text-white/50">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                <span className="font-mono uppercase tracking-wider">{theme.name} Edition</span>
              </div>
              <span className="font-bold tracking-widest text-white/80 font-mono">
                timeframe.app
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Timer</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 py-3 px-4 rounded-xl text-black font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              boxShadow: '0 8px 25px -4px rgba(245, 158, 11, 0.4)',
            }}
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating High-Res Card...' : 'Download PNG Card'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 py-3 px-4 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-purple-300" />
            <span>Share Card</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
