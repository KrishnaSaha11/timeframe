import React from 'react';
import { FormattedTime } from '../../utils/time';
import { ThemeConfig, DigitSize, TimerFont } from '../../types';

interface MinimalVisualizerProps {
  time: FormattedTime;
  isRunning: boolean;
  theme: ThemeConfig;
  digitSize: DigitSize;
  font: TimerFont;
}

export const MinimalVisualizer: React.FC<MinimalVisualizerProps> = ({
  time,
  isRunning,
  theme,
  digitSize,
  font,
}) => {
  const fontClass = font === 'cormorant' 
    ? 'font-cormorant font-normal' 
    : font === 'space' 
      ? 'font-space font-medium' 
      : 'font-mono font-light';

  const sizeClass = digitSize === 'cinematic' 
    ? 'text-6xl sm:text-8xl md:text-9xl' 
    : digitSize === 'normal' 
      ? 'text-4xl sm:text-6xl md:text-7xl' 
      : 'text-5xl sm:text-7xl md:text-8xl';

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${isRunning ? 'animate-ping' : 'opacity-30'}`}
          style={{ backgroundColor: theme.accent }}
        />
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">
          {isRunning ? 'Active' : 'Standby'}
        </span>
      </div>

      <div className={`tabular-nums tracking-tighter text-white flex items-baseline ${fontClass} ${sizeClass}`}>
        {time.hasHours && (
          <>
            <span>{time.hours}</span>
            <span className="text-white/20 mx-1">:</span>
          </>
        )}
        <span>{time.minutes}</span>
        <span className="text-white/20 mx-1">:</span>
        <span>{time.seconds}</span>
        <span className="text-2xl sm:text-3xl md:text-4xl ml-2 font-normal opacity-70" style={{ color: theme.accent }}>
          .{time.milliseconds}
        </span>
      </div>
    </div>
  );
};
