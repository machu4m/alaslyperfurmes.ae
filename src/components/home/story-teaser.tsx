import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function StoryTeaser() {
  const t = useTranslations("home");

  return (
    <section className="container-page grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
      {/* Replace with brand / atelier photography */}
      <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-sand-200 to-sand-400" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest2 text-oud-500">
          {t("storyTeaserTitle")}
        </p>
        <h2 className="mt-3 font-serif font-arabicDisplay text-3xl leading-snug text-ink-900 sm:text-4xl">
          {t("storyTeaserBody")}
        </h2>
        <Link
          href="/story"
          className="mt-8 inline-flex items-center text-sm font-semibold uppercase tracking-wide text-ink-900 underline decoration-oud-500 decoration-2 underline-offset-4 hover:text-oud-500"
        >
          {t("storyTeaserCta")}
        </Link>
      </div>
    </section>
  );
}
