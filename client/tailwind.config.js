/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          hover: '#1e3a8a'
        },
        secondary: {
          DEFAULT: '#64748b',
          hover: '#475569'
        },
        success: {
          DEFAULT: '#16a34a',
          hover: '#15803d'
        },
        warning: {
          DEFAULT: '#f59e0b',
          hover: '#d97706'
        },
        danger: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c'
        }
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}