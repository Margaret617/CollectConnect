/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chama-navy': '#1E3A5F',
        'chama-green': '#2E7D32',
        'chama-orange': '#F57C00',
        'chama-red': '#C62828',
        'chama-bg': '#F5F7FA',
        'chama-text': '#1A1A2E',
        'chama-text-light': '#6B7280',
        'chama-success': '#2E7D32',
        'chama-warning': '#F57C00',
        'chama-danger': '#C62828',
        'chama-info': '#1565C0',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(30, 58, 95, 0.08), 0 1px 2px rgba(30, 58, 95, 0.06)',
        'card-hover': '0 8px 16px rgba(30, 58, 95, 0.12), 0 2px 4px rgba(30, 58, 95, 0.08)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}