"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

export function BestsellersCarousel({ products }: { products: Product[] }) {
  const t = useTranslations("home");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    direction: typeof document !== "undefined" ? (document.dir === "rtl" ? "rtl" : "ltr") : "ltr",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (products.length === 0) return null;

  return (
    <section className="container-page py-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif font-arabicDisplay text-3xl text-ink-900">
            {t("bestsellersTitle")}
          </h2>
          <p className="mt-1 text-sm text-ink-400">{t("bestsellersSubtitle")}</p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/15 disabled:opacity-30"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/15 disabled:opacity-30"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden" ref={emblaRef}>
        <div className="-ms-4 flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_70%] ps-4 sm:flex-[0_0_40%] lg:flex-[0_0_25%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="text-sm font-semibold uppercase tracking-wide text-oud-500 hover:text-oud-600"
        >
          {t("viewAll")} →
        </Link>
      </div>
    </section>
  );
}
