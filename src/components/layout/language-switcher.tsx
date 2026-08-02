"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = routing.locales.find((l) => l !== locale)!;

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: otherLocale })}
      className="rounded-full border border-ink-900/15 px-3 py-1.5 text-sm font-medium tracking-wide text-ink-700 transition hover:border-oud-500 hover:text-oud-500"
      aria-label={`Switch to ${otherLocale === "ar" ? "Arabic" : "English"}`}
    >
      {otherLocale === "ar" ? "العربية" : "English"}
    </button>
  );
}
