"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProposalView } from "@/components/ProposalView";
import { ShareBanner } from "@/components/ShareBanner";
import { Link } from "@/i18n/navigation";
import { decodeProposal } from "@/lib/proposal";

export function ProposalPageClient() {
  const searchParams = useSearchParams();
  const t = useTranslations("Proposal");
  const payload = searchParams.get("d");
  const created = searchParams.get("created");
  const proposal = payload ? decodeProposal(payload) : null;

  if (!proposal) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted">{t("invalid")}</p>
        <Link
          href="/"
          className="btn-yes mt-6 inline-flex rounded-full px-6 py-3 text-sm font-extrabold text-white"
        >
          {t("backHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2">
      {created === "1" ? <ShareBanner /> : null}
      <ProposalView proposal={proposal} />
    </div>
  );
}
