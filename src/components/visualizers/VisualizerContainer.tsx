import React from 'react';
import { VisualizerMode, ThemeConfig, TimerMode, DigitSize, TimerFont } from '../../types';
import { FormattedTime } from '../../utils/time';
import { DigitalVisualizer } from './DigitalVisualizer';
import { CircularVisualizer } from './CircularVisualizer';
import { AnalogVisualizer } from './AnalogVisualizer';
import { FluidVisualizer } from './FluidVisualizer';
import { MinimalVisualizer } from './MinimalVisualizer';
import { Activity, Clock, CircleDot, Waves, Minus } from 'lucide-react';
import { InfoButton } from '../InfoButton';

interface VisualizerContainerProps {
  mode: TimerMode;
  visualizer: VisualizerMode;
  onChangeVisualizer: (v: VisualizerMode) => void;
  time: FormattedTime;
  rawMs: number;
  totalDurationMs?: number;
  isRunning: boolean;
  theme: ThemeConfig;
  digitSize: DigitSize;
  font: TimerFont;
  isTimeWarpCritical?: boolean;
  onOpenInfo?: (key: string) => void;
}

export const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
  mode,
  visualizer,
  onChangeVisualizer,
  time,
  rawMs,
  totalDurationMs,
  isRunning,
  theme,
  digitSize,
  font,
  isTimeWarpCritical,
  onOpenInfo,
}) => {
  const visualizerModes: Array<{ id: VisualizerMode; label: string; icon: React.ReactNode }> = [
    { id: 'digital', label: 'Digital', icon: <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
    { id: 'circular', label: 'Circular', icon: <CircleDot className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
    { id: 'analog', label: 'Analog', icon: <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
    { id: 'fluid', label: 'Fluid', icon: <Waves className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
    { id: 'minimal', label: 'Minimal', icon: <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mode visualizer content */}
      <div className="w-full min-h-[260px] sm:min-h-[340px] md:min-h-[380px] flex items-center justify-center transition-all duration-300">
        {visualizer === 'digital' && (
          <DigitalVisualizer
            time={time}
            isRunning={isRunning}
            theme={theme}
            digitSize={digitSize}
            font={font}
            isTimeWarpCritical={isTimeWarpCritical}
          />
        )}
        {visualizer === 'circular' && (
          <CircularVisualizer
            time={time}
            rawMs={rawMs}
            mode={mode}
            totalDurationMs={totalDurationMs}
            isRunning={isRunning}
            theme={theme}
            font={font}
            isTimeWarpCritical={isTimeWarpCritical}
          />
        )}
        {visualizer === 'analog' && (
          <AnalogVisualizer
            time={time}
            rawMs={rawMs}
            isRunning={isRunning}
            theme={theme}
            font={font}
          />
        )}
        {visualizer === 'fluid' && (
          <FluidVisualizer
            time={time}
            rawMs={rawMs}
            mode={mode}
            totalDurationMs={totalDurationMs}
            isRunning={isRunning}
            theme={theme}
            font={font}
          />
        )}
        {visualizer === 'minimal' && (
          <MinimalVisualizer
            time={time}
            isRunning={isRunning}
            theme={theme}
            digitSize={digitSize}
            font={font}
          />
        )}
      </div>

      {/* Visualizer selector pills with smooth touch scroll and compact responsive design */}
      <div className="w-full flex items-center justify-center px-1">
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md mt-2 max-w-full overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
          {visualizerModes.map((item) => {
            const isActive = visualizer === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeVisualizer(item.id)}
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
                }`}
                style={isActive ? { borderColor: `${theme.accent}66`, color: '#ffffff' } : {}}
              >
                <span style={isActive ? { color: theme.accent } : {}}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
          {onOpenInfo && (
            <InfoButton 
              onClick={() => onOpenInfo('visualizer')} 
              title="Learn about Visualizer Modes"
              size="xs"
              className="ml-0.5 shrink-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};
