module.exports = {
  mode: 'jit',
  important: true,
  content: [
    './src/**/*.{html,ts,scss,css}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
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
