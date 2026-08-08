# SEO

## Product page titles & descriptions

Every product page (`src/app/[locale]/product/[slug]/page.tsx`) generates:

- **Title**: `{Name} Price in Dubai | Authentic Al Asly UAE` (EN) /
  `سعر {الاسم} في دبي | الأصلي عطور أصلية الإمارات` (AR)
- **Description**: names the brand, the concentration (EDP/EDT/Extrait —
  abbreviated via `abbreviateConcentration()` in `src/lib/seo.ts`),
  "authentic", and Dubai/UAE, then appends the product's own
  `short_description` so no two products share an identical templated
  description. Trimmed to ~160 characters at a word boundary
  (`truncateForMeta()`).

Both come from `src/lib/seo.ts` (`buildProductTitle`, `buildProductDescription`).

**Per-product overrides**: `products.meta_title_en` / `meta_title_ar` /
`meta_description_en` / `meta_description_ar` (already in `schema.sql`) win
over the generated template whenever they're set — use these for a product
that needs hand-tuned copy (a specific long-tail phrase, a promo, etc.)
without touching code. See `oud-al-malaki` in `seed.sql` for a worked
example; every other seed product falls through to the template.

## Sitemap & robots

- `src/app/sitemap.ts` → `/sitemap.xml`. Includes every static content page
  (home, shop, story, authenticity, journal index, contact), every active
  product, and every published journal post — each as **one `<url>` entry
  per locale**, so `/sitemap.xml` has both the `/en/...` and `/ar/...`
  version of every URL, not just products (the sitemap covers more than the
  minimum "product URLs" ask, since a real sitemap should list everything
  indexable).
- `src/app/robots.ts` → `/robots.txt`. Allows everything except `/api/*` and
  `/*/cart`, `/*/checkout` (transactional pages with no SEO value and no two
  visitors see the same content there — see "What's intentionally not
  covered" below). Points crawlers at the sitemap.
- Both read products/posts straight from Supabase via the same
  `getProducts()` / `getJournalPosts()` used by the pages themselves, so the
  sitemap can't drift out of sync with what's actually live.

## Hreflang

Every indexable page's `generateMetadata` sets `alternates` via
`buildAlternates(locale, path)` in `src/lib/seo.ts`, which produces:

- `canonical`: the current locale's own URL (self-referencing, as required)
- `languages`: `{ en: ..., ar: ..., "x-default": <en URL> }` — **every**
  locale is listed, including the current one, per Google's hreflang
  guidance (a language version's alternates must include itself).

This is set on: home, shop, product detail, story, authenticity, journal
index, journal post, and contact. The sitemap additionally repeats the same
alternates per URL entry (`alternates.languages` on each sitemap `<url>`),
which is the redundant-but-recommended belt-and-suspenders pattern — crawlers
can pick the hreflang signal up from either the page `<head>` or the sitemap.

Because `routing.localePrefix` is `"always"` (`/en/...`, `/ar/...`, no
prefix-less default), every page's path is unambiguous and
`buildAlternates` never has to guess which locale a bare path belongs to.

## What's intentionally not covered

`/cart`, `/checkout`, and `/checkout/success` don't have `generateMetadata`
or hreflang — they're Client Components (`"use client"` at the top level),
and Next.js only allows the `metadata`/`generateMetadata` export from a
Server Component. Giving them real metadata would mean splitting each into a
thin Server Component wrapper plus a client child (the same pattern
`checkout/success` already uses for its `Suspense` boundary), which felt out
of scope for this pass. Instead, `robots.ts` disallows them outright — the
pragmatic fix, since these pages are single-visitor, constantly-changing,
and have zero search value anyway. If you want them indexable/shareable
later (e.g. a "view your order" link), do the Server/Client split and add
`generateMetadata` with `robots: { index: false }` explicitly rather than
relying on `robots.txt` alone (robots.txt keeps crawlers from *visiting*, but
a `noindex` meta tag is the correct way to keep an already-linked URL out of
the index).
