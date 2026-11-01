import React from 'react';
import { ThemeId, UserSettings, ThemeConfig } from '../types';
import { THEMES, ACCENT_PALETTE, FONT_OPTIONS } from '../utils/themes';
import { X, Check, Palette, Type, Sparkles, Sliders, RotateCcw } from 'lucide-react';

interface ThemeGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const ThemeGalleryModal: React.FC<ThemeGalleryModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Theme Gallery & Visual Studio</h3>
              <p className="text-xs text-white/50">Personalize themes, custom colors, typography and ambient textures</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Theme Grid (14 Themes) */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/70 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Curated Themes ({Object.keys(THEMES).length})</span>
            </h4>
            <span className="text-[11px] text-white/40">Immediate live preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
              const theme = THEMES[themeKey];
              const isSelected = settings.theme === themeKey;

              return (
                <button
                  key={theme.id}
                  onClick={() => onUpdateSettings({ theme: themeKey })}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'border-white/60 shadow-xl scale-[1.02] bg-white/[0.08]'
                      : 'border-white/10 hover:border-white/30 bg-black/40'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 8px 25px -5px ${theme.accentGlow}` : undefined,
                  }}
                >
                  {/* Theme visual preview card */}
                  <div className={`w-full h-16 rounded-xl mb-2.5 relative overflow-hidden ${theme.bgGradient} border border-white/10 flex items-center justify-center shadow-inner`}>
                    <div
                      className="w-5 h-5 rounded-full shadow-lg"
                      style={{ backgroundColor: theme.accent, filter: `drop-shadow(0 0 8px ${theme.accent})` }}
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-bold text-white block group-hover:text-purple-300 transition-colors">
                    {theme.name}
                  </span>
                  <span className="text-[10px] text-white/50 line-clamp-1 mt-0.5">
                    {theme.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Custom Color Overrides */}
        <div className="mb-7 p-4 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/70 flex items-center space-x-2">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Custom Color Pickers</span>
            </h4>
            {(settings.customAccent || settings.customTextColor || settings.customBgColor) && (
              <button
                onClick={() => onUpdateSettings({ customAccent: undefined, customTextColor: undefined, customBgColor: undefined })}
                className="text-[11px] text-purple-300 hover:text-white flex items-center space-x-1 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Custom Colors</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Custom Accent */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Accent Highlight</span>
                <span className="text-[10px] text-white/40">Glow & UI highlights</span>
              </div>
              <input
                type="color"
                value={settings.customAccent || THEMES[settings.theme].accent}
                onChange={(e) => onUpdateSettings({ customAccent: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>

            {/* Custom Text Color */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Timer Digits Color</span>
                <span className="text-[10px] text-white/40">Primary numbers</span>
              </div>
              <input
                type="color"
                value={settings.customTextColor || '#ffffff'}
                onChange={(e) => onUpdateSettings({ customTextColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>

            {/* Custom Background Color */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Studio Canvas BG</span>
                <span className="text-[10px] text-white/40">Background solid tint</span>
              </div>
              <input
                type="color"
                value={settings.customBgColor || '#0a0c13'}
                onChange={(e) => onUpdateSettings({ customBgColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>
        </div>

        {/* 3. Typography & Styling Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
          {/* Font Selector */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/70 mb-3 flex items-center space-x-2">
              <Type className="w-3.5 h-3.5 text-purple-400" />
              <span>Timer Typeface</span>
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ font: f.id as any })}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all cursor-pointer ${
                    settings.font === f.id
                      ? 'bg-white/15 border-white/40 text-white font-bold'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={f.class}>{f.name}</span>
                  <span className="text-xs font-mono opacity-60 tabular-nums">00:42.89</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizing & Background Texture */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white/70 mb-2">
                Digit Scale
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'cinematic'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ digitSize: size })}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      settings.digitSize === size
                        ? 'bg-purple-600/40 border-purple-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white/70 mb-2">
                Background Texture Style
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'mesh', label: 'Atmospheric Mesh' },
                  { id: 'grid', label: 'Cyber Grid' },
                  { id: 'particles', label: 'Starfield Glow' },
                  { id: 'solid', label: 'Matte Minimal' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onUpdateSettings({ bgStyle: bg.id as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      settings.bgStyle === bg.id
                        ? 'bg-purple-600/40 border-purple-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white/70 mb-2">
                Animation Intensity
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {(['off', 'subtle', 'dynamic'] as const).map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => onUpdateSettings({ animationIntensity: intensity })}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      settings.animationIntensity === intensity
                        ? 'bg-purple-600/40 border-purple-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer save/close button */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-white/90 shadow-xl cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
