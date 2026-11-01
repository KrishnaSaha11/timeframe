import React, { useEffect, useRef } from 'react';
import { FormattedTime } from '../../utils/time';
import { ThemeConfig, TimerMode, TimerFont } from '../../types';

interface FluidVisualizerProps {
  time: FormattedTime;
  rawMs: number;
  mode: TimerMode;
  totalDurationMs?: number;
  isRunning: boolean;
  theme: ThemeConfig;
  font: TimerFont;
}

export const FluidVisualizer: React.FC<FluidVisualizerProps> = ({
  time,
  rawMs,
  mode,
  totalDurationMs = 60000,
  isRunning,
  theme,
  font,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    // Bubbles
    const bubbles: Array<{ x: number; y: number; r: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 16; i++) {
      bubbles.push({
        x: Math.random() * 320,
        y: 150 + Math.random() * 150,
        r: 1.5 + Math.random() * 3,
        speed: 0.4 + Math.random() * 0.8,
        opacity: 0.2 + Math.random() * 0.5,
      });
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Liquid level height calculation:
      // Countdown: fill level matches remaining percent (100% full down to 0%)
      // Stopwatch: cyclical tidal fill (sine between 35% and 65%)
      let fillPercent = 0.5;
      if (mode === 'countdown' && totalDurationMs > 0) {
        fillPercent = Math.max(0.05, Math.min(0.95, rawMs / totalDurationMs));
      } else {
        const sec = (rawMs % 60000) / 60000;
        fillPercent = 0.35 + 0.35 * Math.sin(sec * Math.PI * 2);
      }

      const waveBase = height - (height * fillPercent);

      step += isRunning ? 0.04 : 0.008;

      // Draw Wave 1 (Back Layer)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5) {
        const y = waveBase + Math.sin(x * 0.02 + step) * 10 + Math.cos(x * 0.01 + step * 0.5) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = `rgba(${theme.accentRgb}, 0.25)`;
      ctx.fill();

      // Draw Wave 2 (Front Layer)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 5) {
        const y = waveBase + Math.sin(x * 0.025 - step * 1.2) * 12 + Math.sin(x * 0.015 + step) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, waveBase - 15, 0, height);
      grad.addColorStop(0, `rgba(${theme.accentRgb}, 0.55)`);
      grad.addColorStop(1, `rgba(${theme.accentRgb}, 0.15)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw bubbles rising
      bubbles.forEach((b) => {
        b.y -= isRunning ? b.speed : b.speed * 0.3;
        if (b.y < waveBase) {
          b.y = height;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, rawMs, totalDurationMs, isRunning, theme]);

  const fontClass = font === 'orbitron' ? 'font-orbitron' : font === 'space' ? 'font-space' : 'font-mono';

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Canvas for liquid wave */}
        <canvas
          ref={canvasRef}
          width={384}
          height={384}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Overlay digital readout */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center tabular-nums p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
          <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/50 mb-1">
            {mode === 'countdown' ? 'Fluid Level' : 'Tidal Flow'}
          </span>
          <div className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white ${fontClass}`}>
            <span>{time.minutes}</span>
            <span className={`px-1 text-white/40 ${isRunning ? 'animate-pulse' : ''}`}>:</span>
            <span>{time.seconds}</span>
            <span className="text-2xl sm:text-3xl font-semibold ml-1" style={{ color: theme.accent }}>
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
