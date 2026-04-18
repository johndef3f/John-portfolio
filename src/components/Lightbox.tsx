"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Work } from "@/data/works";

type Props = {
  work: Work | null;
  onClose: () => void;
};

const ytEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}` +
  `?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

export default function Lightbox({ work, onClose }: Props) {
  const [idx, setIdx] = useState(0);

  // Images: cover + gallery, flattened for static works
  const images = useMemo(() => {
    if (!work) return [];
    if (!work.isStatic) return [];
    return [work.thumbnail, ...(work.gallery ?? [])];
  }, [work]);

  // Reset to first image whenever work changes
  useEffect(() => {
    setIdx(0);
  }, [work]);

  // Keyboard: ESC to close, ← → to navigate
  useEffect(() => {
    if (!work) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (images.length > 1) {
        if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
        if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [work, images.length, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!work) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [work]);

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          key={work.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={work.title}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-fg/80 transition hover:text-fg"
          >
            Close · Esc
          </button>

          {/* Content – stopPropagation so inner clicks don't close */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[1200px] px-4 sm:px-8"
          >
            {/* Media surface */}
            <div className="relative w-full overflow-hidden rounded-lg bg-black shadow-2xl">
              {!work.isStatic && work.youtubeId ? (
                <div className="relative aspect-video w-full">
                  <iframe
                    src={ytEmbed(work.youtubeId)}
                    title={work.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ) : !work.isStatic && work.localVideo ? (
                <div className="relative aspect-video w-full">
                  <video
                    src={work.localVideo}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full bg-black"
                  />
                </div>
              ) : (
                <div className="relative w-full">
                  <div className="relative mx-auto aspect-video max-h-[80vh] w-full">
                    <Image
                      src={images[idx] ?? work.thumbnail}
                      alt={`${work.title} ${idx + 1}`}
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="object-contain"
                      priority
                    />
                  </div>
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                        aria-label="Previous"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-fg/80 transition hover:text-fg sm:left-4"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      </button>
                      <button
                        onClick={() => setIdx((i) => (i + 1) % images.length)}
                        aria-label="Next"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-fg/80 transition hover:text-fg sm:right-4"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-fg/80">
                        {idx + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-fg/75">
              <h3 className="text-lg font-semibold text-fg sm:text-xl">{work.title}</h3>
              {work.role && <span className="text-sm">{work.role}</span>}
              {work.year ? <span className="text-sm text-fg/50">· {work.year}</span> : null}
              {work.software.length > 0 && (
                <span className="text-sm text-fg/60">
                  · {work.software.join(" / ")}
                </span>
              )}
            </div>

            {/* Hint about placeholder video when only local mp4 is available */}
            {!work.isStatic && !work.youtubeId && work.localVideo && (
              <p className="mt-1 text-xs text-fg/40">
                Local preview — set <code className="text-fg/70">youtubeId</code> in src/data/works.ts to use YouTube in production.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
