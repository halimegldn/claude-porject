"use client";

import { motion } from "framer-motion";
import { RAIL_SECTIONS, SECTION_IDS } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";
import { EASE_EXPO, SPRING_SOFT } from "@/lib/motion";

/* A wayfinding rail: where you are in the document, always answerable
   without scrolling back to the nav. Desktop only — it needs the gutter. */
export function SectionRail() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 1.2, ease: EASE_EXPO }}
      aria-label="Bölümler"
      className="fixed right-6 top-1/2 z-[58] hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      {RAIL_SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3"
          >
            <motion.span
              animate={{
                opacity: isActive ? 1 : 0,
                x: isActive ? 0 : 8,
              }}
              transition={{ duration: 0.45, ease: EASE_EXPO }}
              className="text-[10px] tracking-[0.25em] text-foreground/50 group-hover:opacity-100"
            >
              {section.label.toLocaleUpperCase("tr-TR")}
            </motion.span>
            <span className="relative flex h-3 w-3 items-center justify-center">
              <motion.span
                animate={{
                  scale: isActive ? 1 : 0.45,
                  backgroundColor: isActive
                    ? "rgb(from var(--accent) r g b / 100%)"
                    : "rgb(from var(--foreground) r g b / 25%)",
                }}
                transition={SPRING_SOFT}
                className="h-1.5 w-1.5 rounded-full"
              />
              {isActive && (
                <motion.span
                  layoutId="rail-halo"
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  className="absolute inset-0 rounded-full border border-accent/50"
                />
              )}
            </span>
          </a>
        );
      })}
    </motion.nav>
  );
}
