import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ProposalPageClient } from "@/components/ProposalPageClient";
import type { AppLocale } from "@/i18n/routing";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  return (
    <Suspense
      fallback={
        <p className="px-6 py-16 text-center text-sm text-muted">Willo…</p>
      }
    >
      <ProposalPageClient />
    </Suspense>
  );
}
