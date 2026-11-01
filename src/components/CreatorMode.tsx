import React, { useState, useEffect, useRef } from 'react';
import { FormattedTime, formatMilliseconds } from '../utils/time';
import {
  ThemeConfig,
  TimerMode,
  VisualizerMode,
  DigitSize,
  TimerFont,
  CreatorAspect,
  ThemeId,
  BackgroundStyle,
} from '../types';
import { THEMES, FONT_OPTIONS } from '../utils/themes';
import { VisualizerContainer } from './visualizers/VisualizerContainer';
import {
  Maximize,
  Minimize,
  Sliders,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Tv,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Palette,
  Layers,
  Sparkles,
  Smartphone,
  Square,
  Monitor,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Settings,
} from 'lucide-react';

interface CreatorModeProps {
  isOpen: boolean;
  onClose: () => void;
  mode: TimerMode;
  visualizer: VisualizerMode;
  onChangeVisualizer: (v: VisualizerMode) => void;
  time: FormattedTime;
  rawMs: number;
  totalDurationMs?: number;
  isRunning: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
  activeTheme: ThemeConfig;
  onSelectTheme: (themeId: ThemeId) => void;
  font: TimerFont;
  onChangeFont: (font: TimerFont) => void;
  digitSize: DigitSize;
  onChangeDigitSize: (size: DigitSize) => void;
  // Custom Color Overrides
  customBgColor?: string;
  onCustomBgColorChange: (color?: string) => void;
  customTextColor?: string;
  onCustomTextColorChange: (color?: string) => void;
  customAccentColor?: string;
  onCustomAccentColorChange: (color?: string) => void;
}

type PreviewBackgroundTest = 'transparent' | 'checkerboard' | 'gaming' | 'camera' | 'white';

