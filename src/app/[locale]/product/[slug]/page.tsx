import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ImageGallery } from "@/components/product/image-gallery";
import { NotesPyramid } from "@/components/product/notes-pyramid";
import { AddToCart } from "@/components/product/add-to-cart";
import { RelatedProducts } from "@/components/product/related-products";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { localize, type Locale } from "@/lib/types";
import { buildAlternates, buildProductDescription, buildProductTitle } from "@/lib/seo";

interface ProductPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const l = locale as Locale;
  const name = localize(l, product.name_en, product.name_ar);
  const shortDescription = localize(
    l,
    product.short_description_en,
    product.short_description_ar
  );
  const metaTitle = localize(l, product.meta_title_en, product.meta_title_ar);
  const metaDescription = localize(
    l,
    product.meta_description_en,
    product.meta_description_ar
  );

  // "[Perfume Name] Price in Dubai | Authentic Al Asly UAE" (+ AR pattern) by
  // default; a per-product meta_title/meta_description in the database wins
  // when set. concentration_en (not the localized field) feeds the EDP/EDT
  // abbreviation since it's language-independent.
  const title = metaTitle ?? buildProductTitle(l, name);
  const description =
    metaDescription ??
    buildProductDescription(l, {
      name,
      concentration: product.concentration_en,
      shortDescription,
    });

  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];

  return {
    title,
    description,
    alternates: buildAlternates(l, `/product/${slug}`),
    openGraph: {
      title,
      description,
      type: "website",
      locale: l === "ar" ? "ar_AE" : "en_AE",
      images: primaryImage ? [{ url: primaryImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({
  params: { locale, slug },
}: ProductPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations("product");

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const l = locale as Locale;

  const name = localize(l, product.name_en, product.name_ar);
  const shortDescription = localize(
    l,
    product.short_description_en,
    product.short_description_ar
  );
  const description = localize(l, product.description_en, product.description_ar);
  const mood = localize(l, product.mood_en, product.mood_ar);
  const concentration = localize(
    l,
    product.concentration_en,
    product.concentration_ar
  );

  return (
    <div className="container-page py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <ImageGallery images={product.images} productName={name} />

        <div>
          {concentration && (
            <p className="text-xs font-semibold uppercase tracking-widest2 text-ink-400">
              {concentration}
            </p>
          )}
          <h1 className="mt-2 font-serif font-arabicDisplay text-3xl text-ink-900 sm:text-4xl">
            {name}
          </h1>
          {shortDescription && (
            <p className="mt-3 text-base text-ink-400">{shortDescription}</p>
          )}

          {mood && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest2 text-ink-400">
                {t("moodTitle")}
              </p>
              <p className="mt-1 text-sm text-ink-700">{mood}</p>
            </div>
          )}

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <div className="mt-12 border-t border-ink-900/10 pt-8">
            <NotesPyramid notes={product.notes} />
          </div>

          {description && (
            <div className="mt-10 border-t border-ink-900/10 pt-8">
              <h2 className="font-serif font-arabicDisplay text-xl text-ink-900">
                {t("descriptionTitle")}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
