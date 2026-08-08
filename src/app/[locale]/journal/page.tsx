import type { Metadata } from "next";
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
        {posts.map((post) => (
          <Link key={post.id} href={`/journal/${post.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sand-100">
              {post.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover_image_url}
                  alt={localize(l, post.title_en, post.title_ar)}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <h2 className="mt-4 font-serif font-arabicDisplay text-lg text-ink-900">
              {localize(l, post.title_en, post.title_ar)}
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
        ))}
      </div>
    </div>
  );
}
