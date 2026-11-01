import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';
import { ThemeConfig } from '../types';
import { Sparkles, Trophy, Share2, RotateCcw } from 'lucide-react';
import { FormattedTime } from '../utils/time';

interface TimeWarpOverlayProps {
  remainingMs: number;
  totalDurationMs: number;
  isRunning: boolean;
  isFinished: boolean;
  timeWarpEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: ThemeConfig;
  onReset: () => void;
  onOpenShareCard: () => void;
  time: FormattedTime;
}

export const TimeWarpOverlay: React.FC<TimeWarpOverlayProps> = ({
  remainingMs,
  isRunning,
  isFinished,
  timeWarpEnabled,
  soundEnabled,
  vibrationEnabled,
  theme,
  onReset,
  onOpenShareCard,
  time,
}) => {
  const lastSecondRef = useRef<number | null>(null);
  const celebratedRef = useRef<boolean>(false);

  // Remaining seconds
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const isLast10 = isRunning && timeWarpEnabled && remainingSeconds <= 10 && remainingSeconds > 0;
  const isLast5 = isRunning && timeWarpEnabled && remainingSeconds <= 5 && remainingSeconds > 0;

  // Handle countdown ticks for last 5 seconds
  useEffect(() => {
    if (!isRunning || !timeWarpEnabled) return;

    if (remainingSeconds <= 5 && remainingSeconds > 0) {
      if (lastSecondRef.current !== remainingSeconds) {
        lastSecondRef.current = remainingSeconds;

        // Sound tick (pitch scales up as time gets closer)
        if (soundEnabled) {
          const pitch = 1.0 + (5 - remainingSeconds) * 0.15;
          soundManager.playWarpTick(pitch);
        }

        // Mobile Vibration
        if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(80);
          } catch (e) {
            // vibration not permitted or ignored
          }
        }
      }
    } else {
      lastSecondRef.current = null;
    }
  }, [remainingSeconds, isRunning, timeWarpEnabled, soundEnabled, vibrationEnabled]);

  // Handle completion at zero
  useEffect(() => {
    if (isFinished && !celebratedRef.current) {
      celebratedRef.current = true;

      if (soundEnabled) {
        soundManager.playCompleteFanfare();
      }

      if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200, 100, 400]);
        } catch (e) {}
      }

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion && timeWarpEnabled) {
        // Multi-stage confetti fireworks!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: [theme.accent, '#f59e0b', '#ec4899', '#38bdf8', '#10b981'],
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: [theme.accent, '#f59e0b', '#38bdf8'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: [theme.accent, '#ec4899', '#10b981'],
          });
        }, 250);
      }
    }

    if (!isFinished) {
      celebratedRef.current = false;
    }
  }, [isFinished, soundEnabled, vibrationEnabled, timeWarpEnabled, theme]);

  return (
    <>
      {/* Visual Ambient Tension Glow (10s and 5s) */}
      {isLast10 && (
        <div
          className={`fixed inset-0 pointer-events-none z-30 transition-opacity duration-300 ${
            isLast5 ? 'animate-heart-pulse' : 'opacity-40 animate-pulse'
          }`}
          style={{
            boxShadow: isLast5
              ? 'inset 0 0 100px rgba(239, 68, 68, 0.45), inset 0 0 200px rgba(249, 115, 22, 0.25)'
              : 'inset 0 0 70px rgba(245, 158, 11, 0.3)',
          }}
        />
      )}

      {/* Finished Celebration Modal Screen */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/20 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            {/* Top glowing banner */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-50 pointer-events-none"
              style={{ backgroundColor: theme.accent }}
            />

            <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center mb-4 shadow-xl">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Time Complete!
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Timer finished with surgical precision. Ready to record or showcase your session.
            </p>

            <div className="py-4 px-6 rounded-2xl bg-black/40 border border-white/10 mb-6">
              <span className="text-[11px] uppercase tracking-widest text-white/40 block mb-1">
                Completed Duration
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-bold text-white tabular-nums">
                {time.displayTime}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onReset}
                className="flex-1 py-3.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-white/70" />
                <span>Reset Timer</span>
              </button>
              <button
                onClick={onOpenShareCard}
                className="flex-1 py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}, #6366f1)`,
                  boxShadow: `0 10px 25px -5px ${theme.accentGlow}`,
                }}
              >
                <Share2 className="w-4 h-4" />
                <span>Create Time Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
