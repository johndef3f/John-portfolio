"use client";

import Reveal from "./Reveal";

// Edit these to match your actual background & toolset.
const CREATIVE_MINDSET = [
  "Storytelling",
  "Visual Research",
  "Art Direction",
  "Cinematography",
  "World-Building",
  "Concept Development",
];

const TECHNICAL_ARSENAL = [
  "Cinema 4D",
  "Blender",
  "Unreal Engine",
  "Houdini",
  "After Effects",
  "Premiere Pro",
  "Photoshop",
  "Substance 3D",
];

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full px-6 py-24 sm:px-8 md:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-container">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
            01 — About
          </p>
        </Reveal>

        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left: bio + CTA */}
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl">
                A storyteller shaped by <span className="text-accent">motion</span>, <span className="text-accent">form</span>, and <span className="text-accent">light</span>.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-fg/75 sm:text-lg">
                <p>
                  I&apos;m Paul Shen — a visual creator working at the
                  intersection of 3D, motion design, and narrative direction.
                  My practice spans product visualization, CG art, and
                  directed short-form pieces that turn abstract ideas into
                  grounded, cinematic moments.
                </p>
                <p>
                  I believe the best work starts from curiosity: reading
                  widely, researching references from film and design
                  history, and then translating those observations into
                  frames and movement. Every project is a chance to make
                  something feel a little more alive.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="group inline-flex items-center gap-3 rounded-full border border-fg/20 bg-fg/[0.03] px-6 py-3 text-sm font-medium text-fg backdrop-blur-sm transition-all hover:border-accent hover:bg-accent hover:text-bg"
                >
                  <span className="uppercase tracking-[0.15em]">
                    Download Resume
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="transition-transform group-hover:translate-y-0.5"
                  >
                    <path d="M12 5v14" />
                    <path d="m6 13 6 6 6-6" />
                  </svg>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right: skills */}
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <SkillGroup
                title="Creative Mindset"
                tags={CREATIVE_MINDSET}
              />
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-12">
                <SkillGroup
                  title="Technical Arsenal"
                  tags={TECHNICAL_ARSENAL}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillGroup({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
        {title}
      </h3>
      <ul className="mt-5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-fg/15 bg-fg/[0.02] px-3.5 py-1.5 text-xs font-medium text-fg/80 transition-colors hover:border-fg/40 hover:text-fg"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
