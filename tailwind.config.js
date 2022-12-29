/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'outline': '0 0 0 2px #e65768',
      }
    },
  },
  plugins: [],
}