import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-900/10 bg-ink-900 text-sand-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-serif font-arabicDisplay text-xl">
            {t("aboutTitle")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-sand-100/70">
            {t("aboutBody")}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest2 text-sand-100/60">
            {t("shopTitle")}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-sand-300">
                {tNav("shop")}
              </Link>
            </li>
            <li>
              <Link href="/shop?gender=men" className="hover:text-sand-300">
                Men
              </Link>
            </li>
            <li>
              <Link href="/shop?gender=women" className="hover:text-sand-300">
                Women
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest2 text-sand-100/60">
            {t("companyTitle")}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/story" className="hover:text-sand-300">
                {tNav("story")}
              </Link>
            </li>
            <li>
              <Link href="/journal" className="hover:text-sand-300">
                {tNav("journal")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-sand-300">
                {tNav("contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest2 text-sand-100/60">
            {t("newsletterTitle")}
          </h4>
          <p className="mt-4 text-sm text-sand-100/70">{t("newsletterBody")}</p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder={t("newsletterPlaceholder")}
              className="w-full rounded-md border border-sand-100/20 bg-transparent px-3 py-2 text-sm placeholder:text-sand-100/40 focus:border-sand-300 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-sand-300 px-4 py-2 text-sm font-medium text-ink-900 transition hover:bg-sand-200"
            >
              {t("newsletterCta")}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-sand-100/10 py-5 text-center text-xs text-sand-100/50">
        © {year} Alasly. {t("rights")}
      </div>
    </footer>
  );
}
