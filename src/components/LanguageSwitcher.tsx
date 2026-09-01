"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Lang");

  return (
    <div
      className="flex items-center rounded-full bg-white/70 p-1 shadow-sm ring-1 ring-line"
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => {
              const query = window.location.search;
              router.replace(`${pathname}${query}`, { locale: code });
            }}
            className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide transition ${
              active
                ? "bg-accent text-white"
                : "text-muted active:text-ink sm:hover:text-ink"
            }`}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
