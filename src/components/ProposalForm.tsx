"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ANIMATIONS, GIFS, ICONS, type AnimationType } from "@/lib/catalog";
import {
  encodeProposal,
  NOTE_MAX,
  sanitizeProposal,
} from "@/lib/proposal";
import { useRouter } from "@/i18n/navigation";

export function ProposalForm() {
  const t = useTranslations("Form");
  const router = useRouter();
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [icon, setIcon] = useState("hearts");
  const [gif, setGif] = useState("hearts");
  const [note, setNote] = useState("");
  const [animation, setAnimation] = useState<AnimationType>("evader");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const proposal = sanitizeProposal({
      n: name,
      q: question,
      i: icon,
      g: gif,
      m: note,
      a: animation,
    });

    if (!proposal) {
      setError(!name.trim() ? t("errorName") : t("errorQuestion"));
      return;
    }

    const id = encodeProposal(proposal);
    router.push(`/p?d=${encodeURIComponent(id)}&created=1`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-bold text-ink">{t("theirName")}</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
          placeholder={t("theirNamePlaceholder")}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none ring-accent/40 transition focus:ring-2"
          autoComplete="off"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-bold text-ink">{t("question")}</span>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={120}
          placeholder={t("questionPlaceholder")}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none ring-accent/40 transition focus:ring-2"
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-ink">{t("icon")}</legend>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {ICONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIcon(item.id)}
              data-selected={icon === item.id}
              className="icon-tile flex min-h-[72px] flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 text-center shadow-sm ring-1 ring-line transition active:scale-[0.97] sm:hover:-translate-y-0.5"
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <span className="text-[11px] font-semibold text-muted">
                {t(`icons.${item.id}`)}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-ink">{t("gif")}</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {GIFS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setGif(item.id)}
              data-selected={gif === item.id}
              className="gif-tile overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line transition active:scale-[0.98]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={t(`gifs.${item.id}`)}
                className="h-20 w-full object-cover sm:h-24"
              />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-2">
        <span className="flex items-center justify-between text-sm font-bold text-ink">
          {t("note")}
          <span className="font-medium text-muted">
            {t("noteCount", { count: note.length })}
          </span>
        </span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value.slice(0, NOTE_MAX))}
          maxLength={NOTE_MAX}
          rows={3}
          placeholder={t("notePlaceholder")}
          className="w-full resize-none rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none ring-accent/40 transition focus:ring-2"
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-ink">{t("animation")}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {ANIMATIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAnimation(item)}
              data-selected={animation === item}
              className="anim-tile min-h-[72px] rounded-2xl bg-white px-3 py-3 text-left shadow-sm ring-1 ring-line transition active:scale-[0.98]"
            >
              <div className="text-sm font-bold">{t(item)}</div>
              <div className="mt-1 text-xs text-muted">{t(`${item}Hint`)}</div>
            </button>
          ))}
        </div>
      </fieldset>

      {error ? <p className="text-sm font-semibold text-accent-deep">{error}</p> : null}

      <button
        type="submit"
        className="btn-yes w-full rounded-full py-3.5 text-base font-extrabold text-white sm:hover:brightness-105"
      >
        {t("submit")}
      </button>
    </form>
  );
}
