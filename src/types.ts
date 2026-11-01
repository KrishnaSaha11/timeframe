export type TimerMode = 'stopwatch' | 'countdown';

export type VisualizerMode = 'digital' | 'circular' | 'analog' | 'fluid' | 'minimal';

export type ThemeId =
  | 'midnight-purple'
  | 'cyberpunk'
  | 'neon-green'
  | 'electric-blue'
  | 'sunset-orange'
  | 'crimson-red'
  | 'ocean-blue'
  | 'aurora'
  | 'deep-space'
  | 'retro-terminal'
  | 'minimal-white'
  | 'monochrome'
  | 'gold'
  | 'pink-neon';

export type DigitSize = 'normal' | 'large' | 'cinematic';
export type AnimationIntensity = 'off' | 'subtle' | 'dynamic';
export type TimerFont = 'jetbrains' | 'orbitron' | 'inter' | 'space' | 'cormorant';
export type BackgroundStyle = 'mesh' | 'grid' | 'particles' | 'solid' | 'transparent';
export type CreatorAspect = 'auto' | '16-9' | '9-16' | '1-1' | 'custom';

export type ActivePage = 'home' | 'stopwatch' | 'countdown' | 'creator' | 'themes' | 'about' | 'settings' | 'overlay' | 'share';

export interface Lap {
  id: number;
  lapNumber: number;
  lapTime: number; // Duration of this specific lap in ms
  splitTime: number; // Cumulative total time when lap was pressed (synonym for totalTime)
  totalTime: number;
  timestamp: number;
}

export interface LapComparison extends Lap {
  diffFromPrevLap?: number; // Difference compared to the immediate prior lap in same session
  previousLapTime?: number; // Ghost session lap time
  ghostDelta?: number; // lapTime - previousLapTime
  isFasterGhost?: boolean;
  isFastestCurrent?: boolean;
  isSlowestCurrent?: boolean;
}

export interface SessionHistory {
  id: string;
  date: string;
  totalTime: number;
  bestLap: number;
  laps: Lap[];
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  category: string;
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  accent: string;
  accentGlow: string;
  accentRgb: string; // for canvas/svg
  textColor: string;
  subtextColor: string;
  digitColor: string;
  previewColor: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  vibrationEnabled: boolean;
  timeWarpEnabled: boolean;
  notificationEnabled: boolean;
  theme: ThemeId;
  customAccent?: string;
  customBgColor?: string;
  customTextColor?: string;
  font: TimerFont;
  digitSize: DigitSize;
  animationIntensity: AnimationIntensity;
  bgStyle: BackgroundStyle;
  highContrast: boolean;
  creatorAspect: CreatorAspect;
  creatorCustomDimensions?: { width: number; height: number };
}

export interface ChallengeConfig {
  id: string;
  title: string;
  mode: TimerMode;
  durationMs?: number; // for countdown
  targetTimeMs?: number; // for stopwatch goal
  visualizer: VisualizerMode;
  theme: ThemeId;
  timeWarp: boolean;
  sound: boolean;
  createdAt: number;
}
