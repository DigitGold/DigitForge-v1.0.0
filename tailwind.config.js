/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9eb',
          100: '#ffefc7',
          200: '#ffd98a',
          300: '#ffbf4d',
          400: '#ffa524',
          500: '#f98009',
          600: '#dd5d02',
          700: '#b74105',
          800: '#94330c',
          900: '#7a2b0c',
          950: '#461402',
        },
        secondary: {
          50: '#fdfbed',
          100: '#fbf5d1',
          200: '#f7e9a5',
          300: '#f2d76f',
          400: '#edc041',
          500: '#e4a21e',
          600: '#cd7f15',
          700: '#aa5e15',
          800: '#8b4a17',
          900: '#733d16',
          950: '#421f09',
        },
        accent: {
          50: '#fefbe8',
          100: '#fff7c2',
          200: '#ffea89',
          300: '#ffd649',
          400: '#ffc21f',
          500: '#ffa006',
          600: '#e27c02',
          700: '#bb5802',
          800: '#984308',
          900: '#7c380b',
          950: '#481c04',
        },
        forge: {
          dark: '#121212',
          medium: '#1e1e1e',
          light: '#2a2a2a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};