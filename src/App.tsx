import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TimerMode,
  VisualizerMode,
  Lap,
  SessionHistory,
  UserSettings,
  ChallengeConfig,
  ThemeConfig,
  ActivePage,
  ThemeId,
  TimerFont,
  DigitSize,
} from './types';
import { THEMES } from './utils/themes';
import {
  loadSettings,
  saveSettings,
  loadGhostSession,
  saveGhostSession,
  clearGhostSession,
} from './utils/storage';
import { decodeChallenge } from './utils/challengeUrl';
import { soundManager } from './utils/sound';
import { formatMilliseconds } from './utils/time';
import { sendDeviceNotification } from './utils/notifications';

import { Header } from './components/Header';
import { VisualizerContainer } from './components/visualizers/VisualizerContainer';
import { StopwatchControls } from './components/StopwatchControls';
import { CountdownControls } from './components/CountdownControls';
import { LapTable } from './components/LapTable';
import { TimeWarpOverlay } from './components/TimeWarpOverlay';
import { ShareCardModal } from './components/ShareCardModal';
import { ThemeGalleryModal } from './components/ThemeGalleryModal';
import { ChallengeModal } from './components/ChallengeModal';
import { CreatorMode } from './components/CreatorMode';
import { SettingsModal } from './components/SettingsModal';
import { AboutSection } from './components/AboutSection';
import { OverlayView } from './components/OverlayView';
import { FeatureInfoModal } from './components/FeatureInfoModal';

