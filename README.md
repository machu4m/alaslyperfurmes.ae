# Alasly | الأصلي

Bilingual (Arabic/English) ecommerce + brand website for Alasly, a perfume
brand targeting the GCC/Middle East market. Next.js (App Router) storefront
with a Supabase/Postgres product catalog, Stripe + Cash on Delivery
checkout, and full RTL support.

## Tech stack

- **Framework**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **i18n/RTL**: [next-intl](https://next-intl.dev) with locale-prefixed routing (`/en/...`, `/ar/...`)
- **Database**: Supabase (Postgres) — see `supabase/schema.sql`
- **Payments**: Stripe Checkout (card) + Cash on Delivery
- **Hosting**: Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Stripe + WhatsApp values
npm run dev
```

Then set up the database:

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`
   (seed is optional — it adds 3 sample bilingual products for local dev).
3. Copy the project URL + keys into `.env.local`.

See `docs/DATABASE.md` for the schema design and `docs/DEPLOYMENT.md` for
deploying to Vercel and connecting a custom domain.

## Folder structure

```
├── middleware.ts                 # next-intl locale detection/routing
├── messages/
│   ├── en.json                   # English UI strings
│   └── ar.json                   # Arabic UI strings
├── supabase/
│   ├── schema.sql                # tables, RLS policies, stock functions
│   └── seed.sql                  # sample bilingual products (dev only)
├── docs/
│   ├── DATABASE.md
│   └── DEPLOYMENT.md
└── src/
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx        # html/body, fonts, dir=rtl|ltr, header/footer
    │   │   ├── page.tsx          # Home
    │   │   ├── shop/             # Shop/Collections — grid + filters
    │   │   ├── product/[slug]/   # Product detail
    │   │   ├── story/            # Our Story / About
    │   │   ├── journal/          # Blog / scent guides
    │   │   ├── cart/
    │   │   ├── checkout/
    │   │   └── contact/
    │   └── api/
    │       ├── checkout/route.ts         # creates orders + Stripe session
    │       └── webhooks/stripe/route.ts  # confirms payment, updates stock
    ├── components/
    │   ├── layout/    # Header, Footer, LanguageSwitcher, WhatsAppButton
    │   ├── home/      # Hero, BestsellersCarousel, StoryTeaser, WhyUs
    │   ├── shop/      # ProductGrid, Filters
    │   └── product/   # ProductCard, NotesPyramid, AddToCart, ImageGallery, RelatedProducts
    ├── lib/
    │   ├── supabase/  # client.ts (browser), server.ts (RSC), admin.ts (service role)
    │   ├── queries.ts # all product/collection/journal data fetching
    │   ├── types.ts   # Product/Variant/CartItem types + localize() helper
    │   ├── cart-context.tsx  # client-side cart (localStorage-persisted)
    │   ├── stripe.ts
    │   └── utils.ts   # formatPrice, whatsAppLink, generateOrderNumber
    └── i18n/          # next-intl routing/navigation/request config
```

## Adding products

Products live in Supabase, not in code — add them via the Supabase table
editor, SQL, or (recommended once you're past the first few dozen) build a
small internal admin page. Every product needs at minimum: a row in
`products`, at least one row in `product_variants` (size/price/stock), and
ideally rows in `product_notes` and `product_images`. See `docs/DATABASE.md`
for the full schema and `supabase/seed.sql` for worked examples of every
table being populated for one product.

## Environment variables

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` /
`STRIPE_WEBHOOK_SECRET` are server-only secrets — never prefix them with
`NEXT_PUBLIC_` or reference them from a Client Component.

## What's scaffolded vs. what's left

This repo is a working scaffold, not a finished store. Still needed before
launch:
- Real product photography (placeholders are colored gradient boxes)
- A GCC-local payment method beyond Stripe if needed (e.g. Tabby, Tamara,
  or a local bank gateway) — Stripe Checkout is wired end-to-end as the
  card option
- An admin interface for managing products/orders (currently: Supabase
  table editor)
- Order confirmation emails (currently: success page only)
- Analytics, SEO sitemap/robots.txt, and a real FAQ/legal content pass
