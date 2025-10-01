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
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        }
      }
    }
  },
  plugins: []
}
