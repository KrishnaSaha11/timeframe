# TIMEFRAME — Free Online Stopwatch & Countdown Timer

![TIMEFRAME Studio](https://img.shields.io/badge/TIMEFRAME-Studio-8b5cf6?style=for-the-badge&logo=timer&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

**TIMEFRAME** is a premium, visually stunning online stopwatch and countdown timer web application — built for creators, streamers, athletes, and productivity enthusiasts.

## ✨ Features

- ⏱️ **High-Precision Stopwatch** — Sub-millisecond accuracy using `performance.now()` with zero drift
- ⏳ **Countdown Timer** — Quick presets (10s, 30s, 1m, 5m, 10m, 25m Pomodoro) + custom H:M:S input
- 🎨 **5 Visualizer Modes** — Digital, Circular, Analog, Fluid, Minimal
- 🏁 **Lap & Split Timing** — Record unlimited laps with pace deltas and CSV export
- 👻 **Ghost Lap Benchmark** — Race against your past sessions with live delta comparison
- 🔥 **Time Challenge Mode** — Create shareable challenge URLs for friends and community
- 📺 **Creator Studio & OBS Overlay** — 16:9, 9:16, 1:1 aspect framing with transparent browser source
- 🎭 **Curated Ambient Themes** — Deep Space, Cyberpunk, Retro Terminal, Minimalist, and more
- 🏆 **Shareable Achievement Cards** — Export Instagram/TikTok-ready PNG cards with challenge name, progress bar, and verified badge
- 📱 **Phone & Desktop Notifications** — Push alerts via Service Worker when timer finishes (even with phone locked)
- 📳 **Haptic Vibration** — Tactile feedback for countdown ticks and completion on mobile
- ℹ️ **Feature Info Buttons** — Every button has an info tooltip explaining what it does
- 🎵 **Synthesized Audio** — Zero-latency Web Audio API sound effects and completion fanfare
- 🎊 **Confetti Celebration** — Victory confetti on countdown completion with Time Warp visual effects
- ⌨️ **Keyboard Shortcuts** — Space (start/pause), R (reset), L (lap), Esc (exit)
- 📱 **Fully Mobile Responsive** — Optimized for 360px+ screens with touch-friendly controls
- 🔒 **Privacy-First** — All data stored locally in localStorage, no accounts, no tracking

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/KrishnaSaha11/timeframe.git
cd timeframe

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript 5.6 | Type Safety |
| Vite 5 | Build Tool & Dev Server |
| Tailwind CSS 3.4 | Utility-First Styling |
| Lucide React | Icon Library |
| html-to-image | PNG Card Export |
| canvas-confetti | Celebration Effects |
| Web Audio API | Zero-Latency Sound |

## 📁 Project Structure

```
src/
├── components/
│   ├── visualizers/         # 5 timer display modes
│   │   ├── DigitalVisualizer.tsx
│   │   ├── CircularVisualizer.tsx
│   │   ├── AnalogVisualizer.tsx
│   │   ├── FluidVisualizer.tsx
│   │   ├── MinimalVisualizer.tsx
│   │   └── VisualizerContainer.tsx
│   ├── Header.tsx           # Navigation & mobile menu
│   ├── StopwatchControls.tsx
│   ├── CountdownControls.tsx
│   ├── LapTable.tsx         # Lap tracking & ghost comparison
│   ├── ShareCardModal.tsx   # Achievement card export
│   ├── ChallengeModal.tsx   # Time challenge creator
│   ├── CreatorMode.tsx      # OBS overlay & aspect framing
│   ├── ThemeGalleryModal.tsx
│   ├── SettingsModal.tsx
│   ├── TimeWarpOverlay.tsx  # Countdown visual effects
│   ├── FeatureInfoModal.tsx # Feature explanations
│   ├── InfoButton.tsx       # Info tooltip component
│   └── AboutSection.tsx
├── utils/
│   ├── time.ts              # Time formatting
│   ├── sound.ts             # Web Audio synthesizer
│   ├── storage.ts           # LocalStorage persistence
│   ├── notifications.ts     # Phone & desktop push
│   ├── challengeUrl.ts      # Challenge URL encoding
│   └── themes.ts            # Theme definitions
├── types.ts                 # TypeScript interfaces
├── App.tsx                  # Main application
├── main.tsx                 # Entry point
└── index.css                # Tailwind & custom styles
```

## 🌐 Live Demo

Visit [timeframe.app](https://timeframe.app) *(coming soon)*

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

Built with ❤️ by [KrishnaSaha11](https://github.com/KrishnaSaha11)
