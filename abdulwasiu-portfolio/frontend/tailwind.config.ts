import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#141419',
        'bg-light': '#F5F5F0',
        accent: '#33B587',
        ink: '#141419',
        'ink-light': '#F5F5F0',
        muted: '#707079',
        border: '#D9D9D4',
        card: '#ffffff',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        widest: '.2em',
      },
    },
  },
  plugins: [],
} satisfies Config
