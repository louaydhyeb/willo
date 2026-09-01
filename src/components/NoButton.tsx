"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { AnimationType } from "@/lib/catalog";

type YesNoButtonsProps = {
  animation: AnimationType;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
};

const BUTTON_W = 120;
const BUTTON_H = 52;
const YES_SAFE = 76;
const FINE_PROXIMITY = 140;
const COARSE_PROXIMITY = 78;

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return coarse;
}

function clampOffset(
  x: number,
  y: number,
  arenaWidth: number,
  arenaHeight: number,
  width: number,
  height: number,
) {
  const maxX = Math.max(8, arenaWidth - width - 8);
  const maxY = Math.max(YES_SAFE, arenaHeight - height - 8);
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(YES_SAFE, y), maxY),
  };
}

function oppositePoint(
  pointerX: number,
  pointerY: number,
  arenaWidth: number,
  arenaHeight: number,
  width: number,
  height: number,
) {
  const maxX = Math.max(8, arenaWidth - width - 8);
  const maxY = Math.max(YES_SAFE, arenaHeight - height - 8);
  const preferRight = pointerX < arenaWidth / 2;
  const preferBottom = pointerY < (YES_SAFE + arenaHeight) / 2;
  const x = preferRight
    ? maxX - Math.random() * Math.min(maxX * 0.28, 64)
    : 8 + Math.random() * Math.min(maxX * 0.28, 64);
  const y = preferBottom
    ? maxY - Math.random() * Math.min((maxY - YES_SAFE) * 0.28, 48)
    : YES_SAFE + Math.random() * Math.min((maxY - YES_SAFE) * 0.28, 48);
  return clampOffset(x, y, arenaWidth, arenaHeight, width, height);
}

function hitTest(
  node: HTMLElement | null,
  x: number,
  y: number,
  pad = 10,
) {
  if (!node) return false;
  const box = node.getBoundingClientRect();
  return (
    x >= box.left - pad &&
    x <= box.right + pad &&
    y >= box.top - pad &&
    y <= box.bottom + pad
  );
}

function pulse() {
  try {
    navigator.vibrate?.(10);
  } catch {
    /* haptic is optional */
  }
}