import { Share2, Flame, Play, X, Sparkles, Tv, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  // --- Persistent State ---
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [ghostSession, setGhostSession] = useState<SessionHistory | null>(loadGhostSession);

  // Sync settings with SoundManager & LocalStorage
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      soundManager.setEnabled(updated.soundEnabled);
      soundManager.setVolume(updated.soundVolume);
      return updated;
    });
  };

  // Active theme calculation (with optional custom accent override)
  const baseTheme = THEMES[settings.theme] || THEMES['deep-space'];
  const activeTheme: ThemeConfig = {
    ...baseTheme,
    accent: settings.customAccent || baseTheme.accent,
    accentGlow: settings.customAccent ? `${settings.customAccent}73` : baseTheme.accentGlow,
    digitColor: settings.customTextColor || baseTheme.digitColor,
    previewColor: settings.customAccent || baseTheme.previewColor,
  };

  // --- Router & Active Page State ---
  const [activePage, setActivePage] = useState<ActivePage>('stopwatch');

  // --- Timer State ---
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [visualizer, setVisualizer] = useState<VisualizerMode>('digital');

  // Time in milliseconds
  const [elapsedMs, setElapsedMs] = useState(0);
  const [countdownRemainingMs, setCountdownRemainingMs] = useState(60 * 1000); // 1m default
  const [countdownTotalMs, setCountdownTotalMs] = useState(60 * 1000);

  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Laps for stopwatch
  const [laps, setLaps] = useState<Lap[]>([]);
  const lastLapTotalTimeRef = useRef(0);

  // Active Challenge (if loaded from URL)
  const [activeChallenge, setActiveChallenge] = useState<ChallengeConfig | null>(null);

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isCreatorModeOpen, setIsCreatorModeOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [activeFeatureInfo, setActiveFeatureInfo] = useState<string | null>(null);

  // --- High-Precision Timing Loop References ---
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);

  // Parse initial route from URL Hash or Search Params
  const parseRoute = useCallback(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const params = new URLSearchParams(window.location.search);

    // Check challenge param ?c=...
    const challengeParam = params.get('c');
    if (challengeParam) {
      const parsed = decodeChallenge(challengeParam);
      if (parsed) {
        setActiveChallenge(parsed);
        setMode(parsed.mode);
        setVisualizer(parsed.visualizer);
        if (parsed.theme && THEMES[parsed.theme]) {
          updateSettings({ theme: parsed.theme });
        }
        if (parsed.durationMs && parsed.mode === 'countdown') {
          setCountdownTotalMs(parsed.durationMs);
          setCountdownRemainingMs(parsed.durationMs);
        }
      }
    }

    // Reset all modal states before opening the active one
    setIsCreatorModeOpen(false);
    setIsThemeModalOpen(false);
    setIsSettingsModalOpen(false);
    setIsShareCardOpen(false);

    // Direct Overlay Route for OBS Browser Source
    if (hash === 'overlay' || params.get('mode') === 'overlay') {
      setActivePage('overlay');
      return;
    }

    if (hash === 'creator') {
      setActivePage('creator');
      setIsCreatorModeOpen(true);
      return;
    }

    if (hash === 'countdown') {
      setActivePage('countdown');
      setMode('countdown');
      return;
    }

    if (hash === 'themes') {
      setActivePage('themes');
      setIsThemeModalOpen(true);
      return;
    }

    if (hash === 'about') {
      setActivePage('about');
      return;
    }

    if (hash === 'settings') {
      setActivePage('settings');
      setIsSettingsModalOpen(true);
      return;
    }

    if (hash === 'share') {
      setActivePage('share');
      setIsShareCardOpen(true);
      return;
    }

    // Default to stopwatch
    setActivePage('stopwatch');
    setMode('stopwatch');
  }, []);

  // Listen to browser Back/Forward (popstate and hashchange)
  useEffect(() => {
    parseRoute();
    const handleRouteChange = () => {
      parseRoute();
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, [parseRoute]);

  // Navigate handler that updates browser history so Back/Forward work!
  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    if (page === 'creator') {
      window.location.hash = 'creator';
      setIsCreatorModeOpen(true);
    } else if (page === 'themes') {
      window.location.hash = 'themes';
      setIsThemeModalOpen(true);
    } else if (page === 'settings') {
      window.location.hash = 'settings';
      setIsSettingsModalOpen(true);
    } else if (page === 'about') {
      window.location.hash = 'about';
    } else if (page === 'countdown') {
      window.location.hash = 'countdown';
      setMode('countdown');
    } else if (page === 'overlay') {
      window.location.hash = 'overlay';
    } else if (page === 'share') {
      window.location.hash = 'share';
      setIsShareCardOpen(true);
    } else {
      window.location.hash = 'stopwatch';
      setMode('stopwatch');
    }
  };

  // Sync sound settings with audio manager
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    soundManager.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Main high-precision animation frame loop
  const tick = useCallback(() => {
    const now = performance.now();
    const currentDelta = now - startTimeRef.current;
    const totalCurrentMs = accumulatedMsRef.current + currentDelta;

    if (mode === 'stopwatch') {
      setElapsedMs(totalCurrentMs);
      requestRef.current = requestAnimationFrame(tick);
    } else {
      // Countdown mode
      const remaining = Math.max(0, countdownTotalMs - totalCurrentMs);
      setCountdownRemainingMs(remaining);

      if (remaining <= 0) {
        setIsRunning(false);
        setIsFinished(true);

        if (settings.notificationEnabled) {
          sendDeviceNotification({
            title: activeChallenge ? `🏆 ${activeChallenge.title} Completed!` : '⏱️ TIMEFRAME Timer Complete',
            body: `Your ${formatMilliseconds(countdownTotalMs).displayTime} session has finished with zero drift!`,
            tag: 'timer-finish',
          });
        }
      } else {
        requestRef.current = requestAnimationFrame(tick);
      }
    }
  }, [mode, countdownTotalMs, settings.notificationEnabled]);

  // Start timer
  const handleStart = () => {
    if (isFinished) {
      handleReset();
    }
    soundManager.playStart();
    setIsRunning(true);
    setHasStarted(true);
    setIsFinished(false);
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(tick);
  };

  // Pause timer
  const handlePause = () => {
    if (!isRunning) return;
    soundManager.playPause();
    setIsRunning(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    const currentDelta = performance.now() - startTimeRef.current;
    accumulatedMsRef.current += currentDelta;
  };

  // Reset timer
  const handleReset = () => {
    soundManager.playReset();
    setIsRunning(false);
    setHasStarted(false);
    setIsFinished(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    accumulatedMsRef.current = 0;
    startTimeRef.current = 0;
    lastLapTotalTimeRef.current = 0;

    if (mode === 'stopwatch') {
      setElapsedMs(0);
      setLaps([]);
    } else {
      setCountdownRemainingMs(countdownTotalMs);
    }
  };

  // Record Lap
  const handleLap = () => {
    if (!hasStarted) return;
    soundManager.playLap();
    const currentTotal = elapsedMs;
    const lapTime = currentTotal - lastLapTotalTimeRef.current;
    lastLapTotalTimeRef.current = currentTotal;

    const newLap: Lap = {
      id: Date.now() + Math.random(),
      lapNumber: laps.length + 1,
      lapTime,
      splitTime: currentTotal,
      totalTime: currentTotal,
      timestamp: Date.now(),
    };

    setLaps((prev) => [...prev, newLap]);
  };

  // Save current session as Ghost Lap baseline
  const handleSetAsGhost = () => {
    if (laps.length === 0) return;
    const session: SessionHistory = {
      id: 'session_' + Date.now(),
      date: new Date().toISOString(),
      totalTime: elapsedMs,
      bestLap: Math.min(...laps.map((l) => l.lapTime)),
      laps,
    };
    saveGhostSession(session);
    setGhostSession(session);
    soundManager.playTap();
  };

  const handleClearGhost = () => {
    clearGhostSession();
    setGhostSession(null);
  };

  // Set Countdown Duration
  const handleSetCountdownDuration = (ms: number) => {
    handleReset();
    setCountdownTotalMs(ms);
    setCountdownRemainingMs(ms);
  };

  // Launch Challenge
  const handleLaunchChallenge = (challenge: ChallengeConfig) => {
    setActiveChallenge(challenge);
    setMode(challenge.mode);
    setVisualizer(challenge.visualizer);
    if (challenge.theme && THEMES[challenge.theme]) {
      updateSettings({ theme: challenge.theme });
    }
    if (challenge.durationMs && challenge.mode === 'countdown') {
      handleSetCountdownDuration(challenge.durationMs);
    } else {
      handleReset();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // --- Keyboard Shortcuts Listener ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard against typing in form fields
      const target = e.target as HTMLElement;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      } else if (e.code === 'KeyL') {
        if (mode === 'stopwatch') {
          e.preventDefault();
          handleLap();
        }
      } else if (e.code === 'Escape') {
        if (isCreatorModeOpen) {
          setIsCreatorModeOpen(false);
          window.location.hash = mode;
        }
        if (isThemeModalOpen) setIsThemeModalOpen(false);
        if (isChallengeModalOpen) setIsChallengeModalOpen(false);
        if (isSettingsModalOpen) setIsSettingsModalOpen(false);
        if (isShareCardOpen) setIsShareCardOpen(false);
        if (activePage === 'overlay') {
          navigateTo('stopwatch');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRunning,
    hasStarted,
    mode,
    elapsedMs,
    isCreatorModeOpen,
    isThemeModalOpen,
    isChallengeModalOpen,
    isSettingsModalOpen,
    isShareCardOpen,
    activePage,
  ]);

  // Current display time object
  const currentRawMs = mode === 'stopwatch' ? elapsedMs : countdownRemainingMs;
  const formattedTime = formatMilliseconds(currentRawMs);

  // Background styling
  const getBackgroundStyle = () => {
    if (settings.customBgColor) return '';
    switch (settings.bgStyle) {
      case 'grid':
        return `${activeTheme.bgGradient} bg-grid-pattern`;
      case 'solid':
        return 'bg-[#0a0c13]';
      case 'particles':
      case 'mesh':
      default:
        return activeTheme.bgGradient;
    }
  };

  // If in pure OBS Overlay View, render the transparent overlay view directly!
  if (activePage === 'overlay') {
    return (
      <OverlayView
        mode={mode}
        visualizer={visualizer}
        onChangeVisualizer={setVisualizer}
        time={formattedTime}
        rawMs={currentRawMs}
        totalDurationMs={countdownTotalMs}
        isRunning={isRunning}
        theme={activeTheme}
        font={settings.font}
        digitSize={settings.digitSize}
        onExitOverlay={() => navigateTo('stopwatch')}
      />
    );
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-500 relative overflow-x-hidden ${getBackgroundStyle()} ${
        settings.theme === 'retro-terminal' ? 'scanlines' : ''
      }`}
      style={settings.customBgColor ? { backgroundColor: settings.customBgColor } : {}}
    >
      {/* Ambient background blur glows */}
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full blur-[130px] opacity-35 pointer-events-none -z-10 transition-all duration-700"
        style={{ backgroundColor: activeTheme.accent }}
      />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none -z-10 bg-blue-600 transition-all duration-700" />

      {/* Top Application Header & Navigation */}
      <Header
        activePage={activePage}
        onNavigate={navigateTo}
        mode={mode}
        onChangeMode={(newMode) => {
          handleReset();
          setMode(newMode);
          navigateTo(newMode);
        }}
        isRunning={isRunning}
        theme={activeTheme}
        settings={settings}
        ghostSession={ghostSession}
        onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        onOpenChallengeModal={() => setIsChallengeModalOpen(true)}
        onOpenInfo={setActiveFeatureInfo}
      />

      {/* Active Challenge Floating Banner */}
      {activeChallenge && (
        <div className="w-full max-w-xl mx-auto px-4 mt-2 z-20 animate-fade-in">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 border border-amber-500/40 backdrop-blur-xl shadow-lg">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shadow-md">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                  Challenge Loaded
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">
                  {activeChallenge.title}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!isRunning && (
                <button
                  onClick={handleStart}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center space-x-1 shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              )}
              <button
                onClick={() => setActiveChallenge(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Timer Hero Center (or About page) */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 z-10">
        {activePage === 'about' ? (
          <AboutSection onNavigate={navigateTo} />
        ) : (
          <>
            {/* Visualizer Mode Switcher & Display */}
            <VisualizerContainer
              mode={mode}
              visualizer={visualizer}
              onChangeVisualizer={setVisualizer}
              time={formattedTime}
              rawMs={currentRawMs}
              totalDurationMs={countdownTotalMs}
              isRunning={isRunning}
              theme={activeTheme}
              digitSize={settings.digitSize}
              font={settings.font}
              isTimeWarpCritical={mode === 'countdown' && isRunning && countdownRemainingMs <= 5000}
              onOpenInfo={setActiveFeatureInfo}
            />

            {/* Primary Controls Row */}
            {mode === 'stopwatch' ? (
              <StopwatchControls
                isRunning={isRunning}
                hasStarted={hasStarted}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onLap={handleLap}
                theme={activeTheme}
                onOpenInfo={setActiveFeatureInfo}
              />
            ) : (
              <CountdownControls
                isRunning={isRunning}
                hasStarted={hasStarted}
                isFinished={isFinished}
                currentDurationMs={countdownTotalMs}
                onSetDuration={handleSetCountdownDuration}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                theme={activeTheme}
                onOpenInfo={setActiveFeatureInfo}
              />
            )}

            {/* Quick Action Share Card Bar */}
            {(hasStarted || elapsedMs > 0 || isFinished) && (
              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => navigateTo('share')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/90 text-xs font-semibold backdrop-blur-md shadow-md transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Generate Shareable Time Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeatureInfo('shareCard')}
                  title="Learn about Shareable Time Cards"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            )}

            {/* Stopwatch Laps & Ghost Lap Table */}
            {mode === 'stopwatch' && (
              <LapTable
                laps={laps}
                ghostSession={ghostSession}
                onSetAsGhost={handleSetAsGhost}
                onClearGhost={handleClearGhost}
                theme={activeTheme}
                onOpenInfo={setActiveFeatureInfo}
              />
            )}
          </>
        )}
      </main>

      {/* Semantic Footer with SEO Links */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between text-white/50 text-xs border-t border-white/5 z-10 gap-3">
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
          <span className="font-extrabold text-white/80">TIMEFRAME Studio</span>
          <span className="hidden sm:inline">•</span>
          <span>Free Online Precision Stopwatch, Countdown Timer & OBS Stream Overlay</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-medium">
          <button
            onClick={() => navigateTo('stopwatch')}
            className={`hover:text-white transition-colors cursor-pointer ${activePage === 'stopwatch' ? 'text-purple-300 font-bold' : ''}`}
          >
            Stopwatch
          </button>
          <span>•</span>
          <button
            onClick={() => navigateTo('countdown')}
            className={`hover:text-white transition-colors cursor-pointer ${activePage === 'countdown' ? 'text-purple-300 font-bold' : ''}`}
          >
            Countdown
          </button>
          <span>•</span>
          <button
            onClick={() => navigateTo('creator')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            OBS Overlay
          </button>
          <span>•</span>
          <button
            onClick={() => navigateTo('about')}
            className={`hover:text-white transition-colors cursor-pointer ${activePage === 'about' ? 'text-purple-300 font-bold' : ''}`}
          >
            Guide
          </button>
        </div>
      </footer>

      {/* TIME WARP OVERLAY */}
      <TimeWarpOverlay
        remainingMs={countdownRemainingMs}
        totalDurationMs={countdownTotalMs}
        isRunning={isRunning}
        isFinished={isFinished}
        timeWarpEnabled={settings.timeWarpEnabled}
        soundEnabled={settings.soundEnabled}
        vibrationEnabled={settings.vibrationEnabled}
        theme={activeTheme}
        onReset={handleReset}
        onOpenShareCard={() => navigateTo('share')}
        time={formattedTime}
      />

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareCardOpen}
        onClose={() => {
          setIsShareCardOpen(false);
          if (activePage === 'share') navigateTo(mode);
        }}
        time={formattedTime}
        rawMs={currentRawMs}
        mode={mode}
        laps={laps}
        theme={activeTheme}
        activeChallenge={activeChallenge}
        totalDurationMs={countdownTotalMs}
        isFinished={isFinished}
      />

      {/* Theme Gallery & Studio Modal */}
      <ThemeGalleryModal
        isOpen={isThemeModalOpen}
        onClose={() => {
          setIsThemeModalOpen(false);
          if (activePage === 'themes') navigateTo('stopwatch');
        }}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Challenge Creator Modal */}
      <ChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        onLaunchChallenge={handleLaunchChallenge}
        currentTheme={activeTheme}
      />

      {/* Creator & OBS Streamer Fullscreen Studio */}
      <CreatorMode
        isOpen={isCreatorModeOpen}
        onClose={() => {
          setIsCreatorModeOpen(false);
          if (activePage === 'creator') navigateTo(mode);
        }}
        mode={mode}
        visualizer={visualizer}
        onChangeVisualizer={setVisualizer}
        time={formattedTime}
        rawMs={currentRawMs}
        totalDurationMs={countdownTotalMs}
        isRunning={isRunning}
        hasStarted={hasStarted}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onLap={handleLap}
        activeTheme={activeTheme}
        onSelectTheme={(tId) => updateSettings({ theme: tId })}
        font={settings.font}
        onChangeFont={(f) => updateSettings({ font: f })}
        digitSize={settings.digitSize}
        onChangeDigitSize={(s) => updateSettings({ digitSize: s })}
        customBgColor={settings.customBgColor}
        onCustomBgColorChange={(c) => updateSettings({ customBgColor: c })}
        customTextColor={settings.customTextColor}
        onCustomTextColorChange={(c) => updateSettings({ customTextColor: c })}
        customAccentColor={settings.customAccent}
        onCustomAccentColorChange={(c) => updateSettings({ customAccent: c })}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
          if (activePage === 'settings') navigateTo(mode);
        }}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Feature Guide & Information Modal */}
      <FeatureInfoModal
        featureKey={activeFeatureInfo}
        onClose={() => setActiveFeatureInfo(null)}
      />
    </div>
  );
};
