// mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Apontando para SRC
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        violet: { 700: '#6D28D9' }, // Nossa cor primária
        rose: { 500: '#F43F5E' },   // Nossa cor secundária
      }
    },
  },
  plugins: [],
}