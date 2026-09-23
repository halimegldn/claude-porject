"use client";

import { motion } from "framer-motion";
import { charIn, staggerContainer } from "@/lib/motion";

/** Per-character 3D flip-in. Inherits the animation state of its parent. */
export function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={staggerContainer(0.026)}
      className={`inline-block ${className ?? ""}`}
      style={{ perspective: 700 }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {Array.from(word).map((char, ci) => (
            <motion.span
              key={ci}
              variants={charIn}
              style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
