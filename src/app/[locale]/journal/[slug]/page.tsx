import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { getJournalPostBySlug, getProductsByScentFamilies } from "@/lib/queries";
import { localize, type Locale } from "@/lib/types";
import { buildAlternates, truncateForMeta } from "@/lib/seo";
import { MarkdownContent } from "@/components/journal/markdown-content";
import { ShopScentFamilies } from "@/components/journal/shop-scent-families";

interface JournalPostPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: JournalPostPageProps): Promise<Metadata> {
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};

  const l = locale as Locale;
  const name = localize(l, post.title_en, post.title_ar);
  const excerpt = localize(l, post.excerpt_en, post.excerpt_ar);
  const metaTitle = localize(l, post.meta_title_en, post.meta_title_ar);
  const metaDescription = localize(l, post.meta_description_en, post.meta_description_ar);

  const title = metaTitle ?? (l === "ar" ? `${name} | مجلة الأصلي` : `${name} | Al Asly Journal`);
  const description = metaDescription ?? (excerpt ? truncateForMeta(excerpt, 160) : undefined);

  return {
    title,
    description,
    alternates: buildAlternates(l, `/journal/${slug}`),
    openGraph: {
      title,
      description,
      type: "article",
      locale: l === "ar" ? "ar_AE" : "en_AE",
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
  };
}

export default async function JournalPostPage({
  params: { locale, slug },
}: JournalPostPageProps) {
  setRequestLocale(locale);
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  const l = locale as Locale;
  const title = localize(l, post.title_en, post.title_ar);
  const coverAlt = localize(l, post.cover_image_alt_en, post.cover_image_alt_ar) ?? title;
  const content = localize(l, post.content_en, post.content_ar);
  const familySlugs = post.scent_families.map((f) => f.slug);

  const relatedProducts = await getProductsByScentFamilies(familySlugs, 8);

  return (
    <article>
      <div className="container-page max-w-3xl py-16">
        <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900 sm:text-4xl">
          {title}
        </h1>
        {post.published_at && (
          <p className="mt-3 text-xs uppercase tracking-widest2 text-ink-400">
            {new Date(post.published_at).toLocaleDateString(l === "ar" ? "ar-AE" : "en-AE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {post.cover_image_url && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-sand-100">
            <Image
              src={post.cover_image_url}
              alt={coverAlt}
              fill
              priority
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        {content && (
          <div className="mt-10">
            <MarkdownContent content={content} locale={l} />
          </div>
        )}
      </div>

      <ShopScentFamilies families={post.scent_families} products={relatedProducts} />
    </article>
  );
}
