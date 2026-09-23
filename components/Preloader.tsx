"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dna } from "lucide-react";
import { EASE_EXPO } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Preloader — draws the logo, counts the load, then splits away.     */
/* ------------------------------------------------------------------ */

export function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const total = 1500;
    let raf = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone();
    };
    const tick = (now: number) => {
      /* Ease the counter out so it decelerates into 100 like a real load. */
      const t = Math.min((now - start) / total, 1);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 260);
    };
    raf = requestAnimationFrame(tick);

    /* Safety net: the counter rides requestAnimationFrame, which a paused
       compositor can stall indefinitely. Nothing may ever leave the visitor
       stuck behind an opaque overlay, so a timer force-finishes it. */
    const failsafe = setTimeout(finish, 4000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.55 } }}
    >
      {/* two curtains that part upward/downward on exit */}
      <motion.span
        className="absolute inset-x-0 top-0 h-1/2 bg-background-alt origin-top"
        exit={{ scaleY: 0, transition: { duration: 0.85, ease: EASE_EXPO } }}
      />
      <motion.span
        className="absolute inset-x-0 bottom-0 h-1/2 bg-background-alt origin-bottom"
        exit={{ scaleY: 0, transition: { duration: 0.85, ease: EASE_EXPO } }}
      />

      <motion.div
        className="relative flex flex-col items-center gap-6"
        exit={{ opacity: 0, y: -18, filter: "blur(8px)", transition: { duration: 0.4 } }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
          className="text-accent"
        >
          <Dna size={34} strokeWidth={1.4} />
        </motion.div>

        <div className="flex items-baseline gap-1 font-medium tracking-tight text-2xl">
          <span className="shimmer-text">BIO</span>
          <span className="text-accent">.</span>
        </div>

        <div className="relative h-px w-44 overflow-hidden bg-foreground/10">
          <motion.span
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-2-light"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-mono text-[11px] tabular-nums tracking-[0.3em] text-foreground/40">
          {String(progress).padStart(3, "0")}
        </span>
      </motion.div>
    </motion.div>
  );
}
