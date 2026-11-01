import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/storage';
import {
  X,
  Volume2,
  VolumeX,
  Bell,
  Smartphone,
  Vibrate,
  Zap,
  Keyboard,
  RotateCcw,
  Sliders,
  Check,
  Send,
} from 'lucide-react';
import {
  isPhoneDevice,
  isNotificationSupported,
  requestDeviceNotificationPermission,
  sendDeviceNotification,
} from '../utils/notifications';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [testSent, setTestSent] = useState<boolean>(false);
  const [vibrateTested, setVibrateTested] = useState<boolean>(false);
  const isPhone = isPhoneDevice();
  const supported = isNotificationSupported();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestNotification = async () => {
    try {
      const perm = await requestDeviceNotificationPermission();
      setNotifPermission(perm);
      if (perm === 'granted') {
        onUpdateSettings({ notificationEnabled: true });
        // Immediate welcome confirmation notification
        await sendDeviceNotification({
          title: 'TIMEFRAME Alert Enabled! ⏱️',
          body: isPhone
            ? 'Phone notifications active! You will be alerted when timers end.'
            : 'Desktop notifications active! You will be alerted when timers end.',
        });
      } else {
        onUpdateSettings({ notificationEnabled: false });
      }
    } catch (e: any) {
      alert(e.message || 'Notification permission error.');
    }
  };

  const handleTestNotification = async () => {
    setTestSent(true);
    await sendDeviceNotification({
      title: 'TIMEFRAME Alert Test 🔔',
      body: `Haptic vibration and notification test successful on ${isPhone ? 'Phone' : 'Device'}!`,
    });
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleTestVibration = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      setVibrateTested(true);
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch (e) {
        // ignore
      }
      setTimeout(() => setVibrateTested(false), 1500);
    } else {
      alert('Haptic vibration is not supported on this browser or hardware.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Studio Preferences</h3>
              <p className="text-xs text-white/50">Audio, notifications, haptics & shortcut bindings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio & Haptic Settings */}
        <div className="space-y-3.5 mb-6">
          {/* Audio Synthesizer */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-purple-400">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Synthesized Audio</span>
                <span className="text-[11px] text-white/50">Zero-latency precision sound effects & chimes</span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-purple-600' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                  settings.soundEnabled ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Haptic Phone Vibration */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400">
                  <Vibrate className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">Phone Haptic Vibration</span>
                  <span className="text-[11px] text-white/50">Tactile pulses for countdown ticks & finish alerts</span>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.vibrationEnabled ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                    settings.vibrationEnabled ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            {settings.vibrationEnabled && (
              <div className="mt-2.5 pt-2.5 border-t border-white/5 flex justify-end">
                <button
                  type="button"
                  onClick={handleTestVibration}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <Vibrate className="w-3 h-3" />
                  <span>{vibrateTested ? 'Vibrated! 📳' : 'Test Phone Vibration'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Phone & Desktop Push Notifications */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-rose-400">
                  {isPhone ? <Smartphone className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-semibold text-white">Phone & Desktop Notifications</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                      {isPhone ? '📱 Phone' : '💻 Desktop'}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/50 block">
                    Alerts when timer ends, even if phone is locked or in another tab
                  </span>
                </div>
              </div>

              {notifPermission === 'granted' ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Active</span>
                </span>
              ) : (
                <button
                  onClick={handleRequestNotification}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Enable
                </button>
              )}
            </div>

            {/* Test Notification Action */}
            {notifPermission === 'granted' && (
              <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>System notifications enabled on this device</span>
                </span>
                <button
                  type="button"
                  onClick={handleTestNotification}
                  disabled={testSent}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <Send className="w-3 h-3 text-purple-400" />
                  <span>{testSent ? 'Alert Sent! 📱' : 'Send Test Notification'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Cheat Sheet */}
        <div className="mb-6 p-4 rounded-2xl bg-black/50 border border-white/10">
          <h4 className="text-xs uppercase font-bold text-white/60 tracking-wider mb-2.5 flex items-center space-x-1.5">
            <Keyboard className="w-4 h-4 text-purple-400" />
            <span>Keyboard Shortcuts</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-white/60">Start / Pause</span>
              <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/15 font-mono text-white text-[11px]">
                Space
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-white/60">Reset Timer</span>
              <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/15 font-mono text-white text-[11px]">
                R
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-white/60">Record Lap</span>
              <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/15 font-mono text-white text-[11px]">
                L
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-white/60">Exit Fullscreen</span>
              <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/15 font-mono text-white text-[11px]">
                Esc
              </kbd>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => onUpdateSettings(DEFAULT_SETTINGS)}
            className="text-xs text-white/50 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 shadow-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
