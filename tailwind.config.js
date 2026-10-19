/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dota: {
          dark: '#0b0e14',
          panel: '#121721',
          card: '#18202d',
          border: '#243042',
          hover: '#1e2838',
          radiant: '#10b981',
          'radiant-glow': 'rgba(16, 185, 129, 0.25)',
          dire: '#ef4444',
          'dire-glow': 'rgba(239, 68, 68, 0.25)',
          gold: '#f59e0b',
          str: '#ef4444',
          agi: '#22c55e',
          int: '#0ea5e9',
          uni: '#a855f7',
        },
      },
    },
  },
  plugins: [],
}
