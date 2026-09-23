"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { drawIn } from "@/lib/motion";

/* Naturalistic leaf outline: a width-envelope profile from apex to base,
   with a serration ripple (tapered to 0 at both tips) and a slightly
   different ripple phase per side for organic asymmetry. */
export function generateLeafOutline(steps = 100) {
  const teethFreq = 15;
  const right: [number, number][] = [];
  const left: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const v = i / steps;
    const envelope = Math.sin(Math.PI * Math.pow(v, 0.8)) * 29;
    const taper = Math.sin(Math.PI * v);
    const y = 10 + v * 100;
    const rightRipple = taper * 1.7 * Math.sin(v * teethFreq * Math.PI * 2);
    const leftRipple = taper * 1.7 * Math.sin(v * teethFreq * Math.PI * 2 + 0.7);
    right.push([50 + envelope + rightRipple, y]);
    left.push([50 - envelope - leftRipple, y]);
  }
  const all = [...right, ...left.reverse()];
  return all.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

export const LEAF_OUTLINE = generateLeafOutline();

export const LEAF_VEINS = [
  { y: 32, left: "M49 32 C40 28 32 22 26 16", right: "M51 32 C60 28 68 22 74 16", delay: 2.6 },
  { y: 52, left: "M49 52 C38 50 27 46 19 40", right: "M51 52 C62 50 73 46 81 40", delay: 2.75 },
  { y: 72, left: "M49 72 C40 72 30 70 22 66", right: "M51 72 C60 72 70 70 78 66", delay: 2.9 },
  { y: 92, left: "M49 92 C43 94 37 94 31 92", right: "M51 92 C57 94 63 94 69 92", delay: 3.05 },
];

export function LeafIllustration({ className }: { className?: string }) {
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 100 150"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.5" />
          <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--accent-deep)" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {/* blade fill — fades in as the outline finishes drawing */}
      <motion.polyline
        points={LEAF_OUTLINE}
        fill={`url(#${gradId})`}
        stroke="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.14 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.2, delay: 1.6, ease: "easeInOut" }}
      />
      {/* blade outline — naturalistic serrated, asymmetric ovate leaf */}
      <motion.polyline
        points={LEAF_OUTLINE}
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.62"
        strokeWidth="1"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      {/* petiole (stem) */}
      <motion.path
        d="M50 109 C49 118 51 129 50 140"
        stroke="var(--accent)"
        strokeOpacity="0.5"
        strokeWidth="1"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 1.9, ease: "easeInOut" }}
      />
      {/* midrib */}
      <motion.path
        d="M50 14 C50 45 50 80 50 106"
        stroke="var(--accent)"
        strokeOpacity="0.42"
        strokeWidth="0.7"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, delay: 2.2, ease: "easeInOut" }}
      />
      {/* pinnate side veins */}
      {LEAF_VEINS.map((v) => (
        <motion.path
          key={`l-${v.y}`}
          d={v.left}
          stroke="var(--accent)"
          strokeOpacity="0.3"
          strokeWidth="0.45"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: v.delay, ease: "easeInOut" }}
        />
      ))}
      {LEAF_VEINS.map((v) => (
        <motion.path
          key={`r-${v.y}`}
          d={v.right}
          stroke="var(--accent)"
          strokeOpacity="0.3"
          strokeWidth="0.45"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: v.delay, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
