/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.js'],
  safelist: [
    'max-w-[1440px]',
    'max-w-[300px]',
    'lg:max-w-[1440px]',
    'sm:max-w-none',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#00bcf0',
        brand: {
          yellow: '#ffe556',
          cyan:   '#00bcf0',
          dark:   '#303539',
          red:    '#c8412d',
          light:  '#e1ebed',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
