import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations("shop");

  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-ink-400">{t("empty")}</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
