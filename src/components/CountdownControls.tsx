import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Sliders, Check, Clock } from 'lucide-react';
import { ThemeConfig } from '../types';
import { InfoButton } from './InfoButton';

interface CountdownControlsProps {
  isRunning: boolean;
  hasStarted: boolean;
  isFinished: boolean;
  currentDurationMs: number;
  onSetDuration: (ms: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  theme: ThemeConfig;
  onOpenInfo?: (key: string) => void;
}

export const CountdownControls: React.FC<CountdownControlsProps> = ({
  isRunning,
  hasStarted,
  isFinished,
  currentDurationMs,
  onSetDuration,
  onStart,
  onPause,
  onReset,
  theme,
  onOpenInfo,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customH, setCustomH] = useState(0);
  const [customM, setCustomM] = useState(5);
  const [customS, setCustomS] = useState(0);

  const presets = [
    { label: '10s', ms: 10 * 1000 },
    { label: '30s', ms: 30 * 1000 },
    { label: '1m', ms: 60 * 1000 },
    { label: '5m', ms: 5 * 60 * 1000 },
    { label: '10m', ms: 10 * 60 * 1000 },
    { label: '25m (Pomodoro)', ms: 25 * 60 * 1000 },
  ];

  const handleApplyCustom = () => {
    const totalMs = (customH * 3600 + customM * 60 + customS) * 1000;
    if (totalMs > 0) {
      onSetDuration(totalMs);
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl px-2 sm:px-4 mt-3 sm:mt-5 relative z-20">
      {/* Preset pills row */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 w-full">
        {presets.map((preset) => {
          const isSelected = currentDurationMs === preset.ms && !hasStarted;
          return (
            <button
              key={preset.label}
              onClick={() => {
                if (!isRunning) onSetDuration(preset.ms);
              }}
              disabled={isRunning}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-white/20 text-white border border-white/40 shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
              } ${isRunning ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={isSelected ? { borderColor: theme.accent, color: '#ffffff' } : {}}
            >
              {preset.label}
            </button>
          );
        })}

        {/* Custom duration trigger button */}
        <button
          onClick={() => setShowCustomModal(true)}
          disabled={isRunning}
          className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer ${
            isRunning ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <Sliders className="w-3 h-3 text-purple-400" />
          <span>Custom</span>
        </button>

        {onOpenInfo && (
          <InfoButton
            onClick={() => onOpenInfo('presets')}
            size="xs"
            title="Learn about Presets & Custom Duration"
            className="ml-0.5"
          />
        )}
      </div>

      {/* Main control action buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-md">
        {/* Reset button */}
        <div className="flex-1 relative group">
          <button
            onClick={onReset}
            disabled={!hasStarted && !isRunning}
            aria-label="Reset Countdown"
            title="Reset [R]"
            className={`w-full flex items-center justify-center space-x-1.5 sm:space-x-2 py-3 sm:py-3.5 px-2.5 sm:px-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
              hasStarted || isRunning
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/15 cursor-pointer shadow-lg'
                : 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Reset</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-white/50 border border-white/10 font-mono">
              R
            </kbd>
          </button>
          {onOpenInfo && (
            <div className="absolute -top-2 -right-1">
              <InfoButton onClick={() => onOpenInfo('reset')} size="xs" title="Reset info" />
            </div>
          )}
        </div>

        {/* Start / Pause Toggle */}
        <div className="flex-[1.4] sm:flex-[1.5] relative group">
          <button
            onClick={isRunning ? onPause : onStart}
            disabled={isFinished}
            aria-label={isRunning ? 'Pause Countdown' : 'Start Countdown'}
            title="Start/Pause [Space]"
            className={`w-full flex items-center justify-center space-x-1.5 sm:space-x-2 py-3.5 sm:py-4 px-3 sm:px-6 rounded-2xl text-xs sm:text-base font-extrabold transition-all duration-200 active:scale-95 shadow-xl cursor-pointer ${
              isFinished ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              background: isRunning
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : `linear-gradient(135deg, ${theme.accent}, #6366f1)`,
              color: '#ffffff',
              boxShadow: isRunning
                ? '0 10px 25px -5px rgba(245, 158, 11, 0.4)'
                : `0 10px 30px -5px ${theme.accentGlow}`,
            }}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5 shrink-0" />
                <span>{hasStarted ? 'Resume' : 'Start'}</span>
              </>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-black/30 text-white/80 border border-white/20 font-mono">
              Space
            </kbd>
          </button>
          {onOpenInfo && (
            <div className="absolute -top-2 -right-1">
              <InfoButton
                onClick={() => onOpenInfo(isRunning ? 'pause' : 'start')}
                size="xs"
                title="Timer control info"
              />
            </div>
          )}
        </div>
      </div>

      {/* Custom Duration Popover / Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/20 p-6 shadow-2xl text-white animate-scale-up">
            <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Custom Countdown Duration</span>
            </h3>
            <p className="text-xs text-white/50 mb-5">Set exact hours, minutes, and seconds</p>

            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={customH}
                  onChange={(e) => setCustomH(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-center text-xl font-bold font-mono text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customM}
                  onChange={(e) => setCustomM(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-center text-xl font-bold font-mono text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customS}
                  onChange={(e) => setCustomS(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-center text-xl font-bold font-mono text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-white/70 hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                style={{ backgroundColor: theme.accent }}
              >
                <Check className="w-4 h-4" />
                <span>Apply Duration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
