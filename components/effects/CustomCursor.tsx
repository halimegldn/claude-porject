"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { getFinePointer, getServerFinePointer, subscribeFinePointer } from "@/lib/hooks";
import { EASE, SPRING_SNAPPY } from "@/lib/motion";

export function CustomCursor() {
  const reduced = useReducedMotion();
  const fine = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointer,
    getServerFinePointer
  );
  const active = fine && !reduced;
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  /* Elements opt into a labelled cursor with data-cursor-label="Oku". */
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(
        !!target?.closest?.("a, button, input, textarea, [data-cursor='link']")
      );
      const labelled = target?.closest?.("[data-cursor-label]") as HTMLElement | null;
      setLabel(labelled?.dataset.cursorLabel ?? null);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [active, x, y]);

  if (!active) return null;

  return (
    <>
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: visible && !label ? 1 : 0,
          scale: pressed ? 0.6 : hovering ? 0.4 : 1,
        }}
        transition={SPRING_SNAPPY}
        className="pointer-events-none fixed left-0 top-0 z-[95] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent mix-blend-difference"
      />

      {/* The ring doubles as the label chip: over a labelled element it
          inflates into a filled pill rather than spawning a second object. */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.85 : label ? 1 : hovering ? 1.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="pointer-events-none fixed left-0 top-0 z-[94]"
      >
        <motion.div
          animate={{
            width: label ? 84 : 32,
            height: 32,
            backgroundColor: label
              ? "rgb(from var(--accent) r g b / 92%)"
              : "rgb(from var(--accent) r g b / 0%)",
            borderColor: label
              ? "rgb(from var(--accent) r g b / 0%)"
              : hovering
                ? "rgb(from var(--accent-2) r g b / 80%)"
                : "rgb(from var(--accent) r g b / 45%)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="-ml-4 -mt-4 flex items-center justify-center overflow-hidden rounded-full border"
        >
          <AnimatePresence mode="wait">
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="whitespace-nowrap text-[10px] font-medium tracking-[0.18em] text-background"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
