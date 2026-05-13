/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50:  '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d6',
          300: '#f4a8b3',
          400: '#ed7588',
          500: '#e2455e',
          600: '#ce2645',
          700: '#ad1b38',
          800: '#8B1A2E',
          900: '#7a1a2e',
          950: '#430a15',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#C9A84C',
          600: '#b8922a',
          700: '#9a7520',
          800: '#7d5f1e',
          900: '#6b4f1c',
        },
        cream: {
          50:  '#FDFAF3',
          100: '#F9F3E3',
          200: '#F2E8CC',
          300: '#E8D9AC',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
      },
      backgroundImage: {
        'paisley': "url('/paisley-bg.svg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
