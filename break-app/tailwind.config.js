/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crimson: '#FF003C',
        gold: '#FFCC00',
        cyan: '#00E5FF',
        success: '#00FF88',
        warnL1: '#FFD700',
        warnL2: '#FF8800',
        warnL3: '#FF003C',
        purple: '#8338EC',
        blue: '#3A86FF',
        pink: '#FF006E',
        blackbase: '#050505',
        charcoal: '#121212',
        slate: '#1A1A1F',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        teko: ['Teko', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        ambient: '0 20px 60px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)',
        'glow-crimson': '0 0 32px rgba(255,0,60,0.35)',
        'glow-cyan': '0 0 32px rgba(0,229,255,0.35)',
        'glow-gold': '0 0 32px rgba(255,204,0,0.35)',
        'glow-green': '0 0 32px rgba(0,255,136,0.35)',
        'glow-yellow': '0 0 32px rgba(255,215,0,0.3)',
        'glow-orange': '0 0 32px rgba(255,136,0,0.3)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
      },
    },
  },
  plugins: [],
}
