import { logoShapes, type LogoShapeName } from "./logo-paths";

export type LogoVariant = LogoShapeName;

/** Minimum rendered size, in px, below which each lockup stops resolving.
 *  See docs/BRAND.md §3.6. `mark`/`markSolid`/`seal` are measured on the
 *  short edge that matters; the lockups are measured on width. */
const MINIMUM: Record<LogoVariant, { axis: "width" | "height"; px: number }> = {
  vertical: { axis: "width", px: 96 },
  horizontal: { axis: "width", px: 120 },
  bilingual: { axis: "width", px: 120 },
  wordmark: { axis: "width", px: 90 },
  wordmarkAr: { axis: "width", px: 56 },
  mark: { axis: "height", px: 24 },
  markSolid: { axis: "height", px: 12 },
  seal: { axis: "width", px: 64 },
};

export type LogoProps = {
  /** Which lockup. Defaults to the primary vertical one. */
  variant?: LogoVariant;
  /** Rendered width in px. Height follows the lockup's own ratio. */
  width?: number;
  /** Rendered height in px. Width follows. Use for `mark` and `seal`. */
  height?: number;
  /** Accessible name. Pass `""` for a decorative logo sitting next to live
   *  text that already names the brand. */
  title?: string;
  className?: string;
};

/**
 * The Al Asly logo, inlined so it paints with `currentColor` and costs no
 * request. Colour it with a text colour — `text-gold-500` on dark,
 * `text-onyx-900` on light. Never recolour it outside gold, onyx and ivory
 * (docs/BRAND.md §3.7).
 *
 * The path data is generated from tools/brand_geometry.py, so the markup
 * below is build output rather than anything that comes in at runtime.
 */
export function Logo({
  variant = "vertical",
  width,
  height,
  title = "Al Asly",
  className,
}: LogoProps) {
  const shape = logoShapes[variant];
  const { ratio } = shape;

  let w = width;
  let h = height;
  if (w === undefined && h === undefined) {
    const min = MINIMUM[variant];
    if (min.axis === "width") w = min.px;
    else h = min.px;
  }
  if (w === undefined && h !== undefined) w = h / ratio;
  if (h === undefined && w !== undefined) h = w * ratio;

  const decorative = title === "";

  return (
    <svg
      viewBox={shape.viewBox}
      width={w}
      height={h}
      className={className}
      fill="currentColor"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      dangerouslySetInnerHTML={{ __html: shape.body }}
    />
  );
}

/** The mark alone, sized by height — the form used in avatars, badges and
 *  anywhere the wordmark already appears elsewhere on the surface. */
export function LogoMark({
  size = 28,
  ...props
}: Omit<LogoProps, "variant" | "width" | "height"> & { size?: number }) {
  return <Logo variant={size < 24 ? "markSolid" : "mark"} height={size} {...props} />;
}
