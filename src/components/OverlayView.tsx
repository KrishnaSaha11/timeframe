import React, { useEffect } from 'react';
import { FormattedTime } from '../utils/time';
import {
  ThemeConfig,
  TimerMode,
  VisualizerMode,
  DigitSize,
  TimerFont,
} from '../types';
import { VisualizerContainer } from './visualizers/VisualizerContainer';

interface OverlayViewProps {
  mode: TimerMode;
  visualizer: VisualizerMode;
  onChangeVisualizer: (v: VisualizerMode) => void;
  time: FormattedTime;
  rawMs: number;
  totalDurationMs?: number;
  isRunning: boolean;
  theme: ThemeConfig;
  font: TimerFont;
  digitSize: DigitSize;
  onExitOverlay: () => void;
}

export const OverlayView: React.FC<OverlayViewProps> = ({
  mode,
  visualizer,
  onChangeVisualizer,
  time,
  rawMs,
  totalDurationMs,
  isRunning,
  theme,
  font,
  digitSize,
  onExitOverlay,
}) => {
  useEffect(() => {
    // Force transparent body background for OBS Studio browser source
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    document.body.style.backgroundImage = 'none';

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden select-none relative">
      {/* Floating Timer with drop-shadow outline for high contrast over any background */}
      <div
        className="flex items-center justify-center p-4"
        style={{
          filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.95)) drop-shadow(0 0 2px #000000)',
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
          theme={theme}
          digitSize={digitSize}
          font={font}
        />
      </div>

      {/* Tiny subtle exit overlay pill button for creators testing in browser */}
      <button
        onClick={onExitOverlay}
        className="fixed bottom-2 right-2 opacity-15 hover:opacity-100 transition-opacity px-2 py-1 rounded bg-black/60 text-white/70 text-[10px] font-mono border border-white/10"
      >
        Exit OBS Overlay
      </button>
    </div>
  );
};
