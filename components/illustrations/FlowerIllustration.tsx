"use client";

import { motion } from "framer-motion";
import { drawIn, EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Illustrated biology motifs — single continuous-line "one-line       */
/*  drawing" style, drawn on scroll via animated pathLength.           */
/* ------------------------------------------------------------------ */

export function generateFlowerOutline(petalCount: number, innerR: number, outerR: number, steps = 240) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const r = innerR + (outerR - innerR) * Math.pow((1 + Math.cos(petalCount * theta)) / 2, 0.55);
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

export const FLOWER_OUTLINE = generateFlowerOutline(6, 12, 34);

export function FlowerIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.polyline
        points={FLOWER_OUTLINE}
        stroke="var(--accent-2)"
        strokeOpacity="0.55"
        strokeWidth="1.1"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="3.5"
        stroke="var(--pop)"
        strokeOpacity="0.55"
        strokeWidth="1"
        fill="var(--pop)"
        fillOpacity="0.12"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [0, 1.4, 1], opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 2.4, ease: EASE }}
      />
    </svg>
  );
}
