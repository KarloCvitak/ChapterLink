/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgb(254,255,212)',
          DEFAULT: '#e5d8d8',
          dark: '#a91111',
        },
        secondary: '#f68383',
        accent: '#F5A623',
      },
      fontFamily: {
        logo: ['Roboto Condensed', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
