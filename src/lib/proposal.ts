import { isAnimation, type AnimationType } from "./catalog";

export type Proposal = {
  n: string;
  q: string;
  i: string;
  g: string;
  m: string;
  a: AnimationType;
};

const NAME_MAX = 40;
const QUESTION_MAX = 120;
const NOTE_MAX = 250;

function utf8ToBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToUtf8(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function sanitizeProposal(input: {
  n: string;
  q: string;
  i: string;
  g: string;
  m: string;
  a: string;
}): Proposal | null {
  const n = input.n.trim().slice(0, NAME_MAX);
  const q = input.q.trim().slice(0, QUESTION_MAX);
  const m = input.m.trim().slice(0, NOTE_MAX);
  const i = input.i.trim();
  const g = input.g.trim();

  if (!n || !q || !i || !g || !isAnimation(input.a)) {
    return null;
  }

  return { n, q, i, g, m, a: input.a };
}

export function encodeProposal(proposal: Proposal): string {
  return utf8ToBase64Url(JSON.stringify(proposal));
}

export function decodeProposal(id: string): Proposal | null {
  try {
    const parsed = JSON.parse(base64UrlToUtf8(id)) as Partial<Proposal>;
    if (
      typeof parsed.n !== "string" ||
      typeof parsed.q !== "string" ||
      typeof parsed.i !== "string" ||
      typeof parsed.g !== "string" ||
      typeof parsed.m !== "string" ||
      typeof parsed.a !== "string"
    ) {
      return null;
    }
    return sanitizeProposal({
      n: parsed.n,
      q: parsed.q,
      i: parsed.i,
      g: parsed.g,
      m: parsed.m,
      a: parsed.a,
    });
  } catch {
    return null;
  }
}

export { NAME_MAX, QUESTION_MAX, NOTE_MAX };
