"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Dna, Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NAV_LINKS, SECTION_IDS } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";
import { EASE, EASE_EXPO, fadeUp, staggerContainer } from "@/lib/motion";

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const active = useActiveSection(SECTION_IDS);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    const delta = y - lastY.current;
    if (Math.abs(delta) > 6) {
      setHidden(delta > 0 && y > 260 && !open);
      lastY.current = y;
    }
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: EASE_EXPO, delay: hidden ? 0 : 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-6"
    >
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? "rgb(from var(--background) r g b / 72%)"
            : "rgb(from var(--background) r g b / 0%)",
          borderColor: scrolled
            ? "rgb(from var(--accent) r g b / 22%)"
            : "rgb(from var(--accent) r g b / 0%)",
          y: scrolled ? 0 : 4,
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`mt-4 flex w-full max-w-5xl items-center justify-between rounded-2xl border px-5 py-3 ${
          scrolled
            ? "backdrop-blur-xl shadow-[0_8px_40px_-18px_rgb(from_var(--accent-deep)_r_g_b_/_55%)]"
            : ""
        }`}
      >
        <a href="#hero" className="group flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.25 }}
            className="text-accent"
          >
            <Dna size={20} strokeWidth={1.5} />
          </motion.span>
          <span className="text-[15px] font-medium tracking-tight sm:text-base">
            BIO<span className="text-accent">.</span>
          </span>
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`group relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.07] ring-1 ring-inset ring-accent/20"
                  />
                )}
                <span className="relative">{link.label}</span>
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2-light transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.88 }}
            className="p-1 text-foreground/80 md:hidden"
            aria-label="Menüyü aç/kapat"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="block"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE_EXPO }}
            className="absolute inset-x-4 top-20 overflow-hidden rounded-2xl border border-accent/20 bg-background-alt/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              variants={staggerContainer(0.06, 0.08)}
              initial="hidden"
              animate="visible"
              className="flex flex-col p-4"
            >
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  variants={fadeUp}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-foreground/5 py-3 text-sm text-foreground/80 last:border-none"
                >
                  {link.label}
                  <ArrowUpRight size={14} className="text-accent/60" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
