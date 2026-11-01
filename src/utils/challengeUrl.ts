import { ChallengeConfig, TimerMode, VisualizerMode, ThemeId } from '../types';

const VALID_THEMES: ThemeId[] = [
  'midnight-purple',
  'cyberpunk',
  'neon-green',
  'electric-blue',
  'sunset-orange',
  'crimson-red',
  'ocean-blue',
  'aurora',
  'deep-space',
  'retro-terminal',
  'minimal-white',
  'monochrome',
  'gold',
  'pink-neon',
];

const VALID_VISUALIZERS: VisualizerMode[] = [
  'digital',
  'circular',
  'analog',
  'fluid',
  'minimal',
];

export function encodeChallenge(config: Omit<ChallengeConfig, 'id' | 'createdAt'>): string {
  try {
    const payload = {
      t: config.title.slice(0, 80),
      m: config.mode === 'stopwatch' ? 's' : 'c',
      d: config.durationMs ? Math.round(config.durationMs) : undefined,
      tg: config.targetTimeMs ? Math.round(config.targetTimeMs) : undefined,
      v: config.visualizer,
      th: config.theme,
      w: config.timeWarp ? 1 : 0,
      s: config.sound ? 1 : 0,
    };
    const jsonStr = JSON.stringify(payload);
    return btoa(encodeURIComponent(jsonStr));
  } catch (e) {
    console.error('Failed to encode challenge', e);
    return '';
  }
}

export function decodeChallenge(hashOrParam: string): ChallengeConfig | null {
  try {
    if (!hashOrParam) return null;
    const jsonStr = decodeURIComponent(atob(hashOrParam));
    const data = JSON.parse(jsonStr);

    if (!data || typeof data !== 'object') return null;

    const title = typeof data.t === 'string' ? data.t.slice(0, 80) : 'Custom Time Challenge';
    const mode: TimerMode = data.m === 's' ? 'stopwatch' : 'countdown';
    const durationMs = typeof data.d === 'number' && data.d > 0 && data.d <= 86400000 ? data.d : 60000;
    const targetTimeMs = typeof data.tg === 'number' && data.tg > 0 ? data.tg : undefined;
    const visualizer: VisualizerMode = VALID_VISUALIZERS.includes(data.v) ? data.v : 'digital';
    const theme: ThemeId = VALID_THEMES.includes(data.th) ? data.th : 'midnight-purple';
    const timeWarp = data.w === 1 || data.w === true;
    const sound = data.s === 1 || data.s === true;

    return {
      id: 'challenge_' + Math.random().toString(36).substring(2, 9),
      title,
      mode,
      durationMs,
      targetTimeMs,
      visualizer,
      theme,
      timeWarp,
      sound,
      createdAt: Date.now(),
    };
  } catch (e) {
    console.warn('Failed to parse challenge payload', e);
    return null;
  }
}

export function getShareableUrl(config: Omit<ChallengeConfig, 'id' | 'createdAt'>): string {
  const encoded = encodeChallenge(config);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?c=${encoded}#challenge`;
}
