import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#faf7f2",
          100: "#f2ebe0",
          200: "#e4d5bc",
          300: "#d3b98e",
          400: "#c19c63",
          500: "#af8548",
          600: "#8f6a3a",
          700: "#6f5230",
          800: "#4a3720",
          900: "#2b2013",
        },
        ink: {
          50: "#f6f5f3",
          100: "#e7e4de",
          400: "#6b6459",
          700: "#332c22",
          900: "#161310",
        },
        oud: {
          500: "#7a1f2b",
          600: "#5e1720",
          700: "#421017",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
        arabicDisplay: ["var(--font-arabic-display)", "serif"],
        arabicBody: ["var(--font-arabic-body)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
