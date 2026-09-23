"use client";

import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Helix3D } from "@/components/effects/Helix3D";
import { ParticleField } from "@/components/effects/ParticleField";
import { EASE_EXPO } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Hero background — parallax blobs, drifting spores, live helix      */
/* ------------------------------------------------------------------ */

export function HeroBackground({
  mouseX,
  mouseY,
  scrollProgress,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
}) {
  const springX = useSpring(mouseX, { stiffness: 38, damping: 22, mass: 1.2 });
  const springY = useSpring(mouseY, { stiffness: 38, damping: 22, mass: 1.2 });

  /* Each layer answers the pointer by a different amount — the further
     "back" a layer is, the less it moves. Same trick for scroll. */
  const p1x = useTransform(springX, [-1, 1], [26, -26]);
  const p1y = useTransform(springY, [-1, 1], [22, -22]);
  const p2x = useTransform(springX, [-1, 1], [-34, 34]);
  const p2y = useTransform(springY, [-1, 1], [-18, 18]);
  const p3x = useTransform(springX, [-1, 1], [14, -14]);
  const p3y = useTransform(springY, [-1, 1], [-24, 24]);

  const slowY = useTransform(scrollProgress, [0, 1], [0, 90]);
  const midY = useTransform(scrollProgress, [0, 1], [0, 170]);
  const fastY = useTransform(scrollProgress, [0, 1], [0, 260]);
  const helixRotate = useTransform(scrollProgress, [0, 1], [0, 26]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ x: p1x, y: p1y }} className="absolute -left-32 -top-32">
        <motion.div
          animate={{ x: [0, 70, -24, 0], y: [0, -46, 34, 0], scale: [1, 1.18, 0.96, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="h-[560px] w-[560px] rounded-full bg-accent-deep/25 blur-3xl"
        />
      </motion.div>

      <motion.div style={{ x: p2x, y: p2y }} className="absolute -bottom-40 -right-24">
        <motion.div
          animate={{ x: [0, -58, 24, 0], y: [0, 36, -34, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: 31, repeat: Infinity, ease: "easeInOut" }}
          className="h-[520px] w-[520px] rounded-full bg-accent-2/12 blur-3xl"
        />
      </motion.div>

      <motion.div style={{ x: p3x, y: p3y }} className="absolute right-1/4 top-1/3 hidden md:block">
        <motion.div
          animate={{ scale: [1, 1.24, 1], opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="h-[280px] w-[280px] rounded-full bg-accent/12 blur-3xl"
        />
      </motion.div>

      <ParticleField className="absolute inset-0 h-full w-full" />

      {/* molecule diagram, drawn on load then breathing */}
      <motion.svg
        style={{ y: midY }}
        className="absolute bottom-[14%] left-[6%] hidden h-[180px] w-[220px] opacity-30 sm:block"
        viewBox="0 0 220 180"
        fill="none"
      >
        {[
          "M20 30 L90 70",
          "M90 70 L160 40",
          "M90 70 L110 140",
          "M110 140 L180 150",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="var(--accent)"
            strokeOpacity="0.45"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.7 + i * 0.16, ease: EASE_EXPO }}
          />
        ))}
        {[
          [20, 30],
          [90, 70],
          [160, 40],
          [110, 140],
          [180, 150],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            fill="var(--accent-2)"
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: [3, 5, 3], opacity: [0.35, 1, 0.35] }}
            transition={{
              r: { duration: 5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" },
              opacity: { duration: 5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" },
            }}
          />
        ))}
      </motion.svg>

      {/* live rotating helix */}
      <motion.div
        style={{ y: fastY, rotate: helixRotate }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.32, x: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE_EXPO }}
        className="absolute right-16 top-24 hidden lg:block"
      >
        <Helix3D />
      </motion.div>

      <motion.div style={{ y: slowY }} className="absolute inset-0" />
    </div>
  );
}
