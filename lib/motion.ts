import { type Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Motion language — every timing in the site comes from here.        */
/*  Entrances use expo-out (fast start, long settle) so content feels  */
/*  "placed" rather than slid; interactions use springs so they carry  */
/*  weight and can be interrupted mid-flight.                          */
/* ------------------------------------------------------------------ */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export const SPRING_SOFT = { type: "spring", stiffness: 90, damping: 20, mass: 1 } as const;

export const SPRING_SNAPPY = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 } as const;

export const SPRING_CHAR = { type: "spring", stiffness: 300, damping: 26, mass: 0.8 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE_EXPO },
  },
};

export const fadeUpBig: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_EXPO },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_EXPO },
  },
};

/* A line that rises out of its own clipping box, with a touch of skew
   so the leading edge lags — the way real typeset lines settle. */
export const maskLine: Variants = {
  hidden: { y: "110%", opacity: 0, skewY: 3.5 },
  visible: {
    y: "0%",
    opacity: 1,
    skewY: 0,
    transition: { duration: 1.15, ease: EASE_EXPO },
  },
};

export const charIn: Variants = {
  hidden: { opacity: 0, y: "0.6em", rotateX: -80 },
  visible: { opacity: 1, y: "0em", rotateX: 0, transition: SPRING_CHAR },
};

export const staggerContainer = (stagger = 0.15, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const drawIn = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};
