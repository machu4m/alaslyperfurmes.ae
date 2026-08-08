import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MessageCircle, Mail } from "lucide-react";
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
    title: l === "ar" ? "تواصل معنا والدعم | الأصلي الإمارات" : "Contact & Support | Al Asly UAE",
    description:
      l === "ar"
        ? "تواصل معنا عبر واتساب أو البريد الإلكتروني، واطّلع على أسئلتنا الشائعة وسياسة الشحن والإرجاع."
        : "Reach us on WhatsApp or email, and check our FAQ and shipping & returns policy.",
    alternates: buildAlternates(l, "/contact"),
  };
}

const faqs = {
  en: [
    {
      q: "How long does delivery take?",
      a: "2-5 business days across the UAE, Saudi Arabia, Kuwait, Qatar, Bahrain and Oman.",
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes, COD is available on all orders within the GCC alongside card payment.",
    },
    {
      q: "Are your fragrances alcohol-based?",
      a: "Most of our Eau de Parfum line is alcohol-based; oil-based options are noted on the product page.",
    },
  ],
  ar: [
    {
      q: "كم تستغرق مدة التوصيل؟",
      a: "من ٢ إلى ٥ أيام عمل داخل الإمارات والسعودية والكويت وقطر والبحرين وعمان.",
    },
    {
      q: "هل يتوفر الدفع عند الاستلام؟",
      a: "نعم، الدفع عند الاستلام متاح لجميع الطلبات داخل دول الخليج إلى جانب الدفع بالبطاقة.",
    },
    {
      q: "هل عطوركم كحولية؟",
      a: "معظم تشكيلة أو دو بارفان لدينا كحولية الأساس؛ الخيارات الزيتية موضحة في صفحة المنتج.",
    },
  ],
} as const;

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const l = locale as Locale;

  return (
    <div className="container-page py-12">
      <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900 sm:text-4xl">
        {t("title")}
      </h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <a
          href={whatsAppLink("Hello Alasly, I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-start gap-3 rounded-lg border border-ink-900/10 p-6 transition hover:border-[#25D366]"
        >
          <MessageCircle className="h-6 w-6 text-[#25D366]" />
          <h2 className="font-serif font-arabicDisplay text-lg text-ink-900">
            {t("whatsappTitle")}
          </h2>
          <p className="text-sm text-ink-400">{t("whatsappBody")}</p>
          <span className="text-sm font-semibold text-[#128C46]">{t("whatsappCta")} →</span>
        </a>

        <a
          href="mailto:hello@alasly.ae"
          className="flex flex-col items-start gap-3 rounded-lg border border-ink-900/10 p-6 transition hover:border-oud-500"
        >
          <Mail className="h-6 w-6 text-oud-500" />
          <h2 className="font-serif font-arabicDisplay text-lg text-ink-900">
            {t("emailTitle")}
          </h2>
          <p className="text-sm text-ink-400">hello@alasly.ae</p>
        </a>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif font-arabicDisplay text-xl text-ink-900">
            {t("faqTitle")}
          </h2>
          <div className="mt-6 space-y-6">
            {faqs[l].map((item) => (
              <div key={item.q}>
                <p className="text-sm font-semibold text-ink-900">{item.q}</p>
                <p className="mt-1 text-sm text-ink-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif font-arabicDisplay text-xl text-ink-900">
            {t("shippingTitle")}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ink-400">
            {t("shippingBody")}
          </p>
        </div>
      </div>
    </div>
  );
}
