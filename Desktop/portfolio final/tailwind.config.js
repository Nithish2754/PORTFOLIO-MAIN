/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0e0f',
          surface: '#111618',
          elevated: '#161d20',
        },
        border: {
          dim: '#1e2a2d',
          accent: '#2de2c740',
        },
        accent: {
          cyan: '#2de2c7',
          'cyan-dim': '#2de2c720',
          amber: '#ffb84d',
          red: '#ff5c5c',
        },
        text: {
          primary: '#e8edf0',
          muted: '#6b8a92',
          dim: '#3d5a62',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        float: 'float 4s ease-in-out infinite',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px #2de2c740, 0 0 40px #2de2c720',
        'glow-cyan-sm': '0 0 10px #2de2c730',
        'glow-amber': '0 0 20px #ffb84d40',
      },
    },
  },
  plugins: [],
};
