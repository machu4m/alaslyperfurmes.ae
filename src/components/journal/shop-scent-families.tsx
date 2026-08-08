import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { localize, type Locale, type Product, type ScentFamily } from "@/lib/types";

interface ShopScentFamiliesProps {
  families: ScentFamily[];
  products: Product[];
}

/**
 * Auto-generated internal-linking block for journal posts: a heading built
 * from the post's tagged scent families (each name itself linking to the
 * filtered shop view) plus a grid of every current product in those
 * families. Nothing here is hand-authored, so it can't go stale — tag a
 * post 'oud' and it always reflects what's actually in stock.
 */
export function ShopScentFamilies({ families, products }: ShopScentFamiliesProps) {
  const t = useTranslations("journal");
  const locale = useLocale() as Locale;

  if (families.length === 0 || products.length === 0) return null;

  const familyNames = families.map((f) => localize(locale, f.name_en, f.name_ar));
  const separator = locale === "ar" ? "، " : " & ";

  return (
    <section className="container-page py-16">
      <h2 className="font-serif font-arabicDisplay text-2xl text-ink-900">
        {t("shopRelatedTitle", { families: familyNames.join(separator) })}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {families.map((family) => (
          <Link
            key={family.id}
            href={`/shop?scentFamily=${family.slug}`}
            className="rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:border-oud-500 hover:text-oud-600"
          >
            {localize(locale, family.name_en, family.name_ar)}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
