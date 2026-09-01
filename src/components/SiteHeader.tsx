import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-sm font-extrabold text-white shadow-sm">
          W
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Willo
          </span>
          <span className="hidden text-[11px] text-muted sm:inline">
            {t("tagline")}
          </span>
        </span>
      </Link>
      <LanguageSwitcher />
    </header>
  );
}
