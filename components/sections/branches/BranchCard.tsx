"use client";

import { useRef } from "react";
import { motion, useMotionTemplate } from "framer-motion";
import { ShineSweep } from "@/components/ui/ShineSweep";
import { BRANCHES, TONE_CLASSES } from "@/lib/data";
import { useTilt } from "@/lib/hooks";
import { EASE_EXPO, SPRING_SOFT } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Branches                                                           */
/* ------------------------------------------------------------------ */

export function BranchCard({
  branch,
  fromLeft,
}: {
  branch: (typeof BRANCHES)[number];
  fromLeft: boolean;
}) {
  const tone = TONE_CLASSES[branch.tone];
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt(cardRef, 9);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${tilt.glareX}% ${tilt.glareY}%, rgb(from ${tone.glowVar} r g b / 16%), transparent 62%)`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: fromLeft ? -70 : 70, rotateY: fromLeft ? -8 : 8 },
        visible: {
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: { duration: 1.05, ease: EASE_EXPO },
        },
      }}
      style={{ perspective: 1100 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        whileHover={{ y: -6 }}
        style={{
          rotateX: tilt.springRotateX,
          rotateY: tilt.springRotateY,
          transformStyle: "preserve-3d",
        }}
        transition={SPRING_SOFT}
        className={`group relative flex h-full flex-col rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-8 transition-colors duration-500 sm:p-10 ${tone.border}`}
      >
        <motion.span
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <ShineSweep />

        <motion.div
          animate={{ rotate: [0, 9, -5, 0], y: [0, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, rotate: 0 }}
          style={{ transform: "translateZ(50px)" }}
          className={`relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tone.badge}`}
        >
          <branch.icon size={22} strokeWidth={1.5} />
        </motion.div>

        <span
          style={{ transform: "translateZ(30px)" }}
          className={`relative text-[11px] tracking-[0.3em] ${tone.label}`}
        >
          {branch.kademe}
        </span>
        <h3
          style={{ transform: "translateZ(40px)" }}
          className="relative mt-2 text-2xl font-semibold text-foreground/95 sm:text-3xl"
        >
          {branch.title}
        </h3>
        <p
          style={{ transform: "translateZ(24px)" }}
          className="relative mt-4 max-w-sm text-sm leading-relaxed text-foreground/50"
        >
          {branch.desc}
        </p>

        <div
          style={{ transform: "translateZ(18px)" }}
          className="relative mt-auto flex flex-wrap gap-2 pt-7"
        >
          {branch.topics.map((topic, i) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.07, y: -2 }}
              transition={{ ...SPRING_SOFT, delay: 0.35 + i * 0.07 }}
              className="cursor-default rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-foreground/60 transition-colors duration-300 hover:border-foreground/30 hover:text-foreground/90"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
