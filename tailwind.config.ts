import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import {
  borderRadius,
  boxShadow,
  cssVariables,
  fontSize,
  letterSpacing,
  motion,
  palette,
  spacing,
} from "./src/styles/tokens";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        arabicDisplay: ["var(--font-arabic-display)", "serif"],
        arabicBody: ["var(--font-arabic-body)", "ui-sans-serif", "sans-serif"],
      },
      fontSize: fontSize as unknown as Record<string, [string, { lineHeight: string }]>,
      letterSpacing,
      spacing,
      borderRadius,
      boxShadow,
      transitionTimingFunction: { brand: motion.ease, "brand-in-out": motion.easeInOut },
      transitionDuration: { fast: motion.fast, DEFAULT: motion.base, slow: motion.slow },
      backgroundImage: { gilt: "var(--asly-gilt)" },
    },
  },
  plugins: [
    // Emit every token as a CSS custom property so non-Tailwind CSS,
    // inline styles and the brand kit all read the same values.
    plugin(({ addBase }) => {
      addBase({ ":root": cssVariables() });
    }),
  ],
};

export default config;
