import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
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
        ? "قصتنا | الأصلي عطور أصلية الإمارات"
        : "Our Story | Al Asly Authentic Perfumes UAE",
    description:
      l === "ar"
        ? "لماذا بدأنا، من أين نجلب عطورنا، وكيف نختار ما يستحق أن يكون في قائمتنا."
        : "Why we started, where we source from, and how we decide what makes the list.",
    alternates: buildAlternates(l, "/story"),
  };
}

const copy = {
  en: {
    heritage:
      "Al Asly started with a simple frustration: buying real perfume in the UAE too often means wondering if you actually got the real thing. So we built relationships with a small circle of authorized dealers in Dubai, checked every batch ourselves, and only kept the fragrances we'd hand to a friend without a second thought.",
    sourcing:
      "Every bottle listed here comes directly from authorized dealers in Dubai — no marketplaces, no resellers of resellers, no middlemen. That's also why we can show you the real retail price next to ours: there's nothing to hide when the sourcing is this direct.",
    curation:
      "We don't try to carry everything, and we won't pretend to. If a fragrance doesn't clear our bar — on authenticity, on the seller, on the price — it doesn't make the list. What's here is a short, honest edit: fewer bottles, but ones we'd actually recommend.",
  },
  ar: {
    heritage:
      "بدأت الأصلي من إحباط بسيط: شراء عطر أصلي في الإمارات غالباً ما يعني التساؤل هل حصلت فعلاً على المنتج الحقيقي. لذلك بنينا علاقات مع مجموعة صغيرة من الموزعين المعتمدين في دبي، وتحققنا من كل دفعة بأنفسنا، واحتفظنا فقط بالعطور التي نُقدّمها لصديق دون أي تردد.",
    sourcing:
      "كل زجاجة هنا تصلنا مباشرة من موزعين معتمدين في دبي — لا أسواق وسيطة، ولا موزعين لموزعين، ولا وسطاء. لهذا السبب أيضاً نستطيع أن نُظهر لك السعر الأصلي الحقيقي بجانب سعرنا: لا شيء نخفيه عندما يكون المصدر مباشراً إلى هذا الحد.",
    curation:
      "لا نحاول أن نعرض كل شيء، ولن نتظاهر بذلك. إن لم يستوفِ العطر معاييرنا — في الأصالة، أو في البائع، أو في السعر — فلا مكان له في القائمة. ما تراه هنا مجموعة قصيرة وصادقة: عطور أقل، لكنها عطور نوصي بها فعلاً.",
  },
} as const;

export default async function StoryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("story");
  const c = copy[locale as Locale];

  const sections = [
    { title: t("heritageTitle"), body: c.heritage },
    { title: t("sourcingTitle"), body: c.sourcing },
    { title: t("curationTitle"), body: c.curation },
  ];

  return (
    <div>
      <section className="bg-ink-900 py-24 text-center text-sand-50">
        <h1 className="font-serif font-arabicDisplay text-4xl sm:text-5xl">
          {t("title")}
        </h1>
      </section>

      <div className="container-page space-y-20 py-20">
        {sections.map((section, i) => (
          <div key={section.title} className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div
              className={`aspect-[4/3] rounded-lg bg-gradient-to-br from-sand-200 to-sand-400 ${
                i % 2 === 1 ? "lg:order-2" : ""
              }`}
            />
            <div>
              <h2 className="font-serif font-arabicDisplay text-2xl text-ink-900 sm:text-3xl">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-700">
                {section.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
