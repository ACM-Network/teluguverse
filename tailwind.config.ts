import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dark: { DEFAULT: '#070810', 2: '#0D0F1E', 3: '#12152A' },
        surface: { DEFAULT: '#1A1D35', 2: '#21253F', 3: '#282C4E' },
        gold: { DEFAULT: '#FFD700', 2: '#FFA500', dim: 'rgba(255,215,0,0.15)' },
        crimson: { DEFAULT: '#E50914', dark: '#C0000F' },
        border: { DEFAULT: 'rgba(255,215,0,0.15)', bright: 'rgba(255,215,0,0.35)', glow: 'rgba(255,215,0,0.6)' },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.4s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(255,215,0,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(255,215,0,0.5)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
export default config
