import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Filters } from "@/components/shop/filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProducts, getScentFamilies } from "@/lib/queries";
import type { Gender, ProductFilters } from "@/lib/types";

export default async function ShopPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | undefined };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const filters: ProductFilters = {
    gender: searchParams.gender as Gender | undefined,
    scentFamily: searchParams.scentFamily,
    size: searchParams.size ? Number(searchParams.size) : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort: searchParams.sort as ProductFilters["sort"],
  };

  const [products, scentFamilies] = await Promise.all([
    getProducts(filters),
    getScentFamilies(),
  ]);

  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-ink-400">
          {t("resultsCount", { count: products.length })}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Filters scentFamilies={scentFamilies} />
        </aside>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