export function YesNoButtons({
  animation,
  yesLabel,
  noLabel,
  onYes,
}: YesNoButtonsProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef({ x: 200, y: 120 });
  const lastNoAt = useRef(0);
  const coarse = useCoarsePointer();
  const [swapped, setSwapped] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 200, y: 120 });

  useLayoutEffect(() => {
    if (animation !== "evader") return;
    const arena = arenaRef.current;
    if (!arena) return;

    const width = noRef.current?.offsetWidth ?? BUTTON_W;
    const height = noRef.current?.offsetHeight ?? BUTTON_H;
    const start = clampOffset(
      arena.clientWidth * 0.58,
      arena.clientHeight * 0.58,
      arena.clientWidth,
      arena.clientHeight,
      width,
      height,
    );
    offsetRef.current = start;
    setOffset(start);

    const keepInBounds = () => {
      const next = clampOffset(
        offsetRef.current.x,
        offsetRef.current.y,
        arena.clientWidth,
        arena.clientHeight,
        noRef.current?.offsetWidth ?? BUTTON_W,
        noRef.current?.offsetHeight ?? BUTTON_H,
      );
      offsetRef.current = next;
      setOffset(next);
    };

    const observer = new ResizeObserver(keepInBounds);
    observer.observe(arena);
    return () => observer.disconnect();
  }, [animation]);

  useEffect(() => {
    if (animation !== "evader") return;
    const arena = arenaRef.current;
    if (!arena) return;
    const playArea: HTMLDivElement = arena;

    const proximity = window.matchMedia("(pointer: coarse)").matches
      ? COARSE_PROXIMITY
      : FINE_PROXIMITY;

    function flee(clientX: number, clientY: number, force = false) {
      const box = playArea.getBoundingClientRect();
      const button = noRef.current;
      const width = button?.offsetWidth ?? BUTTON_W;
      const height = button?.offsetHeight ?? BUTTON_H;
      const current = offsetRef.current;
      const centerX = box.left + current.x + width / 2;
      const centerY = box.top + current.y + height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);
      if (!force && distance > proximity) return false;

      let next = oppositePoint(
        clientX - box.left,
        clientY - box.top,
        box.width,
        box.height,
        width,
        height,
      );
      const nextCenterX = box.left + next.x + width / 2;
      const nextCenterY = box.top + next.y + height / 2;
      if (Math.hypot(clientX - nextCenterX, clientY - nextCenterY) < proximity) {
        next = oppositePoint(
          clientX - box.left + 80,
          clientY - box.top + 80,
          box.width,
          box.height,
          width,
          height,
        );
      }
      offsetRef.current = next;
      setOffset(next);
      if (window.matchMedia("(pointer: coarse)").matches) pulse();
      return true;
    }

    function onMouseMove(event: MouseEvent) {
      flee(event.clientX, event.clientY);
    }

    function onTouch(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      if (hitTest(yesRef.current, touch.clientX, touch.clientY)) return;

      const reached = flee(touch.clientX, touch.clientY);
      if (reached) event.preventDefault();
    }

    window.addEventListener("mousemove", onMouseMove);
    playArea.addEventListener("touchstart", onTouch, { passive: false });
    playArea.addEventListener("touchmove", onTouch, { passive: false });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      playArea.removeEventListener("touchstart", onTouch);
      playArea.removeEventListener("touchmove", onTouch);
    };
  }, [animation]);

  function handleNoInteract(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();

    const now = performance.now();
    if (now - lastNoAt.current < 220) return;
    lastNoAt.current = now;

    if (animation === "teleporter") {
      setSwapped((value) => !value);
      if (coarse) pulse();
      return;
    }

    if (animation === "shrinker") {
      setScale((value) => Math.max(coarse ? 0.34 : 0.22, value * 0.72));
      if (coarse) pulse();
    }
  }

  const yesButton = (
    <button
      ref={yesRef}
      type="button"
      onClick={onYes}
      className="btn-yes relative z-20 min-h-12 min-w-[120px] rounded-full px-8 py-3 text-lg font-extrabold text-white"
    >
      {yesLabel}
    </button>
  );

  const noButton = (
    <button
      ref={noRef}
      type="button"
      tabIndex={animation === "evader" ? -1 : 0}
      onMouseEnter={
        !coarse && animation !== "evader" ? handleNoInteract : undefined
      }
      onPointerDown={(event) => {
        if (animation === "evader") {
          event.preventDefault();
          return;
        }
        if (event.pointerType === "mouse") return;
        handleNoInteract(event);
      }}
      onClick={(event) => {
        if (animation === "evader" || coarse) {
          event.preventDefault();
          return;
        }
        handleNoInteract(event);
      }}
      style={
        animation === "evader"
          ? {
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
            }
          : animation === "shrinker"
            ? { transform: `scale(${scale})` }
            : undefined
      }
      className={`btn-no select-none rounded-full px-8 py-3 text-lg font-extrabold ${
        animation === "evader"
          ? "pointer-events-none absolute top-0 left-0 z-10 will-change-transform"
          : "touch-manipulation"
      }`}
    >
      {noLabel}
    </button>
  );

  if (animation === "evader") {
    return (
      <div
        ref={arenaRef}
        className="relative mx-auto h-[min(52dvh,400px)] min-h-[280px] w-full max-w-lg sm:h-[320px] sm:min-h-0"
      >
        <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
          {yesButton}
        </div>
        {noButton}
      </div>
    );
  }

  return (
    <div
      ref={arenaRef}
      className="relative mx-auto flex min-h-[220px] w-full max-w-md items-center justify-center gap-3 sm:gap-4"
    >
      {swapped ? (
        <>
          {noButton}
          {yesButton}
        </>
      ) : (
        <>
          {yesButton}
          {noButton}
        </>
      )}
    </div>
  );
}
