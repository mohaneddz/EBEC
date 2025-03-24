// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'; // Correct import, only once

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        shake: 'shake 0.5s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        show: {  // Added missing animation for 'show' keyframes
          '0%, 49.99%': {
            opacity: 0,
            zIndex: 10, // Corrected: z-index should be a property, not a string
          },
          '50%, 100%': {
            opacity: 1,
            zIndex: 30, // Corrected: z-index should be a property, not a string
          },
        },
      },
      colors: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'primary-light': '#1b2755',
        'primary-dark': '#0a1029',
        'secondary-light': '#FFC208',
        'secondary-dark': '#FDA916',
        'bg': '#eef1f6',
        'bg-darker': '#d1d5db',

        primary: {
          50: '#eff8ff',
          100: '#dbeffe',
          200: '#bfe5fe',
          300: '#93d5fd',
          400: '#5fbdfb',
          500: '#3a9ff7',
          600: '#2482ec',
          700: '#1c6bd9',
          800: '#1d57b0',
          900: '#1e4b8a',
          950: '#1b3764',
        },
        secondary: {
          50: '#fffdf0',
          100: '#fff8dc',
          200: '#ffefbb',
          300: '#ffe4a1',
          400: '#ffd485',
          500: '#ffb74d',
          600: '#ff9800',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
          950: '#bf360c',
        },
      },
      screens: {
        vsm: '320px',
        vlg: '1440px',
        msm: '480px',
        mlg: '1024px',
        huge: '1600px',
      },
    },
  },
  plugins: [
    addVariablesForColors,
  ],
};