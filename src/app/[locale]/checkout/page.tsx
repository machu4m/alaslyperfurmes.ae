"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { localize, type Locale, type PaymentMethod } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      locale,
      paymentMethod,
      customer: {
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        addressLine1: String(form.get("addressLine1") ?? ""),
        addressLine2: String(form.get("addressLine2") ?? ""),
        city: String(form.get("city") ?? ""),
        country: String(form.get("country") ?? "AE"),
        notes: String(form.get("notes") ?? ""),
      },
      items: items.map((i) => ({
        variantId: i.variantId,
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("checkout_failed");
      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch {
      setError(t("errorBody"));
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <p className="text-sm text-ink-400">{tCart("empty")}</p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-sand-50 hover:bg-ink-700"
        >
          {tCart("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900">
        {t("title")}
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest2 text-ink-900">
              {t("contactTitle")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="fullName" required placeholder={t("fullName")} className="input sm:col-span-2" />
              <input name="email" type="email" placeholder={t("email")} className="input" />
              <input name="phone" required type="tel" placeholder={t("phone")} className="input" />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest2 text-ink-900">
              {t("shippingTitle")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="addressLine1" required placeholder={t("addressLine1")} className="input sm:col-span-2" />
              <input name="addressLine2" placeholder={t("addressLine2")} className="input sm:col-span-2" />
              <input name="city" required placeholder={t("city")} className="input" />
              <select name="country" defaultValue="AE" className="input">
                <option value="AE">United Arab Emirates</option>
                <option value="SA">Saudi Arabia</option>
                <option value="KW">Kuwait</option>
                <option value="QA">Qatar</option>
                <option value="BH">Bahrain</option>
                <option value="OM">Oman</option>
              </select>
            </div>
            <textarea
              name="notes"
              placeholder={t("notes")}
              rows={3}
              className="input mt-4 w-full"
            />
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest2 text-ink-900">
              {t("paymentTitle")}
            </h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 rounded-md border border-ink-900/15 p-4 text-sm">
                <input
                  type="radio"
                  name="paymentMethodRadio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-oud-500"
                />
                {t("paymentCard")}
              </label>
              <label className="flex items-center gap-3 rounded-md border border-ink-900/15 p-4 text-sm">
                <input
                  type="radio"
                  name="paymentMethodRadio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-oud-500"
                />
                {t("paymentCod")}
              </label>
            </div>
          </section>

          {error && <p className="text-sm text-oud-500">{error}</p>}
        </div>

        <div className="h-fit space-y-4 rounded-lg border border-ink-900/10 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest2 text-ink-900">
            {t("orderSummary")}
          </h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between text-sm text-ink-700">
                <span>
                  {localize(locale, item.name_en, item.name_ar)} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity, locale)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-ink-900/10 pt-4 text-base font-semibold text-ink-900">
            <span>{tCart("total")}</span>
            <span>{formatPrice(subtotal, locale)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-sand-50 transition hover:bg-ink-700 disabled:opacity-50"
          >
            {submitting ? t("placingOrder") : t("placeOrder")}
          </button>
        </div>
      </form>
    </div>
  );
}
