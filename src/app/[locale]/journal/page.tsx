import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getJournalPosts } from "@/lib/queries";
import { localize, type Locale } from "@/lib/types";
import { buildAlternates } from "@/lib/seo";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const l = locale as Locale;
  return {
    title:
      l === "ar"
        ? "المجلة | أدلة العطور من الأصلي الإمارات"
        : "Journal | Scent Guides by Al Asly UAE",
    description:
      l === "ar"
        ? "أدلة وقصص عن العطور من الأصلي، لتساعدك على اختيار عطرك المميز."
        : "Scent guides and stories from Al Asly to help you find your signature fragrance.",
    alternates: buildAlternates(l, "/journal"),
  };
}

export default async function JournalPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("journal");
  const posts = await getJournalPosts();
  const l = locale as Locale;

  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-ink-400">{t("subtitle")}</p>
      </div>

      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const title = localize(l, post.title_en, post.title_ar);
          const coverAlt = localize(l, post.cover_image_alt_en, post.cover_image_alt_ar) ?? title;

          return (
            <div key={post.id}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand-100">
                  {post.cover_image_url && (
                    <Image
                      src={post.cover_image_url}
                      alt={coverAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <h2 className="mt-4 font-serif font-arabicDisplay text-lg text-ink-900">
                  {title}
                </h2>
                {post.excerpt_en && (
                  <p className="mt-2 text-sm text-ink-400">
                    {localize(l, post.excerpt_en, post.excerpt_ar)}
                  </p>
                )}
                <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-oud-500">
                  {t("readMore")} →
                </span>
              </Link>

              {post.scent_families.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.scent_families.map((family) => (
                    <Link
                      key={family.id}
                      href={`/shop?scentFamily=${family.slug}`}
                      className="rounded-full border border-ink-900/15 px-2.5 py-1 text-[11px] font-medium text-ink-700 transition hover:border-oud-500 hover:text-oud-600"
                    >
                      {localize(l, family.name_en, family.name_ar)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
