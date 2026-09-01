"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { YesNoButtons } from "@/components/NoButton";
import { getGif, getIcon } from "@/lib/catalog";
import type { Proposal } from "@/lib/proposal";

const CONFETTI = ["✨", "🍊", "🌙", "✦", "🌿", "☀️"];

export function ProposalView({ proposal }: { proposal: Proposal }) {
  const t = useTranslations("Proposal");
  const [saidYes, setSaidYes] = useState(false);
  const icon = getIcon(proposal.i);
  const gif = getGif(proposal.g);

  if (saidYes) {
    return (
      <section className="relative overflow-hidden px-4 py-16 text-center">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="confetti-bit"
            style={{
              left: `${(index * 5.7) % 100}%`,
              animationDelay: `${index * 0.12}s`,
            }}
          >
            {CONFETTI[index % CONFETTI.length]}
          </span>
        ))}
        <div className="celebrate-pop glass-card relative mx-auto max-w-md rounded-[2rem] px-6 py-12">
          <p className="text-5xl" aria-hidden>
            {icon.emoji}
          </p>
          <h1 className="font-display mt-4 text-4xl text-accent-deep">
            {t("celebrationTitle")}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {t("celebrationBody", { name: proposal.n })}
          </p>
          {proposal.m ? (
            <p className="mt-5 text-pretty text-base leading-relaxed text-ink">
              {proposal.m}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-lg px-4 pb-16 text-center">
      <p className="text-6xl" aria-hidden>
        {icon.emoji}
      </p>
      <h1 className="font-display mt-4 text-balance text-3xl leading-tight text-ink sm:text-4xl">
        {proposal.n}, {proposal.q}
      </h1>
      <div className="mx-auto mt-6 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gif.src}
          alt=""
          className="mx-auto h-56 w-full object-cover sm:h-64"
        />
      </div>
      <div className="mt-8">
        <YesNoButtons
          animation={proposal.a}
          yesLabel={t("yes")}
          noLabel={t("no")}
          onYes={() => setSaidYes(true)}
        />
      </div>
    </section>
  );
}
