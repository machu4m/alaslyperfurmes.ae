"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { localize, type Gender, type Locale } from "@/lib/types";
import type { ScentFamily } from "@/lib/types";
import { cx } from "@/lib/utils";

const GENDERS: Gender[] = ["men", "women", "unisex"];
const SIZES = [30, 50, 100];

export function Filters({ scentFamilies }: { scentFamilies: ScentFamily[] }) {
  const t = useTranslations("shop.filters");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const gender = searchParams.get("gender");
  const scentFamily = searchParams.get("scentFamily");
  const size = searchParams.get("size");

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters = Boolean(gender || scentFamily || size);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest2 text-ink-900">
          {t("title")}
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-oud-500 hover:underline"
          >
            {t("clearAll")}
          </button>
        )}
      </div>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          {t("gender")}
        </legend>
        <div className="mt-3 space-y-2">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="radio"
                name="gender"
                checked={gender === g}
                onChange={() => setParam("gender", gender === g ? null : g)}
                className="h-4 w-4 accent-oud-500"
              />
              {t(`gender${g[0]!.toUpperCase()}${g.slice(1)}` as "genderMen")}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          {t("scentFamily")}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {scentFamilies.map((sf) => (
            <button
              key={sf.id}
              type="button"
              onClick={() =>
                setParam("scentFamily", scentFamily === sf.slug ? null : sf.slug)
              }
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                scentFamily === sf.slug
                  ? "border-oud-500 bg-oud-500 text-white"
                  : "border-ink-900/15 text-ink-700 hover:border-oud-500"
              )}
            >
              {localize(locale, sf.name_en, sf.name_ar)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          {t("size")}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setParam("size", size === String(s) ? null : String(s))}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                size === String(s)
                  ? "border-oud-500 bg-oud-500 text-white"
                  : "border-ink-900/15 text-ink-700 hover:border-oud-500"
              )}
            >
              {s}ml
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
