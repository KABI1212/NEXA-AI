export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0f4fd8", dark: "#0a3aa0", light: "#e6f1fb" },
        accent: { DEFAULT: "#d4a017", light: "#faeeda" },
        navy: { DEFAULT: "#07152f", light: "#0d2045" },
        gold: "#d4a017",
      },
      fontFamily: {
        serif: ['"Times New Roman"', "Times", "serif"],
        sans: ['"Times New Roman"', "Times", "serif"],
        mono: ['"Times New Roman"', "Times", "serif"],
      },
    },
  },
  plugins: [],
};
