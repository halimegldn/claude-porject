"use client";

import { motion } from "framer-motion";
import { TONE_CLASSES, TOPICS_TICKER } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Topics marquee — one steady, unhurried loop. Coupling the speed to  */
/*  scroll velocity made the strip lurch and change direction under     */
/*  the reader, so it runs at a constant rate instead.                  */
/* ------------------------------------------------------------------ */

export function Marquee() {
  const loop = [...TOPICS_TICKER, ...TOPICS_TICKER];

  return (
    <section className="relative overflow-hidden border-y border-foreground/5 bg-foreground/[0.015] py-6">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
        className="mask-fade-x flex w-max items-center gap-10 whitespace-nowrap"
      >
        {loop.map((topic, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm tracking-[0.2em] text-foreground/30"
          >
            {topic}
            <span className={i % 2 === 0 ? TONE_CLASSES.accent.dot : TONE_CLASSES.pop.dot}>
              •
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
