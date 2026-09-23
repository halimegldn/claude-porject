"use client";

import { motion, type MotionValue } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

export function ScrollIndicator({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 1, ease: EASE_EXPO }}
      className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
    >
      <motion.div style={{ opacity }} className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-12 w-px overflow-hidden bg-foreground/10"
        >
          <motion.div
            animate={{ y: ["-110%", "110%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        </motion.div>
        <span className="text-[10px] tracking-[0.3em] text-foreground/40">KEŞFET</span>
      </motion.div>
    </motion.div>
  );
}
