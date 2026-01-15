/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#F5F7FA',
        'black-piece': '#2D3748',
        'white-piece': '#F7FAFC',
        'board-line': '#CBD5E0',
        'highlight': '#4299E1',
        'secondary-bg': '#E2E8F0',
        'text-primary': '#2D3748',
        'text-secondary': '#718096'
      }
    },
  },
  plugins: [],
}
