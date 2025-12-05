/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Sidebar colors
        sidebar: {
          bg: '#0a3d0a',
          hover: '#0d4f0d',
          active: '#116611',
          text: '#ffffff',
          muted: '#a3d9a5',
        },
        // Background colors
        background: {
          main: '#f8fafc',
          dark: '#1e293b',
          darker: '#0f172a',
          card: '#ffffff',
        },
        // Status colors
        status: {
          critical: '#dc2626',
          high: '#ea580c',
          medium: '#f59e0b',
          low: '#3b82f6',
          success: '#10b981',
          active: '#6366f1',
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 8px 24px rgba(15, 23, 42, 0.12)',
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        'sidebar': '256px',
        'header': '64px',
      },
    },
  },
  plugins: [],
}
