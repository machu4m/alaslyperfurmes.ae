import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale, Product } from "@/lib/types";
import { localize } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("shop");

  const primaryImage =
    product.images.find((i) => i.is_primary) ?? product.images[0];
  const fromPrice = Math.min(
    ...product.variants.map((v) => v.price),
    Infinity
  );
  const primaryFamily = product.scent_families[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-sand-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={localize(locale, primaryImage.alt_en, primaryImage.alt_ar) ?? ""}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sand-400">
            <span className="font-serif font-arabicDisplay text-sm">
              {localize(locale, product.name_en, product.name_ar)}
            </span>
          </div>
        )}
        {primaryFamily && (
          <span className="absolute start-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-700">
            {localize(locale, primaryFamily.name_en, primaryFamily.name_ar)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="font-serif font-arabicDisplay text-base text-ink-900">
          {localize(locale, product.name_en, product.name_ar)}
        </h3>
      </div>
      <p className="mt-1 text-sm text-ink-400">
        {Number.isFinite(fromPrice)
          ? t("fromPrice", { price: formatPrice(fromPrice, locale, product.currency) })
          : null}
      </p>
    </Link>
  );
}
