"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { whatsAppLink } from "@/lib/utils";

export function WhatsAppButton() {
  const t = useTranslations("product");

  return (
    <a
      href={whatsAppLink("Hello Al Asly, I'd like to ask about your perfumes.")}
      target="_blank"
      rel="noopener noreferrer"
      // Onyx and gold rather than WhatsApp green — the floating button is a
      // brand surface, and one bright green pill undoes a whole page of
      // restraint. See docs/BRAND.md §4.2.
      className="fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-pill bg-onyx-850
        px-4 py-3 text-gold-500 shadow-lg ring-1 ring-gold-500/25 transition duration-fast
        ease-brand hover:bg-onyx-700 hover:ring-gold-500/50"
      aria-label={t("orderOnWhatsApp")}
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden text-sm font-semibold tracking-caps sm:inline">
        {t("orderOnWhatsApp")}
      </span>
    </a>
  );
}
