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
        primary: {
          DEFAULT: '#0A7E72',
          50: '#E8F5F3',
          100: '#D1EBE8',
          200: '#A3D7D1',
          300: '#5CBFB5',
          400: '#0F9E90',
          500: '#0A7E72',
          600: '#086B62',
          700: '#065850',
          800: '#04453F',
          900: '#02322E',
        },
        accent: {
          DEFAULT: '#E8705A',
          50: '#FDF2EF',
          100: '#FADDDD',
          200: '#F5B8AD',
          300: '#F09480',
          400: '#E8705A',
          500: '#D4533B',
          600: '#B03E2B',
          700: '#8F3C2E',
        },
        cream: {
          DEFAULT: '#FAF8F5',
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F3EFE9',
          300: '#E8E2D9',
        },
        'brand-cream': '#FAF8F5',
        'brand-dark': '#1C1917',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        tight: '-0.015em',
        snug: '-0.01em',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'orbital-rotation': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'orbital-rotation': 'orbital-rotation 20s linear infinite',
        'pulse-scale': 'pulse-scale 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
