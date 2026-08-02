# Database

Postgres schema, designed for [Supabase](https://supabase.com). Files live in `/supabase`:

- `schema.sql` — tables, enums, indexes, RLS policies
- `seed.sql` — 3 sample bilingual products + collections + a journal post, for local dev

## Setting up

1. Create a Supabase project.
2. In the SQL editor, run `schema.sql`, then `seed.sql` (optional, dev only).
3. Copy your project URL and keys into `.env.local` (see `.env.example`).
4. Create a public storage bucket named `product-images` if you want to upload
   real photography through Supabase Storage instead of `/public/images`.

## Entity overview

```
products (1) ──< product_variants        (size / price / stock — what's actually sold)
products (1) ──< product_notes           (top / middle / base scent notes)
products (1) ──< product_images
products (M) ──< product_scent_families >── (M) scent_families   (oud, floral, fresh, oriental, ...)
products (M) ──< product_collections    >── (M) collections      (Bestsellers, Limited Edition, ...)

orders (1) ──< order_items >── products / product_variants (snapshotted)
```

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
