-- =====================================================================
-- Alasly Perfumes — Supabase / Postgres schema
-- Bilingual (EN/AR) product catalog + orders for a perfume ecommerce site.
-- Run this against a fresh Supabase project (SQL editor or `supabase db push`).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type gender_type as enum ('men', 'women', 'unisex');
create type note_position as enum ('top', 'middle', 'base');
create type payment_method_type as enum ('card', 'cod');
create type payment_status_type as enum ('pending', 'paid', 'failed', 'refunded');
create type fulfillment_status_type as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- ---------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- Scent families (facet used by the shop filter: oud / floral / fresh / oriental / ...)
-- Kept as a table, not an enum, so new families can be added without a migration.
-- ---------------------------------------------------------------------
create table scent_families (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------
-- Collections (curated groupings: "Bestsellers", "Oud Collection", "Limited Edition")
-- Distinct from scent_families: a collection is editorial, a scent family is a facet.
-- ---------------------------------------------------------------------
create table collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,

  name_en text not null,
  name_ar text not null,

  short_description_en text,
  short_description_ar text,

  description_en text,
  description_ar text,

  -- mood / occasion copy, e.g. "Evening wear, oud lovers, cool weather"
  mood_en text,
  mood_ar text,

  gender gender_type not null default 'unisex',

  -- concentration, e.g. "Eau de Parfum", "Extrait de Parfum"
  concentration_en text,
  concentration_ar text,

  sku_prefix text not null,
  currency text not null default 'AED',

  is_active boolean not null default true,
  is_featured boolean not null default false,

  meta_title_en text,
  meta_title_ar text,
  meta_description_en text,
  meta_description_ar text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create index products_is_active_idx on products (is_active);
create index products_gender_idx on products (gender);

-- Product <-> scent family (many-to-many: a perfume can blend families)
create table product_scent_families (
  product_id uuid not null references products (id) on delete cascade,
  scent_family_id uuid not null references scent_families (id) on delete cascade,
  is_primary boolean not null default false,
  primary key (product_id, scent_family_id)
);

-- Product <-> collection (many-to-many)
create table product_collections (
  product_id uuid not null references products (id) on delete cascade,
  collection_id uuid not null references collections (id) on delete cascade,
  primary key (product_id, collection_id)
);

-- ---------------------------------------------------------------------
-- Scent notes pyramid (top / middle / base)
-- ---------------------------------------------------------------------
create table product_notes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  position note_position not null,
  name_en text not null,
  name_ar text not null,
  sort_order int not null default 0
);

create index product_notes_product_id_idx on product_notes (product_id);

-- ---------------------------------------------------------------------
-- Variants (size / price / stock — what actually gets sold)
-- ---------------------------------------------------------------------
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  sku text unique not null,
  size_ml int not null,
    price numeric(10, 2) not null check (price >= 0),
  -- the "before" price shown crossed out next to `price` for price-transparency
  -- display (retail/MSRP vs. the actual Al Asly sell price)
  retail_price numeric(10, 2) check (retail_price is null or retail_price >= price),
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger product_variants_set_updated_at
  before update on product_variants
  for each row execute function set_updated_at();

create index product_variants_product_id_idx on product_variants (product_id);
create unique index product_variants_one_default_per_product
  on product_variants (product_id)
  where is_default;

-- ---------------------------------------------------------------------
-- Images
-- ---------------------------------------------------------------------
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  url text not null,
  alt_en text,
  alt_ar text,
  is_primary boolean not null default false,
  sort_order int not null default 0
);

create index product_images_product_id_idx on product_images (product_id);
create unique index product_images_one_primary_per_product
  on product_images (product_id)
  where is_primary;

-- ---------------------------------------------------------------------
-- Journal / blog (optional, for SEO)
-- ---------------------------------------------------------------------
create table journal_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_ar text not null,
  excerpt_en text,
  excerpt_ar text,
  content_en text,
  content_ar text,
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger journal_posts_set_updated_at
  before update on journal_posts
  for each row execute function set_updated_at();

create index journal_posts_published_idx on journal_posts (is_published, published_at desc);

-- ---------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,

  customer_name text not null,
  email text,
  phone text not null,

  shipping_address_line1 text not null,
  shipping_address_line2 text,
  city text not null,
  country text not null default 'AE',

  locale text not null default 'en' check (locale in ('en', 'ar')),

  payment_method payment_method_type not null,
  payment_status payment_status_type not null default 'pending',
  fulfillment_status fulfillment_status_type not null default 'pending',

  stripe_payment_intent_id text,
  stripe_checkout_session_id text,

  subtotal numeric(10, 2) not null,
  shipping_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  currency text not null default 'AED',

  customer_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

create index orders_created_at_idx on orders (created_at desc);
create index orders_payment_status_idx on orders (payment_status);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  variant_id uuid references product_variants (id) on delete set null,

  -- snapshots so historical orders stay correct if the product changes later
  product_name_en text not null,
  product_name_ar text not null,
  size_ml int not null,
  unit_price numeric(10, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index order_items_order_id_idx on order_items (order_id);

-- ---------------------------------------------------------------------
-- Atomic stock helpers, called from the checkout API (service_role) so
-- concurrent orders can't oversell the same variant.
-- ---------------------------------------------------------------------
create or replace function decrement_variant_stock(variant_id uuid, amount int)
returns void as $$
begin
  update product_variants
  set stock_quantity = stock_quantity - amount
  where id = variant_id and stock_quantity >= amount;

  if not found then
    raise exception 'insufficient_stock: %', variant_id;
  end if;
end;
$$ language plpgsql;

create or replace function restock_variant(variant_id uuid, amount int)
returns void as $$
begin
  update product_variants
  set stock_quantity = stock_quantity + amount
  where id = variant_id;
end;
$$ language plpgsql;

-- =====================================================================
-- Row Level Security
-- Catalog data is public-readable. Orders are written only by the server
-- (API routes use the Supabase service_role key, which bypasses RLS) —
-- no anon insert/update policies are defined for orders on purpose.
-- =====================================================================

alter table scent_families enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table product_scent_families enable row level security;
alter table product_collections enable row level security;
alter table product_notes enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table journal_posts enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "scent_families are public" on scent_families for select using (true);
create policy "collections are public" on collections for select using (true);
create policy "active products are public" on products for select using (is_active = true);
create policy "product_scent_families are public" on product_scent_families for select using (true);
create policy "product_collections are public" on product_collections for select using (true);
create policy "product_notes are public" on product_notes for select using (true);
create policy "product_variants are public" on product_variants for select using (true);
create policy "product_images are public" on product_images for select using (true);
create policy "published journal posts are public" on journal_posts for select using (is_published = true);

-- orders / order_items: no policies -> only accessible via service_role (server-side)
