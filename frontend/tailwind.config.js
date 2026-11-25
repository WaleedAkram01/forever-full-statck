/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        sand: "#F1EBE2",
        ink: "#1F1B16",
        muted: "#6B645C",
        line: "#E6DED3",
        rust: { DEFAULT: "#9A3B1E", dark: "#7E2F17", light: "#F4E4DC" },
        sage: "#6E7B5B",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      letterSpacing: { widest2: "0.2em" },
    },
  },
  plugins: [],
};
