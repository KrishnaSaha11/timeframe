import React from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { ThemeConfig } from '../types';
import { InfoButton } from './InfoButton';

interface StopwatchControlsProps {
  isRunning: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
  theme: ThemeConfig;
  onOpenInfo?: (key: string) => void;
}

export const StopwatchControls: React.FC<StopwatchControlsProps> = ({
  isRunning,
  hasStarted,
  onStart,
  onPause,
  onReset,
  onLap,
  theme,
  onOpenInfo,
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-lg px-2 sm:px-4 mt-3 sm:mt-5 relative z-20">
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
        {/* Lap / Split button */}
        <div className="flex-1 relative group">
          <button
            onClick={onLap}
            disabled={!hasStarted}
            aria-label="Record Lap or Split Time"
            title="Record Lap [L]"
            className={`w-full flex items-center justify-center space-x-1.5 sm:space-x-2 py-3 sm:py-3.5 px-2.5 sm:px-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
              hasStarted
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/15 cursor-pointer shadow-lg'
                : 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <Flag className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Lap</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-white/50 border border-white/10 font-mono">
              L
            </kbd>
          </button>
          {onOpenInfo && (
            <div className="absolute -top-2 -right-1">
              <InfoButton onClick={() => onOpenInfo('lap')} size="xs" title="Lap info" />
            </div>
          )}
        </div>

        {/* Primary Start / Pause Toggle */}
        <div className="flex-[1.4] sm:flex-[1.5] relative group">
          <button
            onClick={isRunning ? onPause : onStart}
            aria-label={isRunning ? 'Pause Stopwatch' : hasStarted ? 'Resume Stopwatch' : 'Start Stopwatch'}
            title="Start/Pause [Space]"
            className="w-full flex items-center justify-center space-x-1.5 sm:space-x-2 py-3.5 sm:py-4 px-3 sm:px-6 rounded-2xl text-xs sm:text-base font-extrabold transition-all duration-200 active:scale-95 shadow-xl cursor-pointer"
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
              <InfoButton onClick={() => onOpenInfo(isRunning ? 'pause' : 'start')} size="xs" title="Timer control info" />
            </div>
          )}
        </div>

        {/* Reset button */}
        <div className="flex-1 relative group">
          <button
            onClick={onReset}
            disabled={!hasStarted && !isRunning}
            aria-label="Reset Stopwatch"
            title="Reset Stopwatch [R]"
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
      </div>
    </div>
  );
};