export const CreatorMode: React.FC<CreatorModeProps> = ({
  isOpen,
  onClose,
  mode,
  visualizer,
  onChangeVisualizer,
  time,
  rawMs,
  totalDurationMs,
  isRunning,
  hasStarted,
  onStart,
  onPause,
  onReset,
  onLap,
  activeTheme,
  onSelectTheme,
  font,
  onChangeFont,
  digitSize,
  onChangeDigitSize,
  customBgColor,
  onCustomBgColorChange,
  customTextColor,
  onCustomTextColorChange,
  customAccentColor,
  onCustomAccentColorChange,
}) => {
  const [aspect, setAspect] = useState<CreatorAspect>('16-9');
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [overlayStyle, setOverlayStyle] = useState<'normal' | 'transparent' | 'chroma-green' | 'chroma-blue'>('normal');
  const [previewTestBg, setPreviewTestBg] = useState<PreviewBackgroundTest>('transparent');

  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [showStudioPanel, setShowStudioPanel] = useState(false); // Collapsible on mobile
  const [showObsHelp, setShowObsHelp] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  // Auto-hide controls during active running when mouse is idle
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = () => {
      setIsControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (isRunning && !showStudioPanel) {
        hideTimerRef.current = window.setTimeout(() => {
          setIsControlsVisible(false);
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isOpen, isRunning, showStudioPanel]);

  // Fullscreen API toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Copy OBS Browser Source Direct URL
  const handleCopyObsUrl = () => {
    const origin = window.location.origin;
    const obsUrl = `${origin}/#overlay`;
    navigator.clipboard?.writeText(obsUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  if (!isOpen) return null;

  // Background styling based on overlay selection and preview background test
  const getContainerBackground = () => {
    if (overlayStyle === 'chroma-green') return 'bg-[#00ff00]';
    if (overlayStyle === 'chroma-blue') return 'bg-[#0000ff]';
    if (overlayStyle === 'transparent') {
      if (previewTestBg === 'checkerboard') {
        return 'bg-[linear-gradient(45deg,#1f2430_25%,transparent_25%),linear-gradient(-45deg,#1f2430_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f2430_75%),linear-gradient(-45deg,transparent_75%,#1f2430_75%)] bg-[size:20px_20px] bg-[#121620]';
      }
      if (previewTestBg === 'gaming') {
        return 'bg-gradient-to-br from-[#1a1c29] via-[#0f172a] to-[#2e1065]';
      }
      if (previewTestBg === 'camera') {
        return 'bg-gradient-to-b from-[#27272a] via-[#18181b] to-[#09090b]';
      }
      if (previewTestBg === 'white') {
        return 'bg-slate-100 text-black';
      }
      return 'bg-transparent';
    }
    return customBgColor ? '' : activeTheme.bgGradient;
  };

  // Dimension framing classes that actually resize the view
  const getAspectFrameStyles = () => {
    switch (aspect) {
      case '16-9':
        return {
          aspectRatio: '16 / 9',
          maxWidth: '100%',
          maxHeight: '80vh',
          width: '1000px',
        };
      case '9-16':
        return {
          aspectRatio: '9 / 16',
          maxHeight: '84vh',
          width: '420px',
        };
      case '1-1':
        return {
          aspectRatio: '1 / 1',
          maxHeight: '78vh',
          width: '560px',
        };
      case 'custom':
        return {
          width: `${Math.min(1200, Math.max(280, customWidth))}px`,
          height: `${Math.min(800, Math.max(200, customHeight))}px`,
          maxWidth: '96vw',
          maxHeight: '80vh',
        };
      case 'auto':
      default:
        return {
          width: '100%',
          height: '100%',
        };
    }
  };

  // Text color override or active theme
  const effectiveTheme: ThemeConfig = {
    ...activeTheme,
    accent: customAccentColor || activeTheme.accent,
    accentGlow: customAccentColor ? `${customAccentColor}80` : activeTheme.accentGlow,
    digitColor: customTextColor || activeTheme.digitColor,
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-2 sm:p-4 transition-all duration-300 overflow-hidden ${getContainerBackground()} ${
        !isControlsVisible && isRunning ? 'cursor-none' : 'cursor-default'
      }`}
      style={customBgColor && overlayStyle === 'normal' ? { backgroundColor: customBgColor } : {}}
    >
      {/* Top Floating Creator HUD (Auto-hiding during timer run) */}
      <header
        className={`w-full max-w-7xl flex flex-wrap items-center justify-between gap-2 z-40 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Left: Mode Title & Aspect Toggles */}
        <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Tv className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-xs font-bold text-white hidden md:inline">Creator Studio</span>

          {/* Aspect Ratio Selector Pills */}
          <div className="flex items-center space-x-1 pl-1">
            <button
              onClick={() => setAspect('16-9')}
              title="16:9 Landscape for YouTube & Twitch"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                aspect === '16-9' ? 'bg-purple-600/40 border-purple-400 text-white' : 'bg-white/5 border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">16:9</span>
            </button>
            <button
              onClick={() => setAspect('9-16')}
              title="9:16 Vertical for Reels, Shorts & TikTok"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                aspect === '9-16' ? 'bg-purple-600/40 border-purple-400 text-white' : 'bg-white/5 border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">9:16</span>
            </button>
            <button
              onClick={() => setAspect('1-1')}
              title="1:1 Square"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                aspect === '1-1' ? 'bg-purple-600/40 border-purple-400 text-white' : 'bg-white/5 border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1:1</span>
            </button>
            <button
              onClick={() => setAspect('auto')}
              title="Full Window Unconstrained"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                aspect === 'auto' ? 'bg-purple-600/40 border-purple-400 text-white' : 'bg-white/5 border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full</span>
            </button>
          </div>
        </div>

        {/* Center: Overlay Mode Switcher & OBS Direct URL */}
        <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
          <select
            value={overlayStyle}
            onChange={(e) => setOverlayStyle(e.target.value as any)}
            className="bg-white/10 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 border border-white/10 focus:outline-none"
          >
            <option value="normal" className="bg-slate-900">Studio Backdrop</option>
            <option value="transparent" className="bg-slate-900">OBS Transparent Layer</option>
            <option value="chroma-green" className="bg-slate-900">Chroma Green (#00FF00)</option>
            <option value="chroma-blue" className="bg-slate-900">Chroma Blue (#0000FF)</option>
          </select>

          {/* Test Background Selector when in Transparent mode */}
          {overlayStyle === 'transparent' && (
            <select
              value={previewTestBg}
              onChange={(e) => setPreviewTestBg(e.target.value as PreviewBackgroundTest)}
              title="Test timer contrast over different backgrounds"
              className="bg-purple-950/60 text-purple-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 border border-purple-500/30 focus:outline-none"
            >
              <option value="checkerboard" className="bg-slate-900">Preview: Checkerboard</option>
              <option value="gaming" className="bg-slate-900">Preview: Game Feed</option>
              <option value="camera" className="bg-slate-900">Preview: Dark Camera</option>
              <option value="white" className="bg-slate-900">Preview: Bright White</option>
              <option value="transparent" className="bg-slate-900">Preview: True Transparent</option>
            </select>
          )}

          <button
            onClick={handleCopyObsUrl}
            title="Copy direct OBS Browser Source URL"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedUrl ? 'Copied URL!' : 'Copy OBS URL'}</span>
          </button>

          <button
            onClick={() => setShowObsHelp(true)}
            title="OBS Studio setup guide"
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Studio Customizer Drawer, Fullscreen & Exit Studio */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStudioPanel(!showStudioPanel)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl border text-xs font-bold shadow-xl transition-all cursor-pointer ${
              showStudioPanel
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-black/70 backdrop-blur-xl border-white/10 text-white/80 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Theme & Colors</span>
            {showStudioPanel ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            onClick={toggleFullScreen}
            title="Toggle native fullscreen"
            className="p-2 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-2xl bg-white text-black font-extrabold text-xs hover:bg-white/90 shadow-xl transition-all cursor-pointer"
          >
            Exit Studio
          </button>
        </div>
      </header>

      {/* Main Studio Frame Canvas */}
      <main className="flex-1 w-full flex items-center justify-center relative p-2 overflow-hidden">
        <div
          style={getAspectFrameStyles()}
          className={`relative flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl transition-all duration-300 ${
            aspect !== 'auto' ? 'border border-white/20 shadow-2xl bg-black/30 backdrop-blur-md overflow-hidden' : ''
          }`}
        >
          {/* Subtle Aspect Ratio Badge in top corner */}
          {aspect !== 'auto' && (
            <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest uppercase text-white/40 pointer-events-none">
              Frame: {aspect}
            </div>
          )}

          {/* High-legibility drop-shadow wrap */}
          <div
            className="w-full flex items-center justify-center"
            style={{
              filter: overlayStyle === 'transparent' ? 'drop-shadow(0 2px 10px rgba(0,0,0,0.95)) drop-shadow(0 0 2px #000)' : undefined,
            }}
          >
            <VisualizerContainer
              mode={mode}
              visualizer={visualizer}
              onChangeVisualizer={onChangeVisualizer}
              time={time}
              rawMs={rawMs}
              totalDurationMs={totalDurationMs}
              isRunning={isRunning}
              theme={effectiveTheme}
              digitSize={digitSize}
              font={font}
            />
          </div>
        </div>

        {/* Floating Customizer Drawer (Collapsible & Mobile friendly!) */}
        {showStudioPanel && (
          <aside className="absolute right-2 sm:right-6 top-16 sm:top-20 z-50 w-80 sm:w-96 max-h-[75vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-white/20 p-5 shadow-2xl backdrop-blur-2xl animate-fade-in text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold">Theme & Custom Colors</h4>
              </div>
              <button
                onClick={() => setShowStudioPanel(false)}
                className="text-white/40 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            {/* 14 Theme Quick Swatches */}
            <div className="mb-5">
              <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block mb-2">
                Curated Creator Themes (14)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                  const th = THEMES[tId];
                  const isCurrent = activeTheme.id === tId;
                  return (
                    <button
                      key={tId}
                      onClick={() => onSelectTheme(tId)}
                      className={`flex items-center space-x-2 p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isCurrent ? 'bg-white/15 border-white/50 font-bold' : 'bg-black/30 border-white/10 hover:border-white/25 text-white/80'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: th.accent }}
                      />
                      <span className="truncate">{th.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-3 mb-5 border-t border-white/10 pt-4">
              <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block">
                Custom Color Overrides
              </label>

              {/* Accent Color */}
              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
                <span className="text-xs text-white/80">Accent Highlight</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customAccentColor || activeTheme.accent}
                    onChange={(e) => onCustomAccentColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  {customAccentColor && (
                    <button
                      onClick={() => onCustomAccentColorChange(undefined)}
                      className="text-[10px] text-white/40 hover:text-white underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Timer Text Color */}
              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
                <span className="text-xs text-white/80">Digit Color</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customTextColor || '#ffffff'}
                    onChange={(e) => onCustomTextColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  {customTextColor && (
                    <button
                      onClick={() => onCustomTextColorChange(undefined)}
                      className="text-[10px] text-white/40 hover:text-white underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Background Color */}
              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
                <span className="text-xs text-white/80">Canvas Background</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customBgColor || '#0a0c13'}
                    onChange={(e) => onCustomBgColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  {customBgColor && (
                    <button
                      onClick={() => onCustomBgColorChange(undefined)}
                      className="text-[10px] text-white/40 hover:text-white underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Font & Sizing Options */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Timer Font
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onChangeFont(f.id as TimerFont)}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs text-center transition-all ${
                        font === f.id ? 'bg-purple-600/40 border-purple-400 font-bold' : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Digit Scale
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['normal', 'large', 'cinematic'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => onChangeDigitSize(sz)}
                      className={`py-1.5 rounded-xl border text-xs capitalize text-center transition-all ${
                        digitSize === sz ? 'bg-purple-600/40 border-purple-400 font-bold' : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Bottom Floating Control Bar (Auto-hiding during timer runs) */}
      <footer
        className={`w-full max-w-md flex flex-col items-center justify-center gap-2 z-40 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center gap-3 w-full bg-black/70 backdrop-blur-xl p-2.5 rounded-3xl border border-white/10 shadow-2xl">
          {mode === 'stopwatch' && (
            <button
              onClick={onLap}
              disabled={!hasStarted}
              title="Record Lap [L]"
              className={`p-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                hasStarted ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/5 text-white/30 border-transparent cursor-not-allowed'
              }`}
            >
              <Flag className="w-5 h-5 text-purple-400" />
            </button>
          )}

          {/* Primary Play/Pause Button */}
          <button
            onClick={isRunning ? onPause : onStart}
            className="flex-1 py-3.5 px-6 rounded-2xl text-white font-extrabold text-base shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
            style={{
              background: isRunning ? 'linear-gradient(135deg, #f59e0b, #d97706)' : `linear-gradient(135deg, ${effectiveTheme.accent}, #6366f1)`,
            }}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}</span>
          </button>

          <button
            onClick={onReset}
            disabled={!hasStarted && !isRunning}
            title="Reset Timer [R]"
            className={`p-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
              hasStarted || isRunning ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/5 text-white/30 border-transparent cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-5 h-5 text-rose-400" />
          </button>
        </div>

        <div className="text-[11px] text-white/40 tracking-wider font-mono">
          [Space] Play/Pause • [R] Reset • [L] Lap • [Esc] Exit
        </div>
      </footer>

      {/* OBS Studio Step-by-Step Setup Guide Modal */}
      {showObsHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Tv className="w-5 h-5 text-purple-400" />
                <span>OBS Studio & Streaming Setup Guide</span>
              </h3>
              <button
                onClick={() => setShowObsHelp(false)}
                className="text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              TIMEFRAME provides true transparency suitable for OBS Studio, Streamlabs, vMix, and live gameplay overlays.
            </p>

            <div className="space-y-4 text-xs text-white/80 mb-6">
              {/* Method 1: Browser Source */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Method 1: Native OBS Browser Source (Recommended)</span>
                </div>
                <p className="text-white/60">
                  Provides flawless alpha transparency with zero chroma artifacts.
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-white/70">
                  <li>In OBS, click <strong>Sources (+) → Browser</strong>.</li>
                  <li>In the <strong>URL</strong> field, paste your TIMEFRAME direct overlay URL:
                    <div className="mt-1 flex items-center space-x-2">
                      <code className="bg-black/60 px-2 py-1 rounded text-purple-300 font-mono text-[11px] truncate flex-1">
                        {typeof window !== 'undefined' ? `${window.location.origin}/#overlay` : 'http://localhost:5173/#overlay'}
                      </code>
                      <button
                        onClick={handleCopyObsUrl}
                        className="px-2 py-1 rounded bg-purple-600/40 border border-purple-400 text-purple-200 text-[11px] font-bold"
                      >
                        {copiedUrl ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </li>
                  <li>Set <strong>Width</strong> to <code>1920</code> and <strong>Height</strong> to <code>1080</code>.</li>
                  <li>Leave <strong>Custom CSS</strong> as default (the background is natively 100% transparent).</li>
                  <li>Right-click the Browser source in OBS and choose <strong>Interact</strong> to control the timer with keyboard shortcuts!</li>
                </ol>
              </div>

              {/* Method 2: Chroma Key */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <span className="text-amber-300 font-bold text-sm block">
                  Method 2: Window Capture + Chroma Key
                </span>
                <p className="text-white/60">
                  If you capture this browser window directly in OBS:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-white/70">
                  <li>Select <strong>Chroma Green (#00FF00)</strong> or <strong>Chroma Blue (#0000FF)</strong> in the studio dropdown above.</li>
                  <li>In OBS, add <strong>Window Capture</strong>, right-click the source, and select <strong>Filters</strong>.</li>
                  <li>Add a <strong>Chroma Key</strong> filter and select Green or Blue.</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowObsHelp(false)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 shadow-xl cursor-pointer"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
