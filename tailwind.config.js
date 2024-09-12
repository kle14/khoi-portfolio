module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        smh: { raw: "(min-height: 760px)" },
        mdh: { raw: "(min-height: 824px)" },
        lgh: { raw: "(min-height: 1024px)" },
        xlh: { raw: "(min-height: 1280px)" },
        "2xlh": { raw: "(min-height: 1536px)" },
        "max-smh": { raw: "(max-height: 745px)" },
        "max-mdh": { raw: "(max-height: 800px)" },
        "max-lgh": { raw: "(max-height: 1024px)" },
        "max-xlh": { raw: "(max-height: 1280px)" },
        "max-2xlh": { raw: "(max-height: 1536px)" },
        "max-ssm": { max: "400px" },
        "max-sm": { raw: "(max-width: 640px)" },
        "max-md": { raw: "(max-width: 768px)" },
        "max-lgw": { max: "1024px" },
        "max-xl": { raw: "(max-width: 1280px)" },
        "max-2xl": { raw: "(max-width: 1536px)" },
      },
      fontFamily: {
        primary: ["Droid Sans", "sans-serif"],
      },
      boxShadow: {
        "custom-inset":
          "inset 0 0 24rem black, inset 0 0 5rem black, 0 0 16rem black",
      },
    },
  },
  plugins: [],
};
