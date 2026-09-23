"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LivingCell } from "@/components/sections/cell/LivingCell";
import { MaskLine } from "@/components/ui/MaskLine";
import { Reveal } from "@/components/ui/Reveal";
import { EASE, scaleIn, staggerContainer } from "@/lib/motion";

export function CellVisual() {
  const [hoveredOrganelle, setHoveredOrganelle] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          data-cursor-label="İNCELE"
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          {/* dashed guide rings — slow counter-rotation adds depth */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-accent-light/15"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 rounded-full border border-dashed border-accent-light/10"
          />
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-6 rounded-full bg-accent/5 blur-2xl"
          />

          <LivingCell onHover={setHoveredOrganelle} />

          <AnimatePresence>
            {hoveredOrganelle && (
              <motion.span
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="pointer-events-none absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/30 bg-background/90 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur"
              >
                {hoveredOrganelle}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <div>
          <Reveal>
            <p className="mb-4 text-xs tracking-[0.3em] text-accent/80">MİKRO DÜNYA</p>
          </Reveal>

          <motion.p
            variants={staggerContainer(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl font-semibold leading-snug tracking-tight text-foreground/90 sm:text-4xl"
          >
            <MaskLine>&ldquo;Her hücre kendi içinde</MaskLine>
            <MaskLine className="text-accent">kusursuz bir sistemdir.&rdquo;</MaskLine>
          </motion.p>

          <Reveal delay={0.25}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/45">
              Organellerin üzerine gel — zar dalgalanır, veziküller Brown
              hareketiyle sürüklenir, mitokondriler kendi yörüngelerinde döner.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
