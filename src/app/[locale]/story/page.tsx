import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";

const copy = {
  en: {
    heritage:
      "Alasly began in a small atelier with a simple belief: perfume should tell the truth about where you come from. Drawing on generations of Arabian perfumery, every formula we release honors that lineage rather than imitating it.",
    sourcing:
      "We work directly with growers and distillers across the region — oud from aged agarwood, saffron hand-picked at dawn, rose water distilled the traditional way. No shortcuts, no synthetic substitutes where the real thing exists.",
    craftsmanship:
      "Each bottle is blended in small batches, rested to mature, and finished and inspected by hand before it ever reaches a shelf. It's slower. It's also the only way we know how to make something worth wearing.",
  },
  ar: {
    heritage:
      "بدأت الأصلي في محترف صغير، انطلاقاً من إيمان بسيط: يجب أن يعكس العطر حقيقة أصلك. مستلهمين من أجيال من صناعة العطور العربية، كل تركيبة نطلقها تكرّم هذا الإرث ولا تكتفي بتقليده.",
    sourcing:
      "نعمل مباشرة مع المزارعين والمقطرين في المنطقة — عود من خشب العود المعتّق، زعفران يُقطف يدوياً عند الفجر، ماء ورد يُقطّر بالطريقة التقليدية. بلا اختصارات، وبلا بدائل صناعية حيثما توفر الأصل.",
    craftsmanship:
      "تُمزج كل زجاجة على دفعات صغيرة، تُترك لتنضج، ثم تُشطَّب وتُفحص يدوياً قبل أن تصل إلى الرف. إنها عملية أبطأ، لكنها الطريقة الوحيدة التي نعرفها لصناعة عطر يستحق أن يُرتدى.",
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
    { title: t("craftsmanshipTitle"), body: c.craftsmanship },
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
