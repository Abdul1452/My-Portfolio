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
        // Coastal palette — used by the sidebar-rail redesign (CoastalHomePage).
        // Kept separate from the tokens above so the old dark/Sora pages
        // (/pm, /projects/:slug, 404) are unaffected.
        coastal: {
          cream: '#fdfcf8',
          sand: '#f4f1e9',
          ink: '#1d2a25',
          green: '#26483e',
          'green-dark': '#1d3830',
          leaf: '#2e6353',
          'leaf-hover': '#26483e',
          sky: '#94d9dd',
          'sky-hover': '#a9e2e5',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        'coastal-display': ['"Bricolage Grotesque"', 'sans-serif'],
        'coastal-body': ['"Schibsted Grotesk"', 'system-ui', 'sans-serif'],
        'coastal-mono': ['"Spline Sans Mono"', 'monospace'],
      },
      letterSpacing: {
        widest: '.2em',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.35', transform: 'scale(.82)' },
        },
        growBar: {
          from: { width: '0' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        growBar: 'growBar 1.2s cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
} satisfies Config
