"use client";

import { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";

/** Wraps children in a scroll-driven vertical parallax. */
export function Parallax({
  children,
  className,
  distance = 90,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
