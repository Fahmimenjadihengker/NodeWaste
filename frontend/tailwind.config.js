/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f1f8e9',
          100: '#dff0ca',
          500: '#4f9f45',
          600: '#347a37',
          900: '#173f26',
        },
        cream: '#fff8e8',
        moss: '#203a25',
        honey: '#f5b84b',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(79, 159, 69, 0.28)',
      },
      fontFamily: {
        sans: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
