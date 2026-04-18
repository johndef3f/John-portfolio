"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<null | "play" | "link">(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let rafId = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest(
        '[data-cursor="play"], a, button',
      ) as HTMLElement | null;
      if (!t) return setHover(null);
      const c = t.dataset.cursor;
      if (c === "play") setHover("play");
      else setHover("link");
    };
    const onLeave = () => setHover(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{
          transition: "opacity 150ms",
          opacity: hover === "play" ? 0 : 1,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border border-white/80 text-[10px] font-semibold uppercase tracking-[0.15em] text-white"
        style={{
          width: hover === "play" ? 64 : hover === "link" ? 32 : 0,
          height: hover === "play" ? 64 : hover === "link" ? 32 : 0,
          opacity: hover ? 1 : 0,
          transition:
            "width 200ms cubic-bezier(.2,.8,.2,1), height 200ms cubic-bezier(.2,.8,.2,1), opacity 150ms",
          backdropFilter: "blur(2px)",
        }}
      >
        {hover === "play" ? "PLAY" : ""}
      </div>
    </>
  );
}
