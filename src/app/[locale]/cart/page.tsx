"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { localize, type Locale } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-serif font-arabicDisplay text-2xl text-ink-900">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-ink-400">{t("empty")}</p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-sand-50 hover:bg-ink-700"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900">
        {t("title")}
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-ink-900/10">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-4 py-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-sand-100">
                {item.image && (
                  <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-serif font-arabicDisplay text-base text-ink-900 hover:text-oud-500"
                    >
                      {localize(locale, item.name_en, item.name_ar)}
                    </Link>
                    <p className="mt-1 text-xs text-ink-400">
                      {t("size", { size: item.size_ml })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="text-ink-400 hover:text-oud-500"
                    aria-label={t("remove")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-ink-900/15 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center text-ink-700 hover:text-oud-500"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="flex h-6 w-6 items-center justify-center text-ink-700 hover:text-oud-500 disabled:opacity-30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-ink-900">
                    {formatPrice(item.price * item.quantity, locale)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-lg border border-ink-900/10 p-6">
          <div className="flex justify-between text-sm text-ink-700">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(subtotal, locale)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink-400">
            <span>{t("shipping")}</span>
            <span>{t("shippingCalculated")}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink-900/10 pt-4 text-base font-semibold text-ink-900">
            <span>{t("total")}</span>
            <span>{formatPrice(subtotal, locale)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-ink-900 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-sand-50 hover:bg-ink-700"
          >
            {t("checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
