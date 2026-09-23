"use client";

import { motion } from "framer-motion";
import { FlowerIllustration } from "@/components/illustrations/FlowerIllustration";
import { Parallax } from "@/components/ui/Parallax";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Quote() {
  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-44">
      <motion.div
        animate={{ x: [0, 48, -20, 0], y: [0, -24, 16, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/4 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent-deep/12 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -34, 18, 0], y: [0, 24, -14, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-1/4 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-accent-2/12 blur-3xl"
      />
      <Parallax
        distance={60}
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 sm:block"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.12, 1] }}
          transition={{
            rotate: { duration: 70, repeat: Infinity, ease: "linear" },
            scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
          className="h-full w-full"
        >
          <FlowerIllustration className="h-full w-full" />
        </motion.div>
      </Parallax>

      <div className="relative">
        <ScrollReveal
          text="Bilim, cevaplardan çok doğru soruları sormayı öğretir."
          className="mx-auto max-w-4xl text-center text-2xl font-semibold leading-snug tracking-tight sm:text-4xl md:text-5xl"
        />
      </div>
    </section>
  );
}
