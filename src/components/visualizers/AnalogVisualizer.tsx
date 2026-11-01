import React from 'react';
import { FormattedTime } from '../../utils/time';
import { ThemeConfig, TimerFont } from '../../types';

interface AnalogVisualizerProps {
  time: FormattedTime;
  rawMs: number;
  isRunning: boolean;
  theme: ThemeConfig;
  font: TimerFont;
}

export const AnalogVisualizer: React.FC<AnalogVisualizerProps> = ({
  time,
  rawMs,
  isRunning,
  theme,
  font,
}) => {
  // Angle calculations:
  // Milliseconds sub-dial: 1 full rotation every 1000ms = 360 * (ms / 1000)
  const milliAngle = ((rawMs % 1000) / 1000) * 360;

  // Seconds hand: 360 degrees per 60 seconds (smooth sub-second sweep)
  const secondAngle = ((rawMs % 60000) / 60000) * 360;

  // Minutes hand: 360 degrees per 60 minutes
  const minuteAngle = ((rawMs % 3600000) / 3600000) * 360;

  const fontClass = font === 'cormorant' ? 'font-cormorant tracking-tight' : 'font-mono';

  // 12 hour/5-minute numerals
  const hourMarkers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/40 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Subtle radial glass reflection */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        {/* Outer bezel with 60 second ticks */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 360) / 60;
            const isMajor = i % 5 === 0;
            const rad = ((angle - 90) * Math.PI) / 180;
            const rOuter = 95;
            const rInner = isMajor ? 86 : 90;
            const x1 = 100 + rOuter * Math.cos(rad);
            const y1 = 100 + rOuter * Math.sin(rad);
            const x2 = 100 + rInner * Math.cos(rad);
            const y2 = 100 + rInner * Math.sin(rad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? theme.accent : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth={isMajor ? 1.8 : 0.8}
                opacity={isMajor ? 0.9 : 0.4}
              />
            );
          })}
        </svg>

        {/* Numerals for 12, 3, 6, 9 */}
        {hourMarkers.map((num) => {
          const angle = ((num * 30) - 90) * (Math.PI / 180);
          const r = 74;
          const x = 50 + (r / 2) * Math.cos(angle);
          const y = 50 + (r / 2) * Math.sin(angle);
          if (num % 3 !== 0) return null; // Show only 12, 3, 6, 9 for clean Swiss chronograph aesthetic

          return (
            <div
              key={num}
              className="absolute text-xs sm:text-sm font-semibold text-white/50 transform -translate-x-1/2 -translate-y-1/2 font-mono"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {num === 12 ? '60' : num * 5}
            </div>
          );
        })}

        {/* Top Sub-dial: 1/10th Second Sweeper */}
        <div className="absolute top-14 w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/10 bg-black/30 flex items-center justify-center">
          <span className="absolute -top-3 text-[9px] text-white/40 uppercase tracking-widest font-mono">1/10s</span>
          {/* Sub-dial hand */}
          <div
            className="absolute w-0.5 h-7 sm:h-8 rounded-full origin-bottom"
            style={{
              backgroundColor: theme.accent,
              bottom: '50%',
              transform: `rotate(${milliAngle}deg)`,
              transition: isRunning ? 'none' : 'transform 0.15s ease',
            }}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-white z-10" />
        </div>

        {/* Minute Hand */}
        <div
          className="absolute w-1 sm:w-1.5 rounded-full origin-bottom z-10 bg-gradient-to-t from-white/70 to-white shadow-md"
          style={{
            height: '32%',
            bottom: '50%',
            transform: `rotate(${minuteAngle}deg)`,
            transition: isRunning ? 'none' : 'transform 0.2s ease-out',
          }}
        />

        {/* Sweeping Chrono Second Hand */}
        <div
          className="absolute w-0.5 sm:w-1 rounded-full origin-bottom z-20 shadow-lg"
          style={{
            height: '42%',
            bottom: '50%',
            backgroundColor: theme.accent,
            filter: `drop-shadow(0 0 6px ${theme.accentGlow})`,
            transform: `rotate(${secondAngle}deg)`,
            transition: isRunning ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Counterweight tail */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-4 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </div>

        {/* Center Pivot Jewel Cap */}
        <div
          className="w-4 h-4 rounded-full bg-white border-2 z-30 shadow-md flex items-center justify-center"
          style={{ borderColor: theme.accent }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        </div>

        {/* Bottom Digital Date/Time Window */}
        <div className="absolute bottom-12 px-3 py-1 rounded-md bg-black/60 border border-white/10 backdrop-blur-md text-center">
          <span className={`text-xs sm:text-sm font-semibold tracking-wider text-white/90 tabular-nums ${fontClass}`}>
            {time.displayTime}
          </span>
        </div>
      </div>
    </div>
  );
};
