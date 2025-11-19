/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006600',
          dark: '#005200',
          light: '#008800',
        },
      },
      boxShadow: {
        'card': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 30px 60px -15px rgba(0, 102, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
