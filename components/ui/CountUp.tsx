"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Stats — spring-driven counters. A spring decelerates into its      */
/*  target the way a physical dial would, unlike a linear tween.       */
/* ------------------------------------------------------------------ */

export function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const value = useSpring(0, { stiffness: 42, damping: 18, mass: 1.1 });
  const display = useTransform(value, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      value.jump(target);
      return;
    }
    value.set(target);
  }, [inView, target, reduced, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
    </span>
  );
}
