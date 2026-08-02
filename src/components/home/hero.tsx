import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-ink-900 text-sand-50">
      {/* Replace with a hero photograph / video of the product line or a model. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/70 to-ink-900"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(175,133,72,0.25),transparent_60%)]" aria-hidden />

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <p className="text-xs font-medium uppercase tracking-widest2 text-sand-300">
          Alasly · الأصلي
        </p>
        <h1 className="mt-6 max-w-3xl font-serif font-arabicDisplay text-4xl leading-tight sm:text-5xl lg:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-6 max-w-xl text-base text-sand-100/80 sm:text-lg">
          {t("heroSubtitle")}
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-flex items-center rounded-full bg-sand-300 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-ink-900 transition hover:bg-sand-200"
        >
          {t("heroCta")}
        </Link>
      </div>
    </section>
  );
}
