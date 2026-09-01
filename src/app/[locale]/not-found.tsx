import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-5xl" aria-hidden>
        🌙
      </p>
      <h1 className="font-display mt-4 text-3xl text-ink">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("body")}</p>
      <Link
        href="/"
        className="btn-yes mt-6 rounded-full px-6 py-3 text-sm font-extrabold text-white"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
