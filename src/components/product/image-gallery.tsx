"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { localize, type Locale, type ProductImage } from "@/lib/types";
import { cx } from "@/lib/utils";

export function ImageGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const locale = useLocale() as Locale;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(sorted[0]?.id);

  const activeImage = sorted.find((i) => i.id === active) ?? sorted[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-sand-100">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={localize(locale, activeImage.alt_en, activeImage.alt_ar) ?? productName}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sand-400">
            <span className="font-serif font-arabicDisplay text-lg">{productName}</span>
          </div>
        )}
      </div>

      {sorted.length > 1 && (
        <div className="mt-4 flex gap-3">
          {sorted.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(img.id)}
              className={cx(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2",
                activeImage?.id === img.id ? "border-oud-500" : "border-transparent"
              )}
            >
              <Image
                src={img.url}
                alt={localize(locale, img.alt_en, img.alt_ar) ?? productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
