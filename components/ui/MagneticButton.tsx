"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { SPRING_SNAPPY } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Magnetic button — the surface leans toward the cursor and a        */
/*  specular highlight tracks the contact point.                       */
/* ------------------------------------------------------------------ */

export function MagneticButton({
  href,
  className,
  children,
  strength = 0.4,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const springX = useSpring(x, { stiffness: 260, damping: 17, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 17, mass: 0.5 });
  const rotate = useTransform(springX, [-30, 30], [-6, 6]);

  const glow = useMotionTemplate`radial-gradient(120px circle at ${glowX}% ${glowY}%, rgb(from var(--foreground) r g b / 22%), transparent 65%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, rotate }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_SNAPPY}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.span
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.a>
  );
}
