import React from 'react';
import { FormattedTime } from '../../utils/time';
import { ThemeConfig, TimerMode, TimerFont } from '../../types';

interface CircularVisualizerProps {
  time: FormattedTime;
  rawMs: number;
  mode: TimerMode;
  totalDurationMs?: number; // For countdown
  isRunning: boolean;
  theme: ThemeConfig;
  font: TimerFont;
  isTimeWarpCritical?: boolean;
}

export const CircularVisualizer: React.FC<CircularVisualizerProps> = ({
  time,
  rawMs,
  mode,
  totalDurationMs = 60000,
  isRunning,
  theme,
  font,
  isTimeWarpCritical,
}) => {
  // Radius and circumference
  const radius = 130;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Calculate progress:
  // For countdown: percentage of remaining time relative to total duration
  // For stopwatch: seconds progress within current minute (0..60s)
  let progress = 0;
  if (mode === 'countdown' && totalDurationMs > 0) {
    progress = Math.max(0, Math.min(1, rawMs / totalDurationMs));
  } else {
    // Stopwatch: fraction of 60 seconds
    const secondsInMinute = (rawMs % 60000) / 60000;
    progress = secondsInMinute;
  }

  const strokeDashoffset = circumference - progress * circumference;

  // Inner ring for millisecond rotation (0..1000ms)
  const innerRadius = normalizedRadius - 20;
  const innerCircumference = innerRadius * 2 * Math.PI;
  const milliProgress = (rawMs % 1000) / 1000;
  const innerStrokeDashoffset = innerCircumference - milliProgress * innerCircumference;

  const fontClass = font === 'orbitron' ? 'font-orbitron' : font === 'space' ? 'font-space' : 'font-mono';

  // 60 tick marks around the outer bezel
  const ticks = Array.from({ length: 60 });

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 flex items-center justify-center">
        {/* SVG Progress Rings */}
        <svg
          height="100%"
          width="100%"
          viewBox="0 0 300 300"
          className="transform -rotate-90 origin-center"
        >
          <defs>
            <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isTimeWarpCritical ? '#ef4444' : theme.accent} />
              <stop offset="100%" stopColor={isTimeWarpCritical ? '#f59e0b' : '#38bdf8'} />
            </linearGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track */}
          <circle
            stroke="rgba(255, 255, 255, 0.06)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="150"
            cy="150"
          />

          {/* Inner millisecond track */}
          <circle
            stroke="rgba(255, 255, 255, 0.03)"
            fill="transparent"
            strokeWidth={2}
            r={innerRadius}
            cx="150"
            cy="150"
          />

          {/* Inner millisecond active indicator */}
          <circle
            stroke={theme.accent}
            fill="transparent"
            strokeWidth={2}
            strokeDasharray={`${innerCircumference} ${innerCircumference}`}
            style={{ strokeDashoffset: innerStrokeDashoffset, opacity: isRunning ? 0.45 : 0.15 }}
            r={innerRadius}
            cx="150"
            cy="150"
          />

          {/* Main animated progress circle */}
          <circle
            stroke="url(#circleGrad)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: isRunning ? 'none' : 'stroke-dashoffset 0.3s ease',
            }}
            filter="url(#ringGlow)"
            r={normalizedRadius}
            cx="150"
            cy="150"
          />

          {/* Outer tick marks */}
          {ticks.map((_, i) => {
            const angle = (i * 360) / 60;
            const isMajor = i % 5 === 0;
            const len = isMajor ? 8 : 4;
            const r1 = 142;
            const r2 = r1 - len;
            const rad = (angle * Math.PI) / 180;
            const x1 = 150 + r1 * Math.cos(rad);
            const y1 = 150 + r1 * Math.sin(rad);
            const x2 = 150 + r2 * Math.cos(rad);
            const y2 = 150 + r2 * Math.sin(rad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth={isMajor ? 1.5 : 1}
              />
            );
          })}
        </svg>

        {/* Center Digital Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center tabular-nums pointer-events-none">
          <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/40 mb-1">
            {mode === 'countdown' ? 'Remaining' : 'Elapsed'}
          </span>
          <div className={`flex items-baseline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white ${fontClass}`}>
            <span>{time.minutes}</span>
            <span className={`px-1 text-white/30 ${isRunning ? 'animate-pulse' : ''}`}>:</span>
            <span>{time.seconds}</span>
            <span className="text-xl sm:text-2xl md:text-3xl text-[var(--accent)] font-semibold ml-1" style={{ color: theme.accent }}>
              .{time.milliseconds}
            </span>
          </div>
          {time.hasHours && (
            <span className="text-xs text-white/50 mt-1 font-mono">
              +{time.hours} hr
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
