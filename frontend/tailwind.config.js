export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
        certificate: ["Times New Roman", "serif"]
      },
      colors: {
        navy: "#06142f",
        ink: "#0b1f44",
        royal: "#1263ff",
        cyan: "#12c8ff",
        gold: "#d6a233"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(18, 99, 255, 0.28)"
      }
    }
  },
  plugins: []
};
