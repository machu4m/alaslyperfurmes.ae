"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { localize, type Locale, type Product } from "@/lib/types";
import { cx, formatPrice, whatsAppLink } from "@/lib/utils";

export function AddToCart({ product }: { product: Product }) {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const { addItem } = useCart();

  const defaultVariant =
    product.variants.find((v) => v.is_default) ?? product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant?.id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? defaultVariant,
    [product.variants, variantId, defaultVariant]
  );

  if (!variant) return null;

  const productName = localize(locale, product.name_en, product.name_ar);
  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const outOfStock = variant.stock_quantity <= 0;

  function handleAddToCart() {
    if (!variant || outOfStock) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name_en: product.name_en,
      name_ar: product.name_ar,
      image: primaryImage?.url ?? null,
      size_ml: variant.size_ml,
      price: variant.price,
      quantity,
      stock_quantity: variant.stock_quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  const waMessage = `Hello Alasly, I'd like to order ${productName} (${variant.size_ml}ml) x${quantity}.`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest2 text-ink-400">
          {t("sizeTitle")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={v.stock_quantity <= 0}
              onClick={() => setVariantId(v.id)}
              className={cx(
                "rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
                variant.id === v.id
                  ? "border-oud-500 bg-oud-500 text-white"
                  : "border-ink-900/15 text-ink-700 hover:border-oud-500"
              )}
            >
              {v.size_ml}ml
            </button>
          ))}
        </div>
      </div>

      <p className="font-serif font-arabicDisplay text-2xl text-ink-900">
        {formatPrice(variant.price, locale, product.currency)}
      </p>

      {outOfStock ? (
        <p className="text-sm font-medium text-oud-500">{t("outOfStock")}</p>
      ) : variant.stock_quantity <= 5 ? (
        <p className="text-sm text-ink-400">
          {t("onlyLeft", { count: variant.stock_quantity })}
        </p>
      ) : null}

      <div className="flex items-center gap-4">
        <div>
          <label htmlFor="quantity" className="sr-only">
            {t("quantity")}
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded-md border border-ink-900/15 px-3 py-2.5 text-sm"
          >
            {Array.from({ length: Math.min(5, variant.stock_quantity || 1) }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              )
            )}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex-1 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-sand-50 transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {justAdded ? t("addedToCart") : t("addToCart")}
        </button>
      </div>

      <a
        href={whatsAppLink(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full border border-[#25D366] px-6 py-3 text-sm font-semibold text-[#128C46] transition hover:bg-[#25D366]/10"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        {t("orderOnWhatsApp")}
      </a>
    </div>
  );
}
