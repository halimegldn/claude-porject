"use client";

import { motion } from "framer-motion";
import { maskLine } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Text reveals                                                       */
/* ------------------------------------------------------------------ */

/** A line clipped by its own box — used for headline rows. */
export function MaskLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.14em]">
      <motion.span variants={maskLine} className={`block ${className ?? ""}`}>
        {children}
      </motion.span>
    </span>
  );
}
