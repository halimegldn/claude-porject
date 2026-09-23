"use client";

import { useRef } from "react";
import { motion, useMotionTemplate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ShineSweep } from "@/components/ui/ShineSweep";
import { NOTES_BIO, type Tone, TONE_CLASSES } from "@/lib/data";
import { useTilt } from "@/lib/hooks";
import { EASE_EXPO, SPRING_SOFT } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Notes / Blog                                                       */
/* ------------------------------------------------------------------ */

export function NoteCard({ note, tone, index }: { note: (typeof NOTES_BIO)[number]; tone: Tone; index: number }) {
  const toneClasses = TONE_CLASSES[tone];
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt(cardRef, 8);
  const glow = useMotionTemplate`radial-gradient(440px circle at ${tilt.glareX}% ${tilt.glareY}%, rgb(from ${toneClasses.glowVar} r g b / 15%), transparent 68%)`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, rotateX: -10, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, delay: index * 0.08, ease: EASE_EXPO },
        },
      }}
      style={{ perspective: 1100 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        whileHover={{ y: -10 }}
        data-cursor-label="OKU"
        style={{
          rotateX: tilt.springRotateX,
          rotateY: tilt.springRotateY,
          transformStyle: "preserve-3d",
        }}
        transition={SPRING_SOFT}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 ${toneClasses.border}`}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <ShineSweep />
        <div className="relative z-10" style={{ transform: "translateZ(35px)" }}>
          <span className={`text-[11px] tracking-[0.2em] ${toneClasses.category}`}>
            {note.category}
          </span>
          <h3 className="mt-4 text-xl font-medium text-foreground/95">{note.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/50">{note.desc}</p>
          <div className="mt-8 flex items-center gap-2 text-sm text-foreground/70">
            <span className="relative">
              Devamını Oku
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1.5"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
