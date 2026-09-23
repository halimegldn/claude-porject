"use client";

import { motion } from "framer-motion";
import { type Tone, TONE_CLASSES } from "@/lib/data";
import { EASE_EXPO } from "@/lib/motion";

export function AccentBar({ tone = "accent" as Tone }: { tone?: Tone }) {
  return (
    <motion.span
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE_EXPO }}
      style={{ originX: 0 }}
      className={`mb-5 block h-[3px] w-12 rounded-full ${TONE_CLASSES[tone].pillBg}`}
    />
  );
}
