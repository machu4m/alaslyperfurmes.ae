import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

export function RelatedProducts({ products }: { products: Product[] }) {
  const t = useTranslations("product");

  if (products.length === 0) return null;

  return (
    <section className="container-page py-20">
      <h2 className="font-serif font-arabicDisplay text-2xl text-ink-900">
        {t("relatedTitle")}
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
