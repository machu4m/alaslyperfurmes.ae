import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Collection,
  JournalPost,
  Product,
  ProductFilters,
  ScentFamily,
} from "@/lib/types";

const PRODUCT_SELECT = `
  id, slug, name_en, name_ar,
  short_description_en, short_description_ar,
  description_en, description_ar,
  mood_en, mood_ar,
  gender, concentration_en, concentration_ar,
  currency, is_featured,
  meta_title_en, meta_title_ar, meta_description_en, meta_description_ar,
  variants:product_variants(id, sku, size_ml, price, retail_price, stock_quantity, is_default),
  images:product_images(id, url, alt_en, alt_ar, is_primary, sort_order),
  notes:product_notes(id, position, name_en, name_ar, sort_order),
  scent_families:product_scent_families(is_primary, scent_family:scent_families(id, slug, name_en, name_ar, sort_order))
`;

// The Supabase nested-select above returns scent families wrapped as
// `{ is_primary, scent_family: {...} }`; flatten that into `ScentFamily[]`
// so the rest of the app can treat `product.scent_families` as a plain array.
type RawProduct = Omit<Product, "scent_families"> & {
  scent_families: { is_primary: boolean; scent_family: ScentFamily }[];
};

function normalizeProduct(row: RawProduct): Product {
  return {
    ...row,
    variants: [...row.variants].sort((a, b) => a.size_ml - b.size_ml),
    images: [...row.images].sort((a, b) => a.sort_order - b.sort_order),
    notes: [...row.notes].sort((a, b) => a.sort_order - b.sort_order),
    scent_families: row.scent_families.map((sf) => sf.scent_family),
  };
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true);

  if (filters.gender) {
    query = query.eq("gender", filters.gender);
  }

  const { data, error } = await query;
  if (error) throw error;

  let products = (data as unknown as RawProduct[]).map(normalizeProduct);

  if (filters.scentFamily) {
    products = products.filter((p) =>
      p.scent_families.some((sf) => sf.slug === filters.scentFamily)
    );
  }

  if (filters.size) {
    products = products.filter((p) =>
      p.variants.some((v) => v.size_ml === filters.size)
    );
  }

  const priceOf = (p: Product) =>
    Math.min(...p.variants.map((v) => v.price), Infinity);

  if (filters.minPrice != null) {
    products = products.filter((p) => priceOf(p) >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    products = products.filter((p) => priceOf(p) <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case "price-asc":
      products.sort((a, b) => priceOf(a) - priceOf(b));
      break;
    case "price-desc":
      products.sort((a, b) => priceOf(b) - priceOf(a));
      break;
    default:
      break;
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return normalizeProduct(data as unknown as RawProduct);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const families = product.scent_families.map((sf) => sf.slug);
  const all = await getProducts({});
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        p.scent_families.some((sf) => families.includes(sf.slug))
    )
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts({});
  return products.filter((p) => p.is_featured).slice(0, limit);
}

/**
 * Products belonging to any of the given scent families — used for the
 * "Shop {family} Perfumes" internal-linking block on journal posts
 * (a post tagged 'oud' pulls in every current Oud product, so the link
 * list can never go stale as the catalog changes).
 */
export async function getProductsByScentFamilies(
  slugs: string[],
  limit?: number
): Promise<Product[]> {
  if (slugs.length === 0) return [];
  const all = await getProducts({});
  const matches = all.filter((p) =>
    p.scent_families.some((sf) => slugs.includes(sf.slug))
  );
  return limit ? matches.slice(0, limit) : matches;
}

export async function getCollectionBySlug(
  slug: string
): Promise<{ collection: Collection; products: Product[] } | null> {
  const supabase = await createClient();

  const { data: collection, error } = await supabase
    .from("collections")
    .select("id, slug, name_en, name_ar, description_en, description_ar, is_featured")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!collection) return null;

  const { data: links, error: linkError } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", collection.id);

  if (linkError) throw linkError;

  const ids = new Set((links ?? []).map((l) => l.product_id));
  const all = await getProducts({});

  return { collection, products: all.filter((p) => ids.has(p.id)) };
}

export async function getScentFamilies(): Promise<ScentFamily[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scent_families")
    .select("id, slug, name_en, name_ar, sort_order")
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

const JOURNAL_SELECT = `
  id, slug, title_en, title_ar,
  excerpt_en, excerpt_ar,
  content_en, content_ar,
  cover_image_url, cover_image_alt_en, cover_image_alt_ar,
  meta_title_en, meta_title_ar, meta_description_en, meta_description_ar,
  published_at,
  scent_families:journal_post_scent_families(scent_family:scent_families(id, slug, name_en, name_ar, sort_order))
`;

type RawJournalPost = Omit<JournalPost, "scent_families"> & {
  scent_families: { scent_family: ScentFamily }[];
};

function normalizeJournalPost(row: RawJournalPost): JournalPost {
  return {
    ...row,
    scent_families: row.scent_families.map((sf) => sf.scent_family),
  };
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select(JOURNAL_SELECT)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as RawJournalPost[]).map(normalizeJournalPost);
}

export async function getJournalPostBySlug(
  slug: string
): Promise<JournalPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select(JOURNAL_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return normalizeJournalPost(data as unknown as RawJournalPost);
}
