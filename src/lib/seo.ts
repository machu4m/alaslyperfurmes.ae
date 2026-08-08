import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

export { SITE_URL };

/** Absolute URL for a locale + path (path must start with "/", or be "" for home). */
export function absoluteUrl(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}/${locale}${clean}`;
}

/**
 * `alternates` for a localized page: a self-referencing canonical plus
 * hreflang entries for every locale (including the current one — Google
 * expects each language version to list itself too) and an `x-default`
 * pointing at the default locale. Apply this on every indexable page so
 * `<link rel="alternate" hreflang="...">` tags are correct in both directions
 * between /en/... and /ar/... versions of the same URL.
 */
export function buildAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absoluteUrl(l, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}

// Universal fragrance concentration abbreviations — recognized in both EN
// and AR-market listings (Gulf ecommerce commonly mixes the Latin
// abbreviation into Arabic copy), so the same map serves both locales.
const CONCENTRATION_ABBREVIATIONS: Record<string, string> = {
  "Eau de Parfum": "EDP",
  "Eau de Toilette": "EDT",
  "Eau de Cologne": "EDC",
  "Extrait de Parfum": "Extrait",
  Parfum: "Parfum",
};

export function abbreviateConcentration(concentration: string | null): string | null {
  if (!concentration) return null;
  return CONCENTRATION_ABBREVIATIONS[concentration] ?? concentration;
}

/** Trim to a meta-description-friendly length, cutting at a word boundary. */
export function truncateForMeta(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 0 ? lastSpace : sliced.length)}…`;
}

/** "[Perfume Name] Price in Dubai | Authentic Al Asly UAE" pattern (+ AR equivalent). */
export function buildProductTitle(locale: Locale, name: string): string {
  return locale === "ar"
    ? `سعر ${name} في دبي | الأصلي عطور أصلية الإمارات`
    : `${name} Price in Dubai | Authentic Al Asly UAE`;
}

/**
 * Unique per-product meta description — always names the brand, the
 * concentration (EDP/EDT/Extrait), "authentic", and Dubai/UAE, then folds in
 * the product's own short description so no two products end up with an
 * identical templated description. Callers should prefer a product's
 * `meta_description_en`/`meta_description_ar` override when one is set;
 * this is the fallback template.
 */
export function buildProductDescription(
  locale: Locale,
  params: {
    name: string;
    /** Always pass the English concentration value (e.g. "Eau de Parfum") — the abbreviation is locale-independent. */
    concentration: string | null;
    shortDescription: string | null;
  }
): string {
  const { name, concentration, shortDescription } = params;
  const conc = abbreviateConcentration(concentration);

  const prefix =
    locale === "ar"
      ? `${name}${conc ? ` (${conc})` : ""} — عطر أصلي ١٠٠٪ من الأصلي، مصدره مباشر من موزعين معتمدين في دبي، الإمارات.`
      : `${name}${conc ? ` (${conc})` : ""} — 100% authentic Al Asly perfume, sourced directly from authorized dealers in Dubai, UAE.`;

  const full = shortDescription ? `${prefix} ${shortDescription}` : prefix;
  return truncateForMeta(full, 160);
}
