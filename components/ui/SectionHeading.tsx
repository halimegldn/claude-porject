"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AccentBar } from "@/components/ui/AccentBar";
import { MaskLine } from "@/components/ui/MaskLine";
import { Reveal } from "@/components/ui/Reveal";
import { type Tone } from "@/lib/data";
import { scaleIn, staggerContainer } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Section heading — every section title shares one entrance: the     */
/*  bar wipes in, each line rises out of its mask, and the last line   */
/*  carries the flowing gradient. An optional giant index number sits  */
/*  behind and drifts against the scroll for depth.                    */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  lines,
  desc,
  index,
  tone = "accent",
  className = "",
}: {
  eyebrow?: string;
  lines: string[];
  desc?: string;
  index?: string;
  tone?: Tone;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const indexY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {index && (
        <motion.span
          aria-hidden
          style={{ y: indexY }}
          className="pointer-events-none absolute -left-2 -top-20 select-none sm:-left-6 sm:-top-28"
        >
          <motion.span
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="block text-[8rem] font-semibold leading-none text-foreground/[0.04] sm:text-[11rem]"
          >
            {index}
          </motion.span>
        </motion.span>
      )}

      <div className="relative">
        <AccentBar tone={tone} />
        {eyebrow && (
          <Reveal>
            <p className="mb-4 text-xs tracking-[0.3em] text-accent/80">{eyebrow}</p>
          </Reveal>
        )}
        <motion.h2
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
        >
          {lines.map((line, i) => (
            <MaskLine
              key={line}
              className={i === lines.length - 1 && lines.length > 1 ? "text-gradient-anim w-fit" : undefined}
            >
              {line}
            </MaskLine>
          ))}
        </motion.h2>
        {desc && (
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl leading-relaxed text-foreground/55">{desc}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
