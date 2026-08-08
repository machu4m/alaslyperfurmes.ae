import type { MetadataRoute } from "next";
import { getProducts, getJournalPosts } from "@/lib/queries";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import type { Locale } from "@/lib/types";

interface StaticPage {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}

const STATIC_PAGES: StaticPage[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/story", changeFrequency: "monthly", priority: 0.5 },
  { path: "/authenticity", changeFrequency: "monthly", priority: 0.5 },
  { path: "/journal", changeFrequency: "weekly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.3 },
];

/**
 * One <url> entry per locale for a given path, each carrying the full set of
 * hreflang alternates (including itself, per Google's guidance, and
 * x-default) — this is what makes /en/... and /ar/... versions of the same
 * page mutually discoverable from the sitemap, on top of the per-page
 * <link rel="alternate"> tags set via buildAlternates() in each page's
 * generateMetadata.
 */
function entriesFor(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);

  return routing.locales.map((locale) => ({
    url: absoluteUrl(locale as Locale, path),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Degrade to the static pages only if the database is briefly unreachable
  // — a transient outage shouldn't 500 the whole sitemap for crawlers.
  const [products, posts] = await Promise.all([
    getProducts({}).catch(() => []),
    getJournalPosts().catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    entries.push(...entriesFor(page.path, page.changeFrequency, page.priority));
  }

  for (const product of products) {
    entries.push(...entriesFor(`/product/${product.slug}`, "weekly", 0.8));
  }

  for (const post of posts) {
    entries.push(...entriesFor(`/journal/${post.slug}`, "monthly", 0.4));
  }

  return entries;
}
