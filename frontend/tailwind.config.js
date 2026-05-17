/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C3AE8',
        'primary-dark': '#5429D4',
      },
    },
  },
  plugins: [],
}