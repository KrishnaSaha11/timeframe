import React, { useState } from 'react';
import { ActivePage, TimerMode, ThemeConfig, UserSettings, SessionHistory } from '../types';
import {
  Timer,
  Clock,
  Palette,
  Flame,
  Tv,
  Settings,
  Volume2,
  VolumeX,
  Info,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { InfoButton } from './InfoButton';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  mode: TimerMode;
  onChangeMode: (mode: TimerMode) => void;
  isRunning: boolean;
  theme: ThemeConfig;
  settings: UserSettings;
  ghostSession: SessionHistory | null;
  onToggleSound: () => void;
  onOpenChallengeModal: () => void;
  onOpenInfo?: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  mode,
  onChangeMode,
  isRunning,
  theme,
  settings,
  ghostSession,
  onToggleSound,
  onOpenChallengeModal,
  onOpenInfo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: ActivePage; label: string; icon: React.ReactNode; desc: string }> = [
    { id: 'stopwatch', label: 'Stopwatch', icon: <Timer className="w-3.5 h-3.5" />, desc: 'Precision millisecond stopwatch with split laps' },
    { id: 'countdown', label: 'Countdown', icon: <Clock className="w-3.5 h-3.5" />, desc: 'Custom timer with audio fanfare and confetti' },
    { id: 'creator', label: 'Creator Studio', icon: <Tv className="w-3.5 h-3.5" />, desc: '16:9, 9:16 and transparent OBS stream overlay' },
    { id: 'themes', label: 'Themes', icon: <Palette className="w-3.5 h-3.5" />, desc: 'Cyberpunk, retro terminal, minimalist & custom colors' },
    { id: 'about', label: 'About & Guide', icon: <Info className="w-3.5 h-3.5" />, desc: 'Keyboard shortcuts, ghost benchmarks & usage guide' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" />, desc: 'Sound, audio volume, fonts, vibration & digit size' },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full z-30 relative">
      <header className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Wordmark & Logo */}
        <button
          onClick={() => handleNavClick('stopwatch')}
          className="flex items-center space-x-2 sm:space-x-3 text-left cursor-pointer group shrink-0"
        >
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, #6366f1)`,
              boxShadow: `0 8px 20px -4px ${theme.accentGlow}`,
            }}
          >
            <Timer className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white font-sans">
                TIMEFRAME
              </span>
              <span
                className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md border"
                style={{
                  color: theme.accent,
                  borderColor: `${theme.accent}40`,
                  backgroundColor: `${theme.accent}15`,
                }}
              >
                Studio
              </span>
            </div>
            <span className="text-[10px] text-white/40 tracking-wider hidden sm:block">
              Precision Timers for Creators
            </span>
          </div>
        </button>

        {/* Desktop Main Navigation Bar (large screens) */}
        <nav className="hidden lg:flex items-center bg-black/50 border border-white/10 p-1 rounded-2xl backdrop-blur-xl shadow-inner">
          {navItems.map((item) => {
            const isActive = activePage === item.id || (item.id === 'stopwatch' && activePage === 'home');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white shadow-md border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                style={isActive ? { borderColor: `${theme.accent}60`, color: '#ffffff' } : {}}
              >
                <span style={isActive ? { color: theme.accent } : {}}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Quick Audio Mute */}
          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer shrink-0"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>

          {/* Time Challenge Trigger Button */}
          <div className="relative group flex items-center shrink-0">
            <button
              onClick={onOpenChallengeModal}
              title="Create or Share Time Challenge"
              className="p-2 sm:p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Flame className="w-4 h-4 fill-current text-amber-400" />
              <span className="text-xs font-bold hidden sm:inline">Challenge</span>
            </button>
            {onOpenInfo && (
              <div className="hidden sm:block absolute -top-1.5 -right-1.5">
                <InfoButton onClick={() => onOpenInfo('challenge')} size="xs" title="Challenge info" />
              </div>
            )}
          </div>

          {/* Settings Quick Access on Mobile Header */}
          <button
            onClick={() => handleNavClick('settings')}
            title="Open Settings"
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Creator Studio Quick Trigger (Desktop & Tablet) */}
          <div className="relative group hidden sm:flex items-center shrink-0">
            <button
              onClick={() => handleNavClick('creator')}
              title="Launch Fullscreen Creator Studio"
              className="p-2 sm:p-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center space-x-1.5"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, #6366f1)`,
                boxShadow: `0 4px 15px -2px ${theme.accentGlow}`,
              }}
            >
              <Tv className="w-4 h-4" />
              <span>Creator</span>
            </button>
            {onOpenInfo && (
              <div className="absolute -top-1.5 -right-1.5">
                <InfoButton onClick={() => onOpenInfo('creator')} size="xs" title="Creator Studio info" />
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      {/* Persistent Mobile & Tablet Navigation Bar Strip */}
      {/* Ensures Stopwatch, Countdown, Creator, Themes, Guide, and Settings are always visible and 1-tap accessible on mobile! */}
      <div className="lg:hidden w-full max-w-xl mx-auto px-2 pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar touch-pan-x scroll-smooth justify-start xs:justify-center">
          {navItems.map((item) => {
            const isActive = activePage === item.id || (item.id === 'stopwatch' && activePage === 'home');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/20 text-white shadow-md border border-white/25'
                    : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                style={isActive ? { borderColor: `${theme.accent}80`, color: '#ffffff' } : {}}
              >
                <span style={isActive ? { color: theme.accent } : {}}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Drawer Menu (when Hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-24 z-50 p-4 bg-slate-900/95 border-b border-white/20 backdrop-blur-2xl shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">Navigation Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-white/60 hover:text-white flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id || (item.id === 'stopwatch' && activePage === 'home');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-start space-x-3.5 px-4 py-3 rounded-2xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/30 text-white border border-purple-400'
                      : 'text-white/70 hover:bg-white/10 hover:text-white bg-white/[0.03] border border-white/5'
                  }`}
                >
                  <div
                    className="p-2 rounded-xl mt-0.5 shrink-0"
                    style={{
                      backgroundColor: isActive ? theme.accent : 'rgba(255,255,255,0.06)',
                      color: isActive ? '#000000' : '#ffffff',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">{item.label}</span>
                    <span className="text-xs text-white/50 leading-relaxed block mt-0.5">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};
