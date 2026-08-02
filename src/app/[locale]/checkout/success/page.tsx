"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function SuccessContent() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900">
        {t("successTitle")}
      </h1>
      <p className="mt-4 max-w-md text-sm text-ink-700">
        {t("successBody", { orderNumber })}
      </p>
      <Link
        href="/shop"
        className="mt-10 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-sand-50 hover:bg-ink-700"
      >
        {tCart("continueShopping")}
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
