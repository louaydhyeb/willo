"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { AnimationType } from "@/lib/catalog";

type YesNoButtonsProps = {
  animation: AnimationType;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
};

const PROXIMITY = 140;
const BUTTON_W = 120;
const BUTTON_H = 52;

function oppositePoint(
  pointerX: number,
  pointerY: number,
  arenaWidth: number,
  arenaHeight: number,
) {
  const maxX = Math.max(8, arenaWidth - BUTTON_W - 8);
  const maxY = Math.max(8, arenaHeight - BUTTON_H - 8);
  const preferRight = pointerX < arenaWidth / 2;
  const preferBottom = pointerY < arenaHeight / 2;
  const x = preferRight
    ? maxX - Math.random() * Math.min(maxX * 0.28, 64)
    : 8 + Math.random() * Math.min(maxX * 0.28, 64);
  const y = preferBottom
    ? maxY - Math.random() * Math.min(maxY * 0.28, 48)
    : 8 + Math.random() * Math.min(maxY * 0.28, 48);
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  };
}

export function YesNoButtons({
  animation,
  yesLabel,
  noLabel,
  onYes,
}: YesNoButtonsProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef({ x: 200, y: 90 });
  const [swapped, setSwapped] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 200, y: 90 });

  useLayoutEffect(() => {
    if (animation !== "evader") return;
    const arena = arenaRef.current;
    if (!arena) return;
    const next = {
      x: Math.min(arena.clientWidth - BUTTON_W - 20, Math.max(160, arena.clientWidth * 0.62)),
      y: 88,
    };
    offsetRef.current = next;
    setOffset(next);
  }, [animation]);

  useEffect(() => {
    if (animation !== "evader") return;
    const arena = arenaRef.current;
    if (!arena) return;
    const playArea = arena;

    function flee(clientX: number, clientY: number, force = false) {
      const box = playArea.getBoundingClientRect();
      const button = noRef.current;
      const width = button?.offsetWidth ?? BUTTON_W;
      const height = button?.offsetHeight ?? BUTTON_H;
      const current = offsetRef.current;
      const centerX = box.left + current.x + width / 2;
      const centerY = box.top + current.y + height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);
      if (!force && distance > PROXIMITY) return;

      let next = oppositePoint(
        clientX - box.left,
        clientY - box.top,
        box.width,
        box.height,
      );
      const nextCenterX = box.left + next.x + width / 2;
      const nextCenterY = box.top + next.y + height / 2;
      if (Math.hypot(clientX - nextCenterX, clientY - nextCenterY) < PROXIMITY) {
        next = oppositePoint(
          clientX - box.left + 80,
          clientY - box.top + 80,
          box.width,
          box.height,
        );
      }
      offsetRef.current = next;
      setOffset(next);
    }

    function onMouseMove(event: MouseEvent) {
      flee(event.clientX, event.clientY);
    }

    function onTouch(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      const box = playArea.getBoundingClientRect();
      const current = offsetRef.current;
      const width = noRef.current?.offsetWidth ?? BUTTON_W;
      const height = noRef.current?.offsetHeight ?? BUTTON_H;
      const centerX = box.left + current.x + width / 2;
      const centerY = box.top + current.y + height / 2;
      const distance = Math.hypot(touch.clientX - centerX, touch.clientY - centerY);
      if (distance <= PROXIMITY + 40) {
        event.preventDefault();
        flee(touch.clientX, touch.clientY, true);
      }
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

  function handleNoInteract(
    event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (animation === "teleporter") {
      setSwapped((value) => !value);
      return;
    }

    if (animation === "shrinker") {
      setScale((value) => Math.max(0.22, value * 0.72));
    }
  }

  const yesButton = (
    <button
      type="button"
      onClick={onYes}
      className="btn-yes relative z-10 min-w-[108px] rounded-full px-8 py-3 text-lg font-extrabold text-white"
    >
      {yesLabel}
    </button>
  );

  const noButton = (
    <button
      ref={noRef}
      type="button"
      tabIndex={animation === "evader" ? -1 : 0}
      onMouseEnter={animation === "evader" ? undefined : handleNoInteract}
      onTouchStart={animation === "evader" ? undefined : handleNoInteract}
      onClick={
        animation === "evader"
          ? (event) => event.preventDefault()
          : handleNoInteract
      }
      style={
        animation === "evader"
          ? { position: "absolute", left: offset.x, top: offset.y }
          : animation === "shrinker"
            ? { transform: `scale(${scale})` }
            : undefined
      }
      className={`btn-no rounded-full px-8 py-3 text-lg font-extrabold ${
        animation === "evader"
          ? "pointer-events-none select-none"
          : "touch-none transition-transform duration-150"
      }`}
    >
      {noLabel}
    </button>
  );

  if (animation === "evader") {
    return (
      <div
        ref={arenaRef}
        className="relative mx-auto h-[280px] w-full max-w-lg touch-none sm:h-[320px]"
      >
        <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2">
          {yesButton}
        </div>
        {noButton}
      </div>
    );
  }

  return (
    <div
      ref={arenaRef}
      className="relative mx-auto flex min-h-[220px] w-full max-w-md items-center justify-center gap-4"
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
