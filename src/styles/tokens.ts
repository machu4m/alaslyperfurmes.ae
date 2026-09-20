/**
 * Al Asly — design tokens.
 *
 * The single source of truth for the brand's colour, type, space, radius,
 * elevation and motion. `tailwind.config.ts` builds the theme from this file
 * and also emits every value as a CSS custom property (`--asly-*`), so code
 * outside Tailwind reads the same numbers. Change a value here and it moves
 * everywhere.
 *
 * Reference: docs/BRAND.md
 */

/** The ground the brand stands on. Warm-neutral, never blue-black.
 *  `onyx.850` is the exact black of the logo artwork. */
export const onyx = {
  50: "#f7f3ea",
  100: "#e7e3da",
  200: "#ccc7bd",
  300: "#a6a197",
  400: "#7b766c",
  500: "#57534b",
  600: "#3d3a35",
  700: "#2b2926",
  800: "#1f1e1c",
  850: "#171717",
  900: "#111111",
  950: "#0b0b0b",
} as const;

/** `gold.500` is the exact gold of the logo artwork. It is a light on a dark
 *  ground, not an ink on a light one: 11.5:1 on onyx-850, 1.4:1 on sand-50.
 *  For gold type on a light ground use `gold.800` (4.9:1). */
export const gold = {
  50: "#fefcf5",
  100: "#fdf7e6",
  200: "#fbefc8",
  300: "#f9e5a5",
  400: "#f6d97d",
  500: "#f2cb58",
  600: "#d3a63b",
  700: "#ae8427",
  800: "#86651c",
  900: "#5e4712",
} as const;

/** The quiet middle of the palette: paper, packaging, dividers. */
export const sand = {
  50: "#fbf8f1",
  100: "#f4eee0",
  200: "#e9dec4",
  300: "#dccb9f",
  400: "#cbb379",
  500: "#b79a58",
  600: "#977c42",
  700: "#756033",
  800: "#4e4023",
  900: "#2a2315",
} as const;

/** One accent, used sparingly: state, emphasis, the occasional seal. */
export const oud = {
  300: "#c0737c",
  400: "#9a414c",
  500: "#752632",
  600: "#571b24",
  700: "#3c1219",
} as const;

/** `ink` is the reading scale — the onyx ramp under the name the product
 *  code already uses for type and rules. */
export const ink = {
  50: onyx[50],
  100: onyx[100],
  200: onyx[200],
  400: onyx[400],
  500: onyx[500],
  600: onyx[600],
  700: onyx[700],
  800: onyx[800],
  900: onyx[900],
} as const;

export const palette = { onyx, gold, sand, oud, ink } as const;

/** A 1.200 scale from 16px, with three display steps above it.
 *  Each step carries the line-height it was drawn for. */
export const fontSize = {
  "2xs": ["0.6875rem", { lineHeight: "1.45" }],
  xs: ["0.75rem", { lineHeight: "1.5" }],
  sm: ["0.875rem", { lineHeight: "1.55" }],
  base: ["1rem", { lineHeight: "1.65" }],
  lg: ["1.125rem", { lineHeight: "1.6" }],
  xl: ["1.375rem", { lineHeight: "1.4" }],
  "2xl": ["1.625rem", { lineHeight: "1.3" }],
  "3xl": ["2rem", { lineHeight: "1.2" }],
  "4xl": ["2.5rem", { lineHeight: "1.14" }],
  "5xl": ["3.25rem", { lineHeight: "1.08" }],
  "6xl": ["4.25rem", { lineHeight: "1.04" }],
} as const;

/** 0.33em is the logotype's own letterspacing — reserve `logotype` for the
 *  brand line and nothing else. */
export const letterSpacing = {
  display: "-0.015em",
  normal: "0em",
  caps: "0.14em",
  eyebrow: "0.26em",
  logotype: "0.33em",
  /** @deprecated kept so existing `tracking-widest2` markup keeps working */
  widest2: "0.25em",
} as const;

/** 4px base. Section rhythm is 64 / 96 / 128. */
export const spacing = {
  section: "4rem",
  "section-lg": "6rem",
  "section-xl": "8rem",
} as const;

/** Taken from the mark: its body's corner is 6/56 of its width, so the
 *  brand's corner is tight. Nothing is rounder than 14px except a pill. */
export const borderRadius = {
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "14px",
  pill: "999px",
} as const;

