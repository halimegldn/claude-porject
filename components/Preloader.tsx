"use client";

import { useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { Dna } from "lucide-react";
import { EASE_EXPO } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Preloader — draws the logo, counts the load, then splits away.     */
/* ------------------------------------------------------------------ */

export function Preloader({ onDone }: { onDone: () => void }) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let done = false;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (done) return;
      done = true;
      onDone();
    };

    /* The counter writes straight to the DOM — sixty re-renders a second
       for a number nobody reads twice is wasted work. Cubic-out so it
       decelerates into 100 like a real load. */
    const controls = animate(0, 100, {
      duration: 1.5,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => {
        const n = Math.round(v);
        if (counterRef.current) counterRef.current.textContent = String(n).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      },
      onComplete: () => {
        settle = setTimeout(finish, 260);
      },
    });

    /* Safety net: the counter rides requestAnimationFrame, which a paused
       compositor can stall indefinitely. Nothing may ever leave the visitor
       stuck behind an opaque overlay, so a timer force-finishes it. */
    const failsafe = setTimeout(finish, 4000);

    return () => {
      controls.stop();
      clearTimeout(settle);
      clearTimeout(failsafe);
    };
  }, [onDone]);

  return (
    <motion.div
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-background"
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
        initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: EASE_EXPO }}
        exit={{ opacity: 0, y: -18, scale: 1.04, filter: "blur(8px)", transition: { duration: 0.4 } }}
      >
        <div className="relative">
          <motion.span
            animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-accent/40 blur-md"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
            className="relative text-accent"
          >
            <Dna size={34} strokeWidth={1.4} />
          </motion.div>
        </div>

        <div className="flex items-baseline gap-1 font-medium tracking-tight text-2xl">
          <span className="shimmer-text">BIO</span>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            className="text-accent"
          >
            .
          </motion.span>
        </div>

        <div className="relative h-px w-44 overflow-hidden bg-foreground/10">
          <span
            ref={barRef}
            style={{ transform: "scaleX(0)" }}
            className="absolute inset-0 origin-left bg-gradient-to-r from-accent to-accent-2-light"
          />
        </div>

        <span
          ref={counterRef}
          className="font-mono text-[11px] tabular-nums tracking-[0.3em] text-foreground/40"
        >
          000
        </span>
      </motion.div>
    </motion.div>
  );
}
