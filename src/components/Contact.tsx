"use client";

import { useState } from "react";
import Reveal from "./Reveal";

// Edit these to your real handles.
const EMAIL = "johnshen200695@gmail.com";

const SOCIALS: { label: string; href: string; icon: JSX.Element }[] = [
  {
    label: "ArtStation",
    href: "https://www.artstation.com/your-handle",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
        <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zM14.105 14.314L9.072 5.566l-5.04 8.748h10.073z" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "https://www.behance.net/your-handle",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
        <path d="M7.803 5.731c.589 0 1.119.051 1.605.155.483.103.895.273 1.243.508.343.235.611.547.804.939.187.387.281.871.281 1.443 0 .619-.141 1.137-.421 1.551-.284.413-.7.751-1.255 1.014.757.215 1.319.594 1.69 1.129.37.535.553 1.183.553 1.936 0 .609-.119 1.13-.354 1.575a3.203 3.203 0 0 1-.969 1.099c-.407.288-.875.494-1.4.633a6.195 6.195 0 0 1-1.614.211H2V5.731h5.803zm-.35 4.895c.48 0 .878-.116 1.192-.345.312-.228.463-.604.463-1.117 0-.287-.051-.52-.152-.702a1.115 1.115 0 0 0-.416-.44 1.712 1.712 0 0 0-.596-.22 3.708 3.708 0 0 0-.707-.065H4.57v2.889h2.883zm.158 5.14c.267 0 .521-.028.759-.078.236-.05.448-.134.625-.246.177-.115.318-.27.422-.463.107-.19.162-.438.162-.742 0-.594-.167-1.018-.5-1.272-.334-.254-.776-.38-1.325-.38h-3.18v3.181h3.037zm10.247-.05c.348.336.85.506 1.5.506.466 0 .87-.117 1.201-.351.332-.234.536-.48.609-.74h2.264c-.361 1.122-.918 1.922-1.664 2.408-.748.481-1.655.72-2.715.72-.736 0-1.398-.117-1.992-.354a4.17 4.17 0 0 1-1.503-1.006 4.526 4.526 0 0 1-.951-1.557 5.54 5.54 0 0 1-.334-1.966c0-.686.114-1.324.344-1.91a4.628 4.628 0 0 1 .972-1.543c.422-.436.918-.779 1.502-1.029a4.923 4.923 0 0 1 1.963-.375c.824 0 1.544.162 2.158.478.612.321 1.115.748 1.51 1.285.39.537.67 1.149.832 1.833.16.687.219 1.408.174 2.157H17.13c0 .738.175 1.338.529 1.708zm2.608-4.675c-.277-.305-.743-.469-1.32-.469-.378 0-.693.064-.941.194a2.029 2.029 0 0 0-.597.446 1.607 1.607 0 0 0-.316.58 2.496 2.496 0 0 0-.11.576h4.023c-.057-.607-.268-1.054-.739-1.327zM15.641 6.217h5.664v1.378h-5.664V6.217z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/your-handle",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@your-handle",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (rare); silently fail.
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full px-6 py-28 sm:px-8 md:py-36 lg:px-12"
    >
      <div className="mx-auto flex max-w-container flex-col items-center text-center">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
            02 — Contact
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl">
            Let&apos;s create something <span className="text-accent">together</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-balance text-base text-fg/70 sm:text-lg">
            Open to internships, collaborations, and creative projects in 3D,
            motion, and visual narrative.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-12">
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="link"
              aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
              className="group relative inline-flex items-center gap-3 rounded-full border border-fg/20 bg-fg/[0.03] px-7 py-4 text-base font-medium text-fg backdrop-blur-sm transition-all hover:border-accent hover:bg-accent hover:text-bg sm:text-lg"
            >
              <span className="font-mono tracking-tight">{EMAIL}</span>
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center text-fg/60 transition-colors group-hover:text-bg"
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </span>
              <span
                aria-live="polite"
                className={`pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] transition-opacity ${
                  copied ? "text-accent opacity-100" : "opacity-0"
                }`}
              >
                Copied to clipboard
              </span>
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <ul className="mt-20 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor="link"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-fg/15 bg-fg/[0.02] text-fg/70 transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-bg sm:h-14 sm:w-14"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
