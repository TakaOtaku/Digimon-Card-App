module.exports = {
  mode: "jit",
  important: true,
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
};
