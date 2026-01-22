/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'amhara-blue': '#0033A1',
        'amhara-yellow': '#FFD200',
      },
    },
  },
  plugins: [],
}