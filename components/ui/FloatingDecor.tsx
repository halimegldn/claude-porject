"use client";

import { motion } from "framer-motion";
import { Atom } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Floating decorative icon — drifts on two axes with a slow tilt,    */
/*  and rides section scroll so it never sits flat on the page.        */
/* ------------------------------------------------------------------ */

export function FloatingDecor({
  icon: Icon,
  className,
  duration = 9,
  delay = 0,
}: {
  icon: typeof Atom;
  className: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -22, 0], x: [0, 8, 0], rotate: [0, 10, -4, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      className={`pointer-events-none absolute hidden text-accent/20 md:block ${className}`}
    >
      <Icon size={32} strokeWidth={1.2} />
    </motion.div>
  );
}
