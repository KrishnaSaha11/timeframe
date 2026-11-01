/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'warp-glow': 'warpGlow 1.5s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        warpGlow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(249, 115, 22, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
