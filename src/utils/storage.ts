import { UserSettings, SessionHistory } from '../types';

const SETTINGS_KEY = 'timeframe_user_settings_v2';
const PREV_SESSION_KEY = 'timeframe_ghost_session_v2';
const HISTORY_KEY = 'timeframe_session_history_v2';

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  vibrationEnabled: true,
  timeWarpEnabled: true,
  notificationEnabled: false,
  theme: 'deep-space',
  font: 'jetbrains',
  digitSize: 'large',
  animationIntensity: 'dynamic',
  bgStyle: 'mesh',
  highContrast: false,
  creatorAspect: '16-9',
  creatorCustomDimensions: { width: 1920, height: 1080 },
};

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.warn('Failed to load settings from localStorage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage', e);
  }
}

export function loadGhostSession(): SessionHistory | null {
  try {
    const raw = localStorage.getItem(PREV_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load ghost session', e);
    return null;
  }
}

export function saveGhostSession(session: SessionHistory): void {
  try {
    localStorage.setItem(PREV_SESSION_KEY, JSON.stringify(session));
    // Also append to history list (keep last 20)
    const history = loadSessionHistory();
    const updated = [session, ...history.filter(s => s.id !== session.id)].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save ghost session', e);
  }
}

export function clearGhostSession(): void {
  try {
    localStorage.removeItem(PREV_SESSION_KEY);
  } catch (e) {
    console.warn('Failed to clear ghost session', e);
  }
}

export function loadSessionHistory(): SessionHistory[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
