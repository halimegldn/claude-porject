"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { FlaskConical, Leaf } from "lucide-react";
import { BranchCard } from "@/components/sections/branches/BranchCard";
import { ButterflyPath } from "@/components/sections/branches/ButterflyPath";
import { FloatingDecor } from "@/components/ui/FloatingDecor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BRANCHES } from "@/lib/data";
import { staggerContainer } from "@/lib/motion";

export function Branches() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section
      id="branslar"
      ref={ref}
      className="relative overflow-hidden px-6 py-32 sm:py-40"
    >
      <FloatingDecor icon={FlaskConical} className="left-[8%] top-16" duration={10} />
      <FloatingDecor icon={Leaf} className="bottom-24 right-[10%]" duration={8} delay={1.5} />

      <ButterflyPath progress={scrollYProgress} />

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="01"
          eyebrow="İKİ KADEME, TEK TUTKU"
          lines={["İki Branş,", "Tek Merak"]}
          className="mb-14 max-w-xl"
        />

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
