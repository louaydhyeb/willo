import { getTranslations, setRequestLocale } from "next-intl/server";
import { GlowField } from "@/components/GlowField";
import { ProposalForm } from "@/components/ProposalForm";
import type { AppLocale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations("Home");

  return (
    <div className="relative">
      <GlowField />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <section className="mx-auto max-w-2xl py-6 text-center sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-deep">
            {t("eyebrow")}
          </p>
          <h1 className="font-display mt-3 text-balance text-4xl text-ink sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </section>

        <section className="glass-card mx-auto max-w-2xl rounded-[2rem] p-5 sm:p-8">
          <ProposalForm />
        </section>

        <section className="mx-auto mt-14 max-w-3xl">
          <h2 className="font-display text-center text-2xl text-ink">
            {t("howTitle")}
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((step) => (
              <li
                key={step}
                className="rounded-3xl bg-white/70 px-4 py-4 ring-1 ring-line"
              >
                <div className="text-xs font-extrabold text-accent-deep">
                  0{step}
                </div>
                <h3 className="mt-1 font-bold">
                  {t(`step${step}Title` as "step1Title")}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {t(`step${step}Body` as "step1Body")}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
