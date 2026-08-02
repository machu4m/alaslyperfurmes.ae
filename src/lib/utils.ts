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
