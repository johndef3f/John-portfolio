"use client";

import { useEffect, useState } from "react";

const SHOWREEL_YT_ID = "JFbh9ymqGMk"; // <- replace with your real YouTube video ID

const ytSrc = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}` +
  `?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1` +
  `&rel=0&showinfo=0&playsinline=1&disablekb=1&iv_load_policy=3` +
  `&playlist=${id}`;

export default function HeroShowreel({
  name = "沈習約",
  tagline = "Crafting Stories through 3D & Motion",
}: {
  name?: string;
  tagline?: string;
}) {
  const [hasReal, setHasReal] = useState(false);

  useEffect(() => {
    setHasReal(SHOWREEL_YT_ID !== "SHOWREEL_YT_ID");
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        {hasReal ? (
          <iframe
            title="Showreel"
            src={ytSrc(SHOWREEL_YT_ID)}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            tabIndex={-1}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 30% 20%, rgba(255,69,0,0.18), transparent 60%)," +
                "radial-gradient(60% 80% at 80% 70%, rgba(120,80,255,0.10), transparent 60%)," +
                "linear-gradient(180deg, #0a0a0a 0%, #060606 100%)",
            }}
          />
        )}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="text-balance font-sans text-5xl font-semibold tracking-tight text-fg sm:text-7xl md:text-8xl lg:text-[120px] lg:leading-[0.95]">
          {name}
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-base text-fg/75 sm:text-lg md:text-xl">
          {tagline}
        </p>
        {!hasReal && (
          <p className="mt-3 inline-block rounded-full border border-fg/15 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-fg/50">
            Showreel placeholder · set SHOWREEL_YT_ID in HeroShowreel.tsx
          </p>
        )}
      </div>

      <a
        href="#works"
        aria-label="Scroll to works"
        className="scroll-hint absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-fg/70 transition-colors hover:text-fg"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 5v14" />
          <path d="m6 13 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
