import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Small math helpers                                                 */
/* ------------------------------------------------------------------ */

/** Watches an element and reports visibility through a ref, so animation
    loops can idle when their subject is off screen without re-rendering. */
export function useVisibilityRef<T extends Element>() {
  const elementRef = useRef<T>(null);
  const visible = useRef(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { elementRef, visible };
}

/* ------------------------------------------------------------------ */
/*  Custom cursor — a hard dot on the real pointer position plus a     */
/*  spring-lagged ring, so motion reads as mass being dragged along.   */
/* ------------------------------------------------------------------ */

/* Pointer capability as an external store, so the cursor can be decided
   during render instead of being switched on from inside an effect. */
export function subscribeFinePointer(callback: () => void) {
  const query = window.matchMedia("(pointer: fine)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function getFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function getServerFinePointer() {
  return false;
}

export function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getServerReducedMotion() {
  return false;
}

/* ------------------------------------------------------------------ */
/*  Floating nav — retracts when you scroll down, returns the moment   */
/*  you scroll back up, and tracks the section you're actually in.     */
/* ------------------------------------------------------------------ */

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** Tilt + specular glare + depth layering, driven by springs. */
export function useTilt(ref: React.RefObject<HTMLDivElement | null>, maxTilt = 9) {
  const reduced = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springRotateX = useSpring(rotateX, { stiffness: 190, damping: 18, mass: 0.6 });
  const springRotateY = useSpring(rotateY, { stiffness: 190, damping: 18, mass: 0.6 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * maxTilt * 2);
    rotateX.set((py - 0.5) * -maxTilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function onMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return { onMouseMove, onMouseLeave, springRotateX, springRotateY, glareX, glareY };
}
