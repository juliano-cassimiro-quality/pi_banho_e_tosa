/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        ink: {
          950: '#03040a',
          900: '#050611',
          800: '#090b1b',
          700: '#0d1227',
          600: '#111732'
        },
        surface: {
          100: '#12172a',
          200: '#181f36',
          300: '#1f2746',
          400: '#273156'
        },
        accent: {
          300: '#b3a5ff',
          400: '#9c8dff',
          500: '#7c6dff',
          600: '#6657f5',
          700: '#5446d6'
        },
        neutral: {
          100: '#f5f6fb',
          200: '#d8ddef',
          300: '#aeb6d8',
          400: '#7d86b1',
          500: '#4f567e',
          600: '#393f5c'
        },
        success: {
          500: '#3ad9a5',
          600: '#24c48b'
        },
        warning: {
          500: '#f6c454',
          600: '#e0ad3d'
        },
        danger: {
          500: '#ff6b81',
          600: '#f24c67'
        }
      },
      boxShadow: {
        elevated: '0 24px 80px rgba(8, 11, 26, 0.45)',
        card: '0 18px 50px rgba(5, 6, 17, 0.35)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}
