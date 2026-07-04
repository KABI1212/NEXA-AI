export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563EB", dark: "#1D4ED8", light: "#DBEAFE" },
        accent: { DEFAULT: "#14B8A6", light: "#CCFBF1" },
        navy: { DEFAULT: "#0F172A", light: "#1E293B" },
        sky: "#38BDF8",
        gold: "#D4A017",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};