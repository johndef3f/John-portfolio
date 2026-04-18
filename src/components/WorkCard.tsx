"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Work } from "@/data/works";

type Props = {
  work: Work;
  onOpen: (w: Work) => void;
};

export default function WorkCard({ work, onOpen }: Props) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    setHovered(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {
        /* autoplay blocked – fall back to still */
      });
    }
  };
  const onLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (v) v.pause();
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(work)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      data-cursor="play"
      aria-label={`Open ${work.title}`}
      className="group relative block w-full overflow-hidden rounded-lg bg-[#111] text-left ring-1 ring-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {/* Still thumbnail */}
        <Image
          src={work.thumbnail}
          alt={work.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-[transform,opacity] duration-[600ms] ease-out ${
            hovered && work.isStatic ? "ken-burns" : ""
          } ${hovered && work.preview ? "opacity-0" : "opacity-100"}`}
          priority={false}
        />

        {/* Hover preview video for motion works */}
        {work.preview && (
          <video
            ref={videoRef}
            src={work.preview}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Subtle corner badge for category */}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-fg/80 backdrop-blur-sm">
          {work.category === "3d"
            ? "3D · CG"
            : work.category === "directing"
              ? "Directing"
              : "Narrative"}
        </span>
      </div>

      {/* Info overlay – visible on hover / focus */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 py-4 transition-all duration-300 sm:px-5 sm:py-5 ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <h3 className="text-base font-semibold tracking-tight text-fg sm:text-lg">
          {work.title}
        </h3>
        {work.role && (
          <p className="mt-0.5 text-xs text-fg/70 sm:text-sm">{work.role}</p>
        )}
        {work.software.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {work.software.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-fg/80 sm:text-[11px]"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
