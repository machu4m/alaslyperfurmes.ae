# Database

Postgres schema, designed for [Supabase](https://supabase.com). Files live in `/supabase`:

- `schema.sql` — tables, enums, indexes, RLS policies
- `seed.sql` — 3 sample bilingual products + collections + 3 journal posts, for local dev

## Setting up

1. Create a Supabase project.
2. In the SQL editor, run `schema.sql`, then `seed.sql` (optional, dev only).
3. Copy your project URL and keys into `.env.local` (see `.env.example`).
4. Create a public storage bucket named `product-images` if you want to upload
   real photography through Supabase Storage instead of `/public/images`.

## Entity overview

products (1) ──< product_variants (size / price / stock — what's actually sold)
products (1) ──< product_notes (top / middle / base scent notes)
products (1) ──< product_images
products (M) ──< product_scent_families >── (M) scent_families (oud, floral, fresh, oriental, ...)
products (M) ──< product_collections >── (M) collections (Bestsellers, Limited Edition, ...)
journal_posts (M) ──< journal_post_scent_families >── (M) scent_families

orders (1) ──< order_items >── products / product_variants (snapshotted)

### Why variants are separate from products

A "product" is the fragrance (Oud Al Malaki). A "variant" is a specific
sellable size (50ml / 100ml), each with its own SKU, price, and stock count.
The shop grid, filters, and cards operate on `products`; the size selector,
cart, and inventory decrement operate on `product_variants`. This is what
lets `price` in the filter UI mean "starting from the cheapest variant" while
the product page still lets someone pick a specific size/price.

### Bilingual fields

Every user-facing text column is duplicated with `_en` / `_ar` suffixes
(`name_en` / `name_ar`, `description_en` / `description_ar`, etc.) rather than
using a separate translations table. For a single-brand catalog with two
fixed locales, this keeps queries simple (no joins to fetch a product) at the
cost of a bit of column duplication — worth it here. If a third language is
ever added, switch to a `product_translations(product_id, locale, ...)` table.

### Scent families vs. collections

- **`scent_families`** is the shop filter facet (oud / floral / fresh /
  oriental / ...). A product can belong to more than one (a perfume can be
  "oud" and "oriental"), with `is_primary` marking the main one for display.
- **`collections`** is editorial grouping (Bestsellers, Signature Collection,
  Limited Edition) — used for the homepage carousel and marketing pages, not
  the filter sidebar.

### Row Level Security

Catalog tables (`products`, `product_variants`, `product_notes`,
`product_images`, `scent_families`, `collections`, `journal_posts`) have RLS
enabled with a public `select` policy restricted to active/published rows.

`orders` and `order_items` have RLS enabled with **no** policies at all —
they're only writable through the Next.js API routes using the Supabase
`service_role` key (server-side only, never exposed to the browser), so
anonymous clients can neither read nor write orders directly.

### Stock

`product_variants.stock_quantity` is decremented server-side when an order's
payment is confirmed (Stripe webhook) or immediately on order creation for
Cash on Delivery. See `src/app/api/checkout/route.ts` and
`src/app/api/webhooks/stripe/route.ts`.

### Batch codes (authenticity)

`product_variants.batch_code` records the authorized-dealer batch a SKU's
current stock came from — printed on the box/bottle by the manufacturer.
It's nullable: not every SKU has it on file yet, and the Authenticity page's
WhatsApp CTA is the fallback for anything without one.

At checkout, the batch code is copied onto `order_items.batch_code` — a
snapshot, same reasoning as the `product_name_en`/`product_name_ar` columns
next to it, so a customer's order confirmation keeps showing the batch they
actually received even if the variant's `batch_code` changes later (new
stock in, different batch). `GET /api/orders/[orderNumber]` (used by the
checkout success page) reads from this snapshot, not from `product_variants`.

This models **one batch in stock at a time per variant**. If you ever need
to hold two batches of the same SKU simultaneously (old stock not yet sold
through when new stock arrives), move `batch_code` out to its own
`batches(id, variant_id, code, quantity, received_at)` table and decrement
against a specific batch row instead of the variant directly.

### Journal (long-form SEO content)

`journal_posts` carries the same three patterns as `products`:

- **Bilingual fields** (`title_en`/`title_ar`, etc.) — `content_en`/`content_ar`
  are **Markdown**, not plain text (rendered by
  `src/components/journal/markdown-content.tsx`), so a "Best Oud Perfumes in
  Dubai 2026" listicle or a comparison guide can actually use headings,
  lists, and tables instead of one unformatted paragraph.
- **SEO overrides** — `meta_title_en`/`meta_title_ar`/`meta_description_en`/
  `meta_description_ar`, same fallback-to-generated-copy pattern as
  `products.meta_title_en` (see `docs/SEO.md`).
- **Featured image** — `cover_image_url` plus bilingual alt text
  (`cover_image_alt_en`/`cover_image_alt_ar`), shown on both the journal
  index and the post page.

`journal_post_scent_families` (many-to-many, same shape as
`product_scent_families` minus `is_primary`) is what drives **internal
linking to product pages by scent family**: tag a post `oud` and
`getProductsByScentFamilies()` (`src/lib/queries.ts`) pulls every current
Oud product into a "Shop Oud Perfumes" block at the end of the post
(`src/components/journal/shop-scent-families.tsx`) — the link list is
generated from live catalog data, so it can't go stale as products are
added, removed, or restocked. Posts can also link to *specific* products or
pages inline within the Markdown body itself — see the seed posts for
examples of both.

Markdown links written as relative paths without a locale prefix (e.g.
`[Oud Al Malaki](/product/oud-al-malaki)`) get `/en` or `/ar` prepended
automatically at render time, matching whichever locale the post is being
read in — so the `content_en` and `content_ar` copies of a post never need
separately-prefixed links.
