"use client";

import { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { FlaskConical, Leaf } from "lucide-react";
import { ButterflyIllustration } from "@/components/illustrations/ButterflyIllustration";
import { BranchCard } from "@/components/sections/branches/BranchCard";
import { AccentBar } from "@/components/ui/AccentBar";
import { FloatingDecor } from "@/components/ui/FloatingDecor";
import { Reveal } from "@/components/ui/Reveal";
import { BRANCHES } from "@/lib/data";
import { staggerContainer } from "@/lib/motion";

export function Branches() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  /* The butterfly crosses the section as you scroll, with a sine bob. */
  const flightX = useTransform(scrollYProgress, [0, 1], ["-6vw", "92vw"]);
  const flightY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, -70, 20, -50, 10]);
  const flightRotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [8, -12, 6, -10, 4]);

  return (
    <section
      id="branslar"
      ref={ref}
      className="relative overflow-hidden px-6 py-32 sm:py-40"
    >
      <FloatingDecor icon={FlaskConical} className="left-[8%] top-16" duration={10} />
      <FloatingDecor icon={Leaf} className="bottom-24 right-[10%]" duration={8} delay={1.5} />

      <motion.div
        style={{ x: flightX, y: flightY, rotate: flightRotate }}
        className="pointer-events-none absolute left-0 top-16 hidden h-14 w-16 md:block"
      >
        <ButterflyIllustration className="h-full w-full" />
      </motion.div>

      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-14 max-w-xl">
          <AccentBar />
          <p className="mb-4 text-xs tracking-[0.3em] text-accent/80">İKİ KADEME, TEK TUTKU</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            İki Branş, Tek Merak
          </h2>
        </Reveal>

        <motion.div
          variants={staggerContainer(0.18)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {BRANCHES.map((branch, i) => (
            <BranchCard key={branch.title} branch={branch} fromLeft={i === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
