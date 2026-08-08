export type Locale = "en" | "ar";
export type Gender = "men" | "women" | "unisex";
export type NotePosition = "top" | "middle" | "base";
export type PaymentMethod = "card" | "cod";

export interface ScentFamily {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  sort_order: number;
}

export interface Collection {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  is_featured: boolean;
}

export interface ProductNote {
  id: string;
  position: NotePosition;
  name_en: string;
  name_ar: string;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size_ml: number;
  price: number;
  /** Crossed-out "before" price used in the price-transparency display. */
  retail_price: number | null;
  stock_quantity: number;
  is_default: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_en: string | null;
  alt_ar: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  short_description_en: string | null;
  short_description_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  mood_en: string | null;
  mood_ar: string | null;
  gender: Gender;
  concentration_en: string | null;
  concentration_ar: string | null;
  currency: string;
  is_featured: boolean;
  /** SEO overrides — when set, used verbatim instead of the generated title/description template. */
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  variants: ProductVariant[];
  images: ProductImage[];
  notes: ProductNote[];
  scent_families: ScentFamily[];
}

export interface ProductFilters {
  gender?: Gender;
  scentFamily?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "bestselling";
}

export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  name_en: string;
  name_ar: string;
  image: string | null;
  size_ml: number;
  price: number;
  quantity: number;
  stock_quantity: number;
}

/**
 * A line item as returned by GET /api/orders/[orderNumber] for the checkout
 * success page — deliberately excludes customer PII (name/address/phone),
 * see that route for why. `batch_code` is the batch actually shipped,
 * snapshotted onto order_items at checkout time.
 */
export interface OrderConfirmationItem {
  product_name_en: string;
  product_name_ar: string;
  size_ml: number;
  quantity: number;
  batch_code: string | null;
}

export interface OrderConfirmation {
  order_number: string;
  items: OrderConfirmationItem[];
}

/** Pick the localized value of a bilingual `_en`/`_ar` field pair. */
export function localize<T extends string | null>(
  locale: Locale,
  en: T,
  ar: T
): T {
  return locale === "ar" ? ar : en;
}
