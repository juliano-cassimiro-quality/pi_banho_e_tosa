/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f7ff',
          100: '#e0ecff',
          200: '#bcd5ff',
          300: '#8ab8ff',
          400: '#5592ff',
          500: '#2f6dff',
          600: '#1d4fe6',
          700: '#163bb4',
          800: '#122c84',
          900: '#101f5c'
        }
      }
    }
  },
  plugins: []
}
