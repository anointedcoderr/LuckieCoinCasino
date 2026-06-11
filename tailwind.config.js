/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0A0C',
        surface: '#141216',
        'surface-2': '#1B181F',
        deep: '#08070A',
        ink: '#F6F1E7',
        muted: '#9A9189',
        divider: '#2A2630',
        primary: '#D4AF37',
        'primary-dark': '#B8932E',
        'primary-light': '#F0D77A',
        accent: '#1F8A5B',
        'accent-dark': '#176B47',
        'accent-2': '#5B2A86',
        'accent-2-light': '#7C4DB8',
        danger: '#C0473F',
        warn: '#D08B2C',
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'coin-soft': '0 0 18px rgba(212, 175, 55, 0.35), 0 0 4px rgba(212, 175, 55, 0.5)',
        'coin-strong': '0 0 36px rgba(212, 175, 55, 0.55), 0 0 10px rgba(240, 215, 122, 0.7)',
        'card': '0 24px 60px -28px rgba(0, 0, 0, 0.8)',
        'card-gold': '0 24px 60px -28px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(135deg, #F0D77A 0%, #D4AF37 45%, #B8932E 100%)',
        'velvet-radial': 'radial-gradient(120% 120% at 50% 0%, #1B181F 0%, #0B0A0C 55%, #08070A 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3.5s ease-in-out infinite',
        'float': 'float 7s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'shimmer': 'shimmer 2.8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
