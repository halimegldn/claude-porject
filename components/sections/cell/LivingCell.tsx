"use client";

import { useId, useMemo, useRef } from "react";
import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { useVisibilityRef } from "@/lib/hooks";
import { EASE_EXPO, SPRING_SOFT } from "@/lib/motion";
import { seeded } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Living cell — membrane, nucleus and organelles are solved per      */
/*  frame. The membrane is a sum of three sine harmonics (so it never  */
/*  repeats on a visible cycle), organelles ride slow ellipses, and    */
/*  vesicles do a damped random walk: Brownian motion, roughly.        */
/* ------------------------------------------------------------------ */

export function blobPath(cx: number, cy: number, radius: number, t: number, amp: number, seed: number) {
  const steps = 64;
  let d = "";
  for (let i = 0; i < steps; i++) {
    const th = (i / steps) * Math.PI * 2;
    const wobble =
      Math.sin(3 * th + t * 0.7 + seed) * 0.5 +
      Math.sin(5 * th - t * 0.45 + seed * 1.7) * 0.3 +
      Math.sin(7 * th + t * 0.95) * 0.2;
    const r = radius * (1 + amp * wobble);
    const x = cx + r * Math.cos(th);
    const y = cy + r * Math.sin(th);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

export const ORGANELLES = [
  { label: "Mitokondri", rx: 52, ry: 34, speed: 0.22, phase: 0, w: 15, h: 7.5 },
  { label: "Mitokondri", rx: 46, ry: 40, speed: -0.17, phase: 2.1, w: 13, h: 6.6 },
  { label: "Kloroplast", rx: 58, ry: 30, speed: 0.13, phase: 4.2, w: 16, h: 9 },
];

export const VESICLE_COUNT = 14;

/* Hover is reported upward rather than labelled in place: the caller
   frames this cell inside a clipping circle, and a label drawn in here
   would be cropped and would zoom along with the cell. */
export function LivingCell({ onHover }: { onHover?: (label: string | null) => void }) {
  const reduced = useReducedMotion();
  const { elementRef, visible } = useVisibilityRef<HTMLDivElement>();
  const gradId = useId();
  const membrane = useRef<SVGPathElement>(null);
  const cytoplasm = useRef<SVGPathElement>(null);
  const nucleus = useRef<SVGPathElement>(null);
  const nucleolus = useRef<SVGCircleElement>(null);
  const organelles = useRef<(SVGGElement | null)[]>([]);
  const vesicles = useRef<(SVGCircleElement | null)[]>([]);

  /* Seeded start points render identically on server and client; the ref
     holds the live bodies the animation loop integrates. */
  const seedPositions = useMemo(
    () =>
      Array.from({ length: VESICLE_COUNT }, (_, i) => ({
        x: Number((100 + (seeded(i * 2.7) - 0.5) * 110).toFixed(2)),
        y: Number((100 + (seeded(i * 5.3) - 0.5) * 110).toFixed(2)),
        vx: (seeded(i * 7.1) - 0.5) * 6,
        vy: (seeded(i * 9.5) - 0.5) * 6,
        r: Number((1 + seeded(i * 3.3) * 1.6).toFixed(2)),
      })),
    []
  );
  const walk = useRef(seedPositions.map((p) => ({ ...p })));

  const initialMembrane = useMemo(() => blobPath(100, 100, 82, 0, 0.035, 0), []);
  const initialNucleus = useMemo(() => blobPath(100, 100, 27, 0, 0.05, 1.3), []);

  useAnimationFrame((ms, delta) => {
    if (reduced || !visible.current) return;
    const t = ms / 1000;
    const dt = Math.min(delta / 1000, 0.05);

    membrane.current?.setAttribute("d", blobPath(100, 100, 82, t, 0.035, 0));
    cytoplasm.current?.setAttribute("d", blobPath(100, 100, 76, t + 0.6, 0.028, 2.2));
    nucleus.current?.setAttribute("d", blobPath(100, 100, 27, t * 1.3, 0.05, 1.3));

    if (nucleolus.current) {
      nucleolus.current.setAttribute("r", (6 + Math.sin(t * 1.1) * 0.9).toFixed(2));
    }

    ORGANELLES.forEach((o, i) => {
      const g = organelles.current[i];
      if (!g) return;
      const a = t * o.speed + o.phase;
      /* Orbit + a slow radial breath so paths don't trace a fixed ring. */
      const breath = 1 + Math.sin(t * 0.4 + o.phase) * 0.08;
      const x = 100 + Math.cos(a) * o.rx * breath;
      const y = 100 + Math.sin(a) * o.ry * breath;
      const rot = (a * 180) / Math.PI + Math.sin(t * 0.8 + o.phase) * 14;
      g.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(1)})`);
    });

    walk.current.forEach((v, i) => {
      const c = vesicles.current[i];
      /* Random impulse + drag + a soft wall at the membrane. */
      v.vx += (Math.random() - 0.5) * 34 * dt;
      v.vy += (Math.random() - 0.5) * 34 * dt;
      v.vx *= 0.985;
      v.vy *= 0.985;
      v.x += v.vx * dt * 6;
      v.y += v.vy * dt * 6;
      const dx = v.x - 100;
      const dy = v.y - 100;
      const dist = Math.hypot(dx, dy);
      if (dist > 70) {
        const push = (dist - 70) * 0.06;
        v.vx -= (dx / dist) * push * 10;
        v.vy -= (dy / dist) * push * 10;
      }
      if (!c) return;
      c.setAttribute("cx", v.x.toFixed(2));
      c.setAttribute("cy", v.y.toFixed(2));
      c.setAttribute("opacity", (0.25 + 0.35 * Math.abs(Math.sin(t + i))).toFixed(2));
    });
  });

  return (
    <div ref={elementRef} className="relative h-full w-full">
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`${gradId}-cyto`} cx="42%" cy="36%">
            <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.22" />
            <stop offset="60%" stopColor="var(--accent-deep)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id={`${gradId}-nuc`} cx="38%" cy="32%">
            <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.85" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent-deep)" stopOpacity="0.25" />
          </radialGradient>
          <filter id={`${gradId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* membrane */}
        <motion.path
          ref={membrane}
          d={initialMembrane}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.35"
          strokeWidth="1.4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          ref={cytoplasm}
          d={blobPath(100, 100, 76, 0.6, 0.028, 2.2)}
          fill={`url(#${gradId}-cyto)`}
          stroke="var(--accent-light)"
          strokeOpacity="0.12"
          strokeWidth="0.6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE_EXPO }}
          style={{ originX: "100px", originY: "100px" }}
        />

        {/* endoplasmic reticulum — folded ribbons around the nucleus */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={`er-${i}`}
            d={`M${58 + i * 6} ${72 + i * 14} C${78 - i * 4} ${58 + i * 10}, ${122 + i * 4} ${62 + i * 8}, ${142 - i * 6} ${80 + i * 12}`}
            fill="none"
            stroke="var(--accent-2-light)"
            strokeOpacity={0.16 - i * 0.03}
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, delay: 0.9 + i * 0.15, ease: "easeInOut" }}
          />
        ))}

        {/* vesicles (Brownian) */}
        {seedPositions.map((p, i) => (
          <circle
            key={`v-${i}`}
            ref={(el) => {
              vesicles.current[i] = el;
            }}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="var(--accent-2-light)"
            opacity="0.4"
          />
        ))}

        {/* organelles */}
        {ORGANELLES.map((o, i) => (
          <g
            key={`o-${i}`}
            ref={(el) => {
              organelles.current[i] = el;
            }}
            transform={`translate(${(100 + Math.cos(o.phase) * o.rx).toFixed(2)} ${(100 + Math.sin(o.phase) * o.ry).toFixed(2)})`}
            onMouseEnter={() => onHover?.(o.label)}
            onMouseLeave={() => onHover?.(null)}
            className="cursor-pointer"
          >
            <motion.ellipse
              rx={o.w}
              ry={o.h}
              fill="var(--accent-deep)"
              fillOpacity="0.2"
              stroke="var(--accent-light)"
              strokeOpacity="0.4"
              strokeWidth="0.8"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...SPRING_SOFT, delay: 1 + i * 0.12 }}
            />
            {/* cristae */}
            <path
              d={`M${-o.w + 3} 0 L${-o.w / 2} ${-o.h / 2} L0 0 L${o.w / 2} ${-o.h / 2} L${o.w - 3} 0`}
              fill="none"
              stroke="var(--accent-light)"
              strokeOpacity="0.4"
              strokeWidth="0.6"
            />
          </g>
        ))}

        {/* nucleus */}
        <motion.path
          ref={nucleus}
          d={initialNucleus}
          fill={`url(#${gradId}-nuc)`}
          filter={`url(#${gradId}-glow)`}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...SPRING_SOFT, delay: 0.7 }}
          style={{ originX: "100px", originY: "100px" }}
        />
        <motion.circle
          ref={nucleolus}
          cx="94"
          cy="96"
          r="6"
          fill="var(--accent-deep)"
          fillOpacity="0.55"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...SPRING_SOFT, delay: 1.1 }}
        />
      </svg>

    </div>
  );
}
