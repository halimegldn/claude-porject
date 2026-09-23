"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  useScroll,
  type MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Quote — each word's opacity, lift and focus are tied directly to   */
/*  scroll position, so the sentence resolves as you read it.          */
/* ------------------------------------------------------------------ */

export function ScrollWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [16, 0]);
  const blurPx = useTransform(progress, range, [6, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.span style={{ opacity, y, filter }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

export function ScrollReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <ScrollWord
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </ScrollWord>
      ))}
    </p>
  );
}
