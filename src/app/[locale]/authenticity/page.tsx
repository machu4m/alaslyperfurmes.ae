import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PackageSearch, ShieldCheck, MessageCircle } from "lucide-react";
import { whatsAppLink } from "@/lib/utils";
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
        ? "الأصالة والتحقق من رمز الدفعة | الأصلي الإمارات"
        : "Authenticity & Batch Verification | Al Asly UAE",
    description:
      l === "ar"
        ? "كيف تشتري الأصلي عطوراً أصلية من موزعين معتمدين في دبي، وكيف تتحقق من رمز الدفعة بنفسك."
        : "How Al Asly sources authentic perfumes directly from authorized dealers in Dubai, and how to verify your batch code.",
    alternates: buildAlternates(l, "/authenticity"),
  };
}

const copy = {
  en: {
    heroSubtitle:
      "Every fragrance on Al Asly is sourced directly from authorized dealers in Dubai — here's exactly how that works, and how you can check it for yourself.",
    sourcingBody:
      "We buy from a small, vetted circle of authorized dealers in Dubai — never from open marketplaces, resale platforms, or unverified importers. Every dealer relationship is checked before we list a single bottle from them, and we don't publish the details of those arrangements, the same way any retailer keeps its supplier terms private. What we will always tell you is where a bottle didn't come from: the grey market.",
    whyBody:
      "Dubai's perfume market moves fast, and counterfeits move with it — same packaging, same batch-style codes, none of it real. Buying blind is the norm, not the exception. We built Al Asly so you don't have to gamble: fewer products, but every one of them traceable back to an authorized source.",
    verifyBody:
      "Most bottles carry a batch code printed on the base or the box — it identifies the specific production run your unit came from. When we have it on file, it's included on your order confirmation automatically. Don't see one, or want a second check? Send it to us on WhatsApp and we'll confirm it against our records.",
    faqs: [
      {
        q: "What exactly is a batch code?",
        a: "A manufacturer-assigned code tied to a specific production run — it's how any perfume house tracks a bottle back to when and where it was made.",
      },
      {
        q: "What if my order confirmation doesn't show one?",
        a: "Not every SKU has its batch code on file yet — that's on us to catch up on, not a sign anything's wrong. Message us the product and size and we'll confirm it directly.",
      },
      {
        q: "What if I think I received a fake?",
        a: "Tell us immediately, with photos of the batch code and packaging. If something's off, we'll make it right — replacement or refund, no argument.",
      },
    ],
  },
  ar: {
    heroSubtitle:
      "كل عطر في الأصلي مصدره مباشر من موزعين معتمدين في دبي — إليك بالضبط كيف يعمل ذلك، وكيف يمكنك التحقق بنفسك.",
    sourcingBody:
      "نشتري من دائرة صغيرة ومدروسة من الموزعين المعتمدين في دبي — أبداً من أسواق مفتوحة أو منصات إعادة بيع أو مستوردين غير موثقين. يتم التحقق من كل علاقة مع موزع قبل أن نعرض ولو زجاجة واحدة منه، ولا ننشر تفاصيل تلك الاتفاقيات، مثل أي تاجر يحافظ على سرية شروطه مع مورديه. لكن ما سنخبرك به دائماً هو من أين لم تأتِ الزجاجة: السوق الموازي.",
    whyBody:
      "سوق العطور في دبي يتحرك بسرعة، والتقليد يتحرك معه — نفس التغليف، أكواد شبيهة بأكواد الدفعات، لكن لا شيء منها حقيقي. الشراء بلا معرفة هو القاعدة وليس الاستثناء. أسسنا الأصلي لتجنّب هذه المقامرة: منتجات أقل، لكن كل واحد منها يمكن تتبعه إلى مصدر معتمد.",
    verifyBody:
      "تحمل معظم الزجاجات رمز دفعة مطبوعاً على القاعدة أو العلبة — يحدد دفعة الإنتاج التي جاءت منها قطعتك. عندما يكون الرمز مسجلاً لدينا، يُضاف تلقائياً إلى تأكيد طلبك. لا تجد رمزاً، أو تريد التأكد مرة أخرى؟ أرسله لنا عبر واتساب وسنؤكده من سجلاتنا.",
    faqs: [
      {
        q: "ما هو رمز الدفعة بالضبط؟",
        a: "رمز يُخصصه المصنّع لدفعة إنتاج معينة — بهذه الطريقة تتبع أي دار عطور الزجاجة إلى وقت ومكان صنعها.",
      },
      {
        q: "ماذا لو لم يظهر رمز في تأكيد طلبي؟",
        a: "ليس لكل منتج رمز دفعة مسجل لدينا بعد — هذا أمر نحن مسؤولون عن استكماله، وليس علامة على وجود مشكلة. راسلنا باسم المنتج وحجمه وسنؤكده لك مباشرة.",
      },
      {
        q: "ماذا لو شككت أنني استلمت منتجاً مقلداً؟",
        a: "أخبرنا فوراً، مع صور لرمز الدفعة والتغليف. إن كان هناك خلل، سنصححه — استبدال أو استرداد، دون نقاش.",
      },
    ],
  },
} as const;

export default async function AuthenticityPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("authenticity");
  const c = copy[locale as Locale];

  return (
    <div>
      <section className="bg-ink-900 py-24 text-center text-sand-50">
        <div className="container-page">
          <ShieldCheck className="mx-auto h-8 w-8 text-sand-300" aria-hidden />
          <h1 className="mt-4 font-serif font-arabicDisplay text-4xl sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-sand-100/80 sm:text-base">
            {c.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="container-page space-y-16 py-20">
        <section>
          <h2 className="font-serif font-arabicDisplay text-2xl text-ink-900 sm:text-3xl">
            {t("sourcingTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
            {c.sourcingBody}
          </p>
        </section>

        <section>
          <h2 className="font-serif font-arabicDisplay text-2xl text-ink-900 sm:text-3xl">
            {t("whyTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
            {c.whyBody}
          </p>
        </section>

        <section className="rounded-lg border border-sand-300/70 bg-sand-100/60 p-8">
          <div className="flex items-start gap-4">
            <PackageSearch className="mt-1 h-7 w-7 shrink-0 text-oud-600" aria-hidden />
            <div>
              <h2 className="font-serif font-arabicDisplay text-2xl text-ink-900 sm:text-3xl">
                {t("verifyTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
                {c.verifyBody}
              </p>
              <a
                href={whatsAppLink("Hi Al Asly, I'd like to verify a batch code.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {t("verifyCta")}
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif font-arabicDisplay text-2xl text-ink-900 sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <div className="mt-6 max-w-2xl space-y-6">
            {c.faqs.map((item) => (
              <div key={item.q}>
                <p className="text-sm font-semibold text-ink-900">{item.q}</p>
                <p className="mt-1 text-sm text-ink-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
