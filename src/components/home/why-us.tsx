import { useTranslations } from "next-intl";
import { Gem, Handshake, ShieldCheck, Truck } from "lucide-react";

export function WhyUs() {
  const t = useTranslations("home");

  const features = [
    { icon: Gem, label: t("featureCraftsmanship") },
    { icon: Handshake, label: t("featureSourcing") },
    { icon: Truck, label: t("featureShipping") },
    { icon: ShieldCheck, label: t("featureAuthenticity") },
  ];

  return (
    <section className="border-y border-ink-900/10 bg-sand-100/60">
      <div className="container-page grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <Icon className="h-7 w-7 text-oud-500" aria-hidden />
            <p className="mt-3 text-sm font-medium text-ink-700">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
