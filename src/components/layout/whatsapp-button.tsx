"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { whatsAppLink } from "@/lib/utils";

export function WhatsAppButton() {
  const t = useTranslations("product");

  return (
    <a
      href={whatsAppLink("Hello Alasly, I'd like to ask about your perfumes.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition hover:brightness-95"
      aria-label={t("orderOnWhatsApp")}
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden text-sm font-medium sm:inline">
        {t("orderOnWhatsApp")}
      </span>
    </a>
  );
}
