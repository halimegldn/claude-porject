"use client";

import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { EASE, SPRING_SNAPPY } from "@/lib/motion";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setGlobalTheme,
  subscribeTheme,
} from "@/lib/theme";

/* ------------------------------------------------------------------ */
/*  Theme toggle                                                       */
/* ------------------------------------------------------------------ */

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  return (
    <motion.button
      onClick={() => setGlobalTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      whileHover={{ scale: 1.08, rotate: 8 }}
      whileTap={{ scale: 0.9, rotate: -12 }}
      transition={SPRING_SNAPPY}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/10 text-foreground/70 transition-colors duration-300 hover:border-accent/40 hover:text-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -120, scale: 0.4, y: 8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, rotate: 120, scale: 0.4, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Moon size={16} strokeWidth={1.5} />
          ) : (
            <Sun size={16} strokeWidth={1.5} />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
