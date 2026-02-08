/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ktransport: {
          50: '#fefdf8',
          100: '#fdfbf0',
          200: '#fbf5dd',
          300: '#f8ecbf',
          400: '#f4da7d',
          500: '#ecc23f',
          600: '#d8a40a',
          700: '#b37a06',
          800: '#94600a',
          900: '#7a4f0c',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
