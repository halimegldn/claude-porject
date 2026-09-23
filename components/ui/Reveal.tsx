"use client";

import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

/** Generic scroll reveal with a focus-pull (blur → sharp). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.95, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}
