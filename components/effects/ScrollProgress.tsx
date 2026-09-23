"use client";

import { motion, useSpring, useTransform, useScroll } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Scroll progress — a filament across the top plus a moving glow.    */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.25 });
  const glowLeft = useTransform(scaleX, (v) => `${v * 100}%`);

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[3px]">
      <motion.div
        style={{ scaleX }}
        className="h-full origin-left bg-gradient-to-r from-accent via-accent-2-light to-accent"
      />
      <motion.div
        style={{ left: glowLeft }}
        className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/60 blur-md"
      />
    </div>
  );
}