/** On sand, warm shadow. On onyx, light — a gold rim, never a shadow. */
export const boxShadow = {
  sm: "0 1px 2px rgb(42 35 21 / 0.06), 0 1px 1px rgb(42 35 21 / 0.04)",
  md: "0 4px 16px -4px rgb(42 35 21 / 0.10), 0 2px 6px -2px rgb(42 35 21 / 0.06)",
  lg: "0 18px 48px -16px rgb(42 35 21 / 0.18), 0 6px 16px -8px rgb(42 35 21 / 0.08)",
  gilt: "0 0 0 1px rgb(242 203 88 / 0.22), 0 12px 40px -18px rgb(242 203 88 / 0.50)",
} as const;

/** Nothing bounces. Things arrive and settle. */
export const motion = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  fast: "160ms",
  base: "240ms",
  slow: "420ms",
} as const;

/** The foil used on the logo's gilded variant, and on display type that
 *  should read as metal rather than paint. */
export const gilt =
  "linear-gradient(140deg, #f7dc85 0%, #f2cb58 38%, #ffeeb4 52%, #f2cb58 62%, #d8a93c 100%)";

/** Flattened `--asly-*` custom properties, emitted on :root by the Tailwind
 *  plugin so non-Tailwind CSS reads the same values. */
export function cssVariables(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [name, ramp] of Object.entries({ onyx, gold, sand, oud })) {
    for (const [step, value] of Object.entries(ramp)) {
      vars[`--asly-${name}-${step}`] = value;
    }
  }
  for (const [step, value] of Object.entries(borderRadius)) {
    vars[`--asly-radius-${step}`] = value;
  }
  for (const [step, value] of Object.entries(boxShadow)) {
    vars[`--asly-shadow-${step}`] = value;
  }
  for (const [step, value] of Object.entries(letterSpacing)) {
    vars[`--asly-tracking-${step}`] = value;
  }
  Object.assign(vars, {
    "--asly-ease": motion.ease,
    "--asly-ease-in-out": motion.easeInOut,
    "--asly-duration-fast": motion.fast,
    "--asly-duration": motion.base,
    "--asly-duration-slow": motion.slow,
    "--asly-gilt": gilt,

    // Semantic tokens — reach for these in product code, not the ramps.
    "--asly-ground": sand[50],
    "--asly-ground-raised": "#ffffff",
    "--asly-ground-inverse": onyx[850],
    "--asly-ink": onyx[900],
    "--asly-ink-muted": "#4a463f", // 8.8:1 on sand-50
    // The quietest type that still has to be read. onyx-400 is 4.1:1 on
    // sand-50 and fails AA, so it stays a decorative grey, not a type colour.
    "--asly-ink-subtle": "#6b665d", // 5.4:1 on sand-50
    "--asly-ink-inverse": sand[50],
    "--asly-ink-inverse-muted": "#bab5ab", // 8.8:1 on onyx-850
    "--asly-ink-inverse-subtle": "#938e84", // 5.5:1 on onyx-850
    "--asly-accent": gold[500], // on dark only
    "--asly-accent-ink": gold[800], // gold as type on light
    "--asly-accent-contrast": onyx[950], // type on a gold fill
    "--asly-line": "rgb(23 23 23 / 0.12)",
    "--asly-line-strong": "rgb(23 23 23 / 0.22)",
    "--asly-line-inverse": "rgb(247 243 234 / 0.14)",
    "--asly-line-gold": "rgb(242 203 88 / 0.38)",
    // Control borders and focus rings carry meaning, so they clear 3:1.
    "--asly-line-control": "#8d887e", // 3.3:1 on sand-50
    "--asly-line-control-inverse": "#726d64", // 3.5:1 on onyx-850
    // gold-600 is only 2.1:1 on sand-50 — too faint for a focus ring on light.
    "--asly-focus": gold[800], // 5.1:1 on sand-50
    "--asly-focus-inverse": gold[500], // 11.5:1 on onyx-850

    "--asly-font-display": 'var(--font-display), "Playfair Display", Georgia, serif',
    "--asly-font-body": 'var(--font-body), "Manrope", ui-sans-serif, system-ui, sans-serif',
    "--asly-font-display-ar": 'var(--font-arabic-display), "Amiri", serif',
    "--asly-font-body-ar": 'var(--font-arabic-body), "Tajawal", ui-sans-serif, sans-serif',
  });
  return vars;
}
