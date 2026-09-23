"use client";

import { motion } from "framer-motion";
import { Dna } from "lucide-react";
import { EASE_EXPO } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 px-6 py-8">
      <motion.div
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-foreground/40 sm:flex-row"
      >
        <span className="flex items-center gap-2 font-medium text-foreground/70">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.3 }}
            className="text-accent"
          >
            <Dna size={16} strokeWidth={1.5} />
          </motion.span>
          BIO<span className="text-accent">.</span>
        </span>
        <span className="text-center">Yaşamı anlamak, kendimizi anlamaktır.</span>
        <span>© 2026</span>
      </motion.div>
    </footer>
  );
}
