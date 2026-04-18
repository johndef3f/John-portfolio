"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { works, type Category, type Work } from "@/data/works";
import WorkCard from "./WorkCard";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";

type Filter = "all" | Category;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "3d", label: "3D & CG Arts" },
  { id: "directing", label: "Directing & Post" },
  { id: "narrative", label: "Visual Narrative" },
];

export default function WorksGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Work | null>(null);

  const filtered =
    filter === "all" ? works : works.filter((w) => w.category === filter);

  return (
    <section
      id="works"
      className="mx-auto max-w-container px-6 py-20 sm:py-28 md:px-10"
    >
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-4xl font-semibold tracking-tight text-fg md:text-6xl">
            Selected Works
          </h2>
          <p className="text-sm text-fg/60">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </Reveal>

      {/* Filter pills */}
      <Reveal delay={0.05}>
        <div
          role="tablist"
          aria-label="Filter works"
          className="mt-8 flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition ${
                  active
                    ? "border-accent bg-accent text-black"
                    : "border-white/15 bg-white/[0.03] text-fg/75 hover:border-white/30 hover:text-fg"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Grid – Framer Motion layout for reshuffle, no display:none */}
      <motion.ul
        layout
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((w) => (
            <motion.li
              key={w.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <WorkCard work={w} onOpen={setActive} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Lightbox work={active} onClose={() => setActive(null)} />
    </section>
  );
}
