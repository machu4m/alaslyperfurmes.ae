"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize, type Locale, type OrderConfirmation } from "@/lib/types";

function SuccessContent() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";

  const [order, setOrder] = useState<OrderConfirmation | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;

    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: OrderConfirmation | null) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        // Confirmation is a nice-to-have here — the order itself already
        // succeeded, so a failed lookup shouldn't block this page.
      });

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <h1 className="font-serif font-arabicDisplay text-3xl text-ink-900">
        {t("successTitle")}
      </h1>
      <p className="mt-4 max-w-md text-sm text-ink-700">
        {t("successBody", { orderNumber })}
      </p>

      {order && order.items.length > 0 && (
        <div className="mt-10 w-full max-w-md rounded-lg border border-ink-900/10 p-6 text-start">
          <h2 className="text-xs font-semibold uppercase tracking-widest2 text-ink-400">
            {t("orderItemsTitle")}
          </h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((item, i) => (
              <li key={i} className="text-sm">
                <p className="font-medium text-ink-900">
                  {localize(locale, item.product_name_en, item.product_name_ar)}{" "}
                  <span className="text-ink-400">
                    · {item.size_ml}ml × {item.quantity}
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-oud-600" aria-hidden />
                  {item.batch_code ? (
                    <span>
                      {t("batchCodeLabel")}: <span className="font-mono">{item.batch_code}</span>
                    </span>
                  ) : (
                    t("batchCodePending")
                  )}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/authenticity"
            className="mt-5 inline-block text-xs font-semibold uppercase tracking-wide text-oud-600 hover:underline"
          >
            {t("verifyAuthenticityCta")} →
          </Link>
        </div>
      )}

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
