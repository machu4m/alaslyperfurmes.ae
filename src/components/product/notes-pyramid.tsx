import { useLocale, useTranslations } from "next-intl";
import { localize, type Locale, type ProductNote } from "@/lib/types";

export function NotesPyramid({ notes }: { notes: ProductNote[] }) {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;

  const tiers: { position: ProductNote["position"]; label: string }[] = [
    { position: "top", label: t("notesTop") },
    { position: "middle", label: t("notesMiddle") },
    { position: "base", label: t("notesBase") },
  ];

  return (
    <div>
      <h2 className="font-serif font-arabicDisplay text-xl text-ink-900">
        {t("notesTitle")}
      </h2>
      <div className="mt-6 space-y-5">
        {tiers.map(({ position, label }) => {
          const tierNotes = notes
            .filter((n) => n.position === position)
            .sort((a, b) => a.sort_order - b.sort_order);
          if (tierNotes.length === 0) return null;

          return (
            <div key={position} className="border-s-2 border-sand-300 ps-4">
              <p className="text-xs font-semibold uppercase tracking-widest2 text-oud-500">
                {label}
              </p>
              <p className="mt-1 text-sm text-ink-700">
                {tierNotes
                  .map((n) => localize(locale, n.name_en, n.name_ar))
                  .join(" · ")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
