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
          DEFAULT: '#f05a28',
          hover: '#dc4614',
          light: '#fff4f0',
          50: '#fff7f5',
          100: '#ffede5',
          500: '#f05a28',
          600: '#d94816',
          700: '#b5350d',
        },
        esbDark: '#1a1a1a',
        esbGray: {
          light: '#f8f9fa',
          border: '#e5e7eb',
          muted: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'sheet': '0 -8px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
