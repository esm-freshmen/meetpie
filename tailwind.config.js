const { brown } = require('@mui/material/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: '#651616',
          10: '#e0d0d0',
        },
        darkBrown: {
          DEFAULT: '#4e3c31',
        },
        red: {
          DEFAULT: '#ca0e0e',
        },
        beige: {
          DEFAULT: '#fff4e5',
        },
      },
    },
  },
  plugins: [],
};
