/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1F4E79',
          dark: '#163a5a',
          deeper: '#0f2a40',
        },
        yellow: {
          DEFAULT: '#FFCC00',
          hover: '#f0c000',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

