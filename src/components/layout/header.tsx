"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useCart } from "@/lib/cart-context";
import { cx } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/story", label: t("story") },
    { href: "/authenticity", label: t("authenticity") },
    { href: "/journal", label: t("journal") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-30 border-b border-ink-900/10 bg-sand-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif font-arabicDisplay text-2xl tracking-widest2 text-ink-900"
        >
          {tBrand("name")}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition hover:text-oud-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-900 transition hover:text-oud-500"
            aria-label={t("cart")}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {itemCount > 0 && (
              <span className="absolute -top-1 end-[-2px] flex h-4 min-w-4 items-center justify-center rounded-full bg-oud-500 px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-ink-900 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cx(
          "overflow-hidden border-t border-ink-900/10 transition-[max-height] duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-ink-700 hover:bg-sand-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="px-2 pt-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
