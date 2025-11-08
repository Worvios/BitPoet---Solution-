/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  './locales/**/*.json'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'accent-1': 'var(--accent-1)',
        'accent-2': 'var(--accent-2)'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
