import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/types";
import { computeSavings, cx, formatPrice } from "@/lib/utils";

interface PriceTransparencyProps {
  price: number;
  retailPrice?: number | null;
  currency?: string;
  /**
   * "detail" — full stacked 3-line block (product detail page).
   * "compact" — single-line summary (product cards, catalog export cards).
   */
  size?: "detail" | "compact";
  className?: string;
}

/**
 * Alasly's signature price-transparency block: retail price crossed out,
 * the actual Al Asly price, and the savings called out — not styled as a
 * discount badge, but as a quiet proof point that the price is honest.
 * Reused as-is on product cards and the product detail page; the "compact"
 * size is also meant for a future WhatsApp/social catalog export card.
 */
export function PriceTransparency({
  price,
  retailPrice,
  currency = "AED",
  size = "detail",
  className,
}: PriceTransparencyProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const savings = computeSavings(price, retailPrice);

  if (size === "compact") {
    return (
      <div className={cx("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
        {savings && retailPrice != null && (
          <span className="text-xs text-ink-400 line-through decoration-1">
            {formatPrice(retailPrice, locale, currency)}
          </span>
        )}
        <span className="text-sm font-semibold text-ink-900">
          {formatPrice(price, locale, currency)}
        </span>
        {savings && (
          <span className="rounded-full border border-sand-300 bg-sand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-oud-600">
            {t("youSaveShort", { percentage: savings.percentage })}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cx("space-y-2", className)}>
      {savings && retailPrice != null && (
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xs uppercase tracking-wide text-ink-400">
            {t("retailPrice")}
          </span>
          <span className="text-sm text-ink-400 line-through decoration-1">
            {formatPrice(retailPrice, locale, currency)}
          </span>
        </div>
      )}

      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs uppercase tracking-wide text-ink-400">
          {t("alaslyPrice")}
        </span>
        <span className="font-serif font-arabicDisplay text-2xl text-ink-900">
          {formatPrice(price, locale, currency)}
        </span>
      </div>

      {savings && (
        <div className="flex items-center justify-between gap-4 rounded-md border border-sand-300/70 bg-sand-100/60 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-widest2 text-oud-600">
            {t("youSave")}
          </span>
          <span className="text-sm font-semibold text-oud-600">
            {formatPrice(savings.amount, locale, currency)} ({savings.percentage}%)
          </span>
        </div>
      )}
    </div>
  );
}
