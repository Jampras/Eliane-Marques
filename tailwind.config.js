/** @type {import(''tailwindcss'').Config} */
const tailwindConfig = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        background: {
          dark: 'var(--color-deep)',
          surface: 'var(--color-surface)',
          soft: 'var(--color-border-soft)',
          overlay: 'color-mix(in srgb, var(--color-deep) 86%, transparent)',
        },
        text: {
          1: 'var(--color-text-1)',
          2: 'var(--color-text-2)',
          muted: 'var(--color-text-muted)',
          primary: 'var(--color-text-1)',
          secondary: 'var(--color-text-2)',
          accent: 'var(--color-accent-warm)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          warm: 'var(--color-accent-warm)',
          soft: 'var(--color-accent-soft)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          soft: 'var(--color-border-soft)',
        },
        state: {
          success: 'var(--color-state-success)',
          error: 'var(--color-state-error)',
          info: 'var(--color-state-info)',
        },
        sage: {
          DEFAULT: 'var(--color-sage)',
          light: 'var(--color-sage)',
        },
        gold: 'var(--color-gold)',
        espresso: 'var(--color-deep)',
        taupe: 'var(--color-text-2)',
        linen: 'var(--color-border)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        ornament: ['var(--font-ornament)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;