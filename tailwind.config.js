/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--ctp-base)',
        base2: 'var(--ctp-base2)',
        mantle: 'var(--ctp-mantle)',
        crust: 'var(--ctp-crust)',
        text: 'var(--ctp-text)',
        subtext: 'var(--ctp-subtext)',
        surface: 'var(--ctp-surface)',
        border: 'var(--ctp-border)',
        accent: 'var(--ctp-accent)'
      }
    }
  },
  plugins: []
};
