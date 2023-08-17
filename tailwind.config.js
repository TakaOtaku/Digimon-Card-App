module.exports = {
  mode: 'jit',
  important: true,
  content: [
    './src/**/*.{html,ts}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
};
