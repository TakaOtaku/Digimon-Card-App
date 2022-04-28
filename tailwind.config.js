module.exports = {
  mode: 'jit',
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [],
}
