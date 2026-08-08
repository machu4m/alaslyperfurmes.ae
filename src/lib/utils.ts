import type { Locale } from "@/lib/types";

export function formatPrice(amount: number, locale: Locale, currency = "AED") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function whatsAppLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ALS-${stamp}-${rand}`;
}

export interface Savings {
  amount: number;
  percentage: number;
}

/**
 * Savings between the retail (crossed-out) price and the actual sell price.
 * Returns null when there's nothing to show — no retail price set, or it
 * isn't actually higher than the sell price.
 */
export function computeSavings(
  price: number,
  retailPrice: number | null | undefined
): Savings | null {
  if (!retailPrice || retailPrice <= price) return null;
  const amount = retailPrice - price;
  const percentage = Math.round((amount / retailPrice) * 100);
  return { amount, percentage };
}

/**
 * Plain-text rendering of the price-transparency block — retail price,
 * Al Asly price, and savings — for contexts that can't render the
 * PriceTransparency component, e.g. a WhatsApp/social catalog export.
 */
export function formatPriceTransparencyText(
  locale: Locale,
  price: number,
  retailPrice: number | null | undefined,
  currency = "AED"
) {
  const savings = computeSavings(price, retailPrice);
  const priceLabel = locale === "ar" ? "سعر الأصلي" : "Al Asly Price";
  const priceLine = `${priceLabel}: ${formatPrice(price, locale, currency)}`;

  if (!savings || !retailPrice) return priceLine;

  const retailLabel = locale === "ar" ? "السعر الأصلي" : "Retail Price";
  const saveLabel = locale === "ar" ? "التوفير" : "You Save";
  const retailLine = `${retailLabel}: ${formatPrice(retailPrice, locale, currency)}`;
  const saveLine = `${saveLabel}: ${formatPrice(savings.amount, locale, currency)} (${savings.percentage}%)`;

  return [retailLine, priceLine, saveLine].join("\n");
}
