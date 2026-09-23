"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useSpring, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { SPRING_SNAPPY } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Back to top — the ring is the page's own scroll progress.          */
/* ------------------------------------------------------------------ */

export function BackToTop() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => setVisible(v > 0.12));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING_SNAPPY}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Başa dön"
          className="fixed bottom-6 right-6 z-[65] flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-background/80 text-accent backdrop-blur-xl"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp size={17} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
