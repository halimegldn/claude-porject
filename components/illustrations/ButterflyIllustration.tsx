"use client";

import { motion, useReducedMotion } from "framer-motion";
import { drawIn } from "@/lib/motion";

/* Wing-beating butterfly: each wing scales on its own X axis, and the
   body bobs a half-beat behind so the flap reads as lift. */
export function ButterflyIllustration({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const flap = reduced
    ? {}
    : {
        animate: { scaleX: [1, 0.35, 1] },
        transition: { duration: 0.42, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible" }}
    >
      <motion.g style={{ originX: "50px", originY: "50px" }} {...flap}>
        <motion.path
          d="M50 50 C30 20 5 25 8 45 C10 62 30 60 50 50 Z"
          stroke="var(--accent)"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          fill="var(--accent)"
          fillOpacity="0.07"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M50 50 C70 20 95 25 92 45 C90 62 70 60 50 50 Z"
          stroke="var(--accent)"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          fill="var(--accent)"
          fillOpacity="0.07"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </motion.g>
      <motion.path
        d="M50 30 C47 45 47 65 50 80"
        stroke="var(--accent)"
        strokeOpacity="0.45"
        strokeWidth="0.7"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 1.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 30 C46 24 42 20 37 18"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="0.5"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 1.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 30 C54 24 58 20 63 18"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="0.5"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}
