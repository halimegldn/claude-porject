"use client";

import { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";
import { STATS } from "@/lib/data";
import { EASE_EXPO, fadeUp, SPRING_SOFT, staggerContainer } from "@/lib/motion";

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wordX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.01, 0.035, 0.01]);

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-28 sm:py-36">
      <motion.span
        style={{ x: wordX, opacity: wordOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[16vw] font-bold tracking-tight text-foreground"
      >
        BIOLOGY
      </motion.span>

      <motion.div
        variants={staggerContainer(0.11)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative mx-auto grid max-w-5xl grid-cols-2 gap-10 text-center md:grid-cols-5"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -6, scale: 1.04 }}
            transition={SPRING_SOFT}
            className="group"
          >
            <div
              className={`text-4xl font-semibold sm:text-5xl ${
                stat.value === "∞" ? "text-pop" : "text-accent"
              }`}
            >
              {typeof stat.value === "number" ? (
                <>
                  <CountUp target={stat.value} />
                  {stat.suffix}
                </>
              ) : (
                <motion.span
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  {stat.value}
                </motion.span>
              )}
            </div>
            <div className="mt-2 text-sm text-foreground/50">{stat.label}</div>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.3 }}
              className="mx-auto mt-3 block h-px w-8 origin-center bg-gradient-to-r from-transparent via-accent/50 to-transparent"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
