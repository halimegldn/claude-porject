"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Ambient pointer light                                              */
/* ------------------------------------------------------------------ */

export function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 45, damping: 24, mass: 1.4 });
  const springY = useSpring(y, { stiffness: 45, damping: 24, mass: 1.4 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, x, y]);

  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed z-[55] hidden h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl mix-blend-screen md:block"
    />
  );
}
