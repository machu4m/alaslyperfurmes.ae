# Deployment & Custom Domain

## 1. Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
3. Framework preset: **Next.js** (auto-detected). Leave build/output settings default.
4. Add environment variables (Project Settings → Environment Variables) —
   copy every key from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SITE_URL` — set this to your final production URL (e.g.
     `https://alaslyperfumes.ae`) once you know it; update it after step 2 below.
   - Set each for **Production**, **Preview**, and **Development** as appropriate
     (use Stripe *test* keys for Preview/Development, *live* keys for Production).
5. Deploy. Vercel gives you a `*.vercel.app` URL immediately — verify the site
   works there before touching DNS.

## 2. Connect your custom domain (e.g. `alaslyperfumes.ae`)

1. In the Vercel project: **Settings → Domains → Add**, enter `alaslyperfumes.ae`
   (and `www.alaslyperfumes.ae` if you want both).
2. Vercel shows you the DNS records to add at your domain registrar
   (wherever `alaslyperfumes.ae` is registered — GoDaddy, Namecheap, a UAE
   registrar, etc.):
   - **Apex domain** (`alaslyperfumes.ae`): an `A` record pointing to
     Vercel's IP (Vercel shows the current value, typically `76.76.21.21`).
   - **`www` subdomain**: a `CNAME` record pointing to `cname.vercel-dns.com`.
   - Alternatively, if your registrar supports it, point the domain's
     nameservers at Vercel and manage DNS entirely from the Vercel dashboard.
3. Add the records in your registrar's DNS panel. Propagation is usually
   minutes, occasionally up to 24-48 hours.
4. Back in Vercel, the domain status flips to "Valid Configuration" once DNS
   resolves — Vercel auto-provisions a free SSL certificate at that point.
5. Decide on a canonical domain (e.g. redirect `www` → apex, or vice versa) —
   Vercel's domain settings let you set one as primary and the other as a
   redirect.
6. Update `NEXT_PUBLIC_SITE_URL` in the environment variables to the final
   domain and redeploy — it's used for absolute URLs (Stripe redirect URLs,
   metadata, sitemap).

## 3. Stripe webhook (production)

1. In the [Stripe Dashboard](https://dashboard.stripe.com) → Developers →
   Webhooks → **Add endpoint**.
2. Endpoint URL: `https://alaslyperfumes.ae/api/webhooks/stripe`.
3. Events to send: `checkout.session.completed`, `checkout.session.expired`.
4. Copy the generated **signing secret** into `STRIPE_WEBHOOK_SECRET` in
   Vercel's environment variables, then redeploy.
5. For local development, use the Stripe CLI instead:
   `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## 4. Supabase production checklist

- Use a separate Supabase project for production vs. local/preview if you
  want isolated data — or a single project with care taken not to run
  `seed.sql` against it.
- Confirm Row Level Security is enabled on every table (it is, per
  `schema.sql`) before going live — a disabled RLS policy on `products`
  would still just expose read-only catalog data, but double-check `orders`
  and `order_items` have **no** public policies.
- Enable Point-in-Time Recovery / daily backups in Supabase settings once
  real orders start flowing in.

## 5. Ongoing deploys

Every push to the branch connected to the Vercel project (typically `main`)
triggers a production deploy automatically; every other branch/PR gets its
own preview deployment with its own URL — useful for reviewing new product
pages or design changes before they go live.
