const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        current: "currentColor",
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: colors.neutral,
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({addVariant, e}) {
      addVariant("collapsed", ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
          return `.collapsed .${e(`collapsed${separator}${className}`)}`;
        });
      });
      addVariant("rtl", ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
          return `.rtl .${e(`rtl${separator}${className}`)}`;
        });
      });
    }),
  ],
};
