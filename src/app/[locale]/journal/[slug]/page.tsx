import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getJournalPostBySlug } from "@/lib/queries";
import { localize, type Locale } from "@/lib/types";

interface JournalPostPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: JournalPostPageProps): Promise<Metadata> {
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};
  return { title: localize(locale as Locale, post.title_en, post.title_ar) };
}

export default async function JournalPostPage({
  params: { locale, slug },
}: JournalPostPageProps) {
  setRequestLocale(locale);
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  const l = locale as Locale;

  return (
    <article className="container-page max-w-3xl py-16">
      <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900 sm:text-4xl">
        {localize(l, post.title_en, post.title_ar)}
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
      <div className="prose prose-sand mt-10 max-w-none whitespace-pre-line text-base leading-relaxed text-ink-700">
        {localize(l, post.content_en, post.content_ar)}
      </div>
    </article>
  );
}
