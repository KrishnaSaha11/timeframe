import React from 'react';
import { FormattedTime } from '../../utils/time';
import { ThemeConfig, DigitSize, TimerFont } from '../../types';

interface DigitalVisualizerProps {
  time: FormattedTime;
  isRunning: boolean;
  theme: ThemeConfig;
  digitSize: DigitSize;
  font: TimerFont;
  isTimeWarpCritical?: boolean;
}

export const DigitalVisualizer: React.FC<DigitalVisualizerProps> = ({
  time,
  isRunning,
  theme,
  digitSize,
  font,
  isTimeWarpCritical,
}) => {
  const getFontFamily = () => {
    switch (font) {
      case 'orbitron': return 'font-orbitron';
      case 'space': return 'font-space';
      case 'inter': return 'font-sans';
      case 'cormorant': return 'font-cormorant tracking-tight';
      case 'jetbrains':
      default:
        return 'font-mono';
    }
  };

  const getSizeClasses = () => {
    switch (digitSize) {
      case 'cinematic':
        return {
          main: 'text-4xl xs:text-5xl sm:text-7xl md:text-9xl lg:text-[10.5rem] tracking-tight leading-none',
          ms: 'text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-7xl',
          label: 'text-[8px] xs:text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest',
        };
      case 'normal':
        return {
          main: 'text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none',
          ms: 'text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl',
          label: 'text-[8px] xs:text-[9px] md:text-xs font-semibold tracking-wider',
        };
      case 'large':
      default:
        return {
          main: 'text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none',
          ms: 'text-lg xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
          label: 'text-[8px] xs:text-[10px] md:text-xs font-semibold tracking-widest',
        };
    }
  };

  const sizes = getSizeClasses();
  const fontClass = getFontFamily();

  const glowStyle = isTimeWarpCritical
    ? {
        textShadow: `0 0 35px rgba(239, 68, 68, 0.9), 0 0 70px rgba(239, 68, 68, 0.5)`,
        color: '#ef4444',
      }
    : {
        textShadow: `0 0 25px ${theme.accentGlow}, 0 0 50px ${theme.accentGlow.replace('0.45', '0.2')}`,
        color: theme.digitColor || '#ffffff',
      };

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8 w-full overflow-hidden">
      <div 
        className={`flex items-baseline justify-center flex-nowrap tabular-nums transition-all duration-300 max-w-full ${fontClass} ${sizes.main}`}
        style={glowStyle}
      >
        {time.hasHours && (
          <>
            <div className="flex flex-col items-center">
              <span>{time.hours}</span>
              <span className={`${sizes.label} text-white/40 uppercase mt-1 sm:mt-2`}>Hours</span>
            </div>
            <span className={`px-0.5 sm:px-2 text-white/30 ${isRunning ? 'animate-pulse' : ''}`}>:</span>
          </>
        )}

        <div className="flex flex-col items-center">
          <span>{time.minutes}</span>
          <span className={`${sizes.label} text-white/40 uppercase mt-1 sm:mt-2`}>Min</span>
        </div>

        <span className={`px-0.5 sm:px-2 text-white/30 ${isRunning ? 'animate-pulse' : ''}`}>:</span>

        <div className="flex flex-col items-center">
          <span>{time.seconds}</span>
          <span className={`${sizes.label} text-white/40 uppercase mt-1 sm:mt-2`}>Sec</span>
        </div>

        <span className="px-0.5 text-white/30 font-light">.</span>

        <div className="flex flex-col items-start self-baseline">
          <span className={`${sizes.ms} font-medium opacity-90`} style={{ color: theme.accent }}>
            {time.milliseconds}
          </span>
          <span className={`${sizes.label} text-white/40 uppercase mt-1 sm:mt-2`}>Ms</span>
        </div>
      </div>
    </div>
  );
};
