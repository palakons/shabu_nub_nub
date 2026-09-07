/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mk: {
          red: '#d9232a',
          darkred: '#a81319',
          gold: '#f59e0b',
          bg: '#0f0f11',
          card: '#1a1a1e',
          cardHover: '#242429',
          border: '#2e2e35'
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(217, 35, 42, 0.35)',
        'glow-gold': '0 0 15px rgba(245, 158, 11, 0.25)',
      }
    },
  },
  plugins: [],
}
