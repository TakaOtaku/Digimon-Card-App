module.exports = {
  mode: 'jit',
  important: true,
  content: [
    './src/**/*.{html,ts,scss,css}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      // Design tokens live as CSS variables in src/styles.scss
      colors: {
        ink: { 0: 'var(--dc-ink-0)', 1: 'var(--dc-ink-1)', 2: 'var(--dc-ink-2)' },
        line: 'var(--dc-line)',
        fg: 'var(--dc-fg)',
        muted: 'var(--dc-muted)',
        accent: { DEFAULT: 'var(--dc-accent)', strong: 'var(--dc-accent-strong)', ink: 'var(--dc-accent-ink)' },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
      backgroundImage: {
        digimon: "url('/assets/images/bg_corner.png')",
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  //plugins: [require('tw-elements')],
};
