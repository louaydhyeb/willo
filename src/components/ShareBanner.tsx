"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ShareBanner() {
  const t = useTranslations("Share");
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.delete("created");
    const url = shareUrl.toString();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("copy"), url);
    }
  }

  return (
    <div className="glass-card mx-auto mb-6 w-full max-w-lg rounded-3xl px-5 py-4 text-center">
      <p className="font-display text-xl text-accent-deep">{t("title")}</p>
      <p className="mt-1 text-sm text-muted">{t("hint")}</p>
      <p className="mt-2 text-xs text-muted">{t("preview")}</p>
      <button
        type="button"
        onClick={copyLink}
        className="btn-yes mt-3 rounded-full px-5 py-2 text-sm font-extrabold text-white"
      >
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}
