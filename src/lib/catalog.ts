export const ICONS = [
  { id: "kiss", emoji: "💋" },
  { id: "note", emoji: "💌" },
  { id: "hearts", emoji: "💕" },
  { id: "fly", emoji: "🦋" },
  { id: "penguin", emoji: "🐧" },
  { id: "xoxo", emoji: "😘" },
  { id: "alien", emoji: "👽" },
  { id: "cat", emoji: "🐱" },
  { id: "bear", emoji: "🧸" },
  { id: "rose", emoji: "🌹" },
  { id: "seal", emoji: "🦭" },
  { id: "sparkle", emoji: "✨" },
] as const;

export const GIFS = [
  {
    id: "hearts",
    src: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
  },
  {
    id: "kiss",
    src: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  },
  {
    id: "bear",
    src: "https://media.giphy.com/media/l0MYt5zkw82nCg86k/giphy.gif",
  },
  {
    id: "penguin",
    src: "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif",
  },
  {
    id: "cat",
    src: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  },
  {
    id: "love",
    src: "https://media.giphy.com/media/3o6ZtpxSZbQRRdwS88/giphy.gif",
  },
  {
    id: "blush",
    src: "https://media.giphy.com/media/Y4p7tK5kUGBW/giphy.gif",
  },
  {
    id: "flowers",
    src: "https://media.giphy.com/media/l4FGuhL4U2WyjdKA/giphy.gif",
  },
  {
    id: "dance",
    src: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
  },
  {
    id: "hug",
    src: "https://media.giphy.com/media/l41lI4bYmcsPJX027/giphy.gif",
  },
  {
    id: "sparkle",
    src: "https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif",
  },
  {
    id: "puppy",
    src: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  },
] as const;

export type IconId = (typeof ICONS)[number]["id"];
export type GifId = (typeof GIFS)[number]["id"];
export type AnimationType = "teleporter" | "shrinker" | "evader";

export const ANIMATIONS: AnimationType[] = [
  "teleporter",
  "shrinker",
  "evader",
];

export function getIcon(id: string) {
  return ICONS.find((icon) => icon.id === id) ?? ICONS[2];
}

export function getGif(id: string) {
  return GIFS.find((gif) => gif.id === id) ?? GIFS[0];
}

export function isAnimation(value: string): value is AnimationType {
  return ANIMATIONS.includes(value as AnimationType);
}
