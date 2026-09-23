"use client";

import { useMemo, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { useVisibilityRef } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/*  Rotating double helix — positions are solved per frame from the    */
/*  actual 3D parametric curve, so nodes really do pass behind each    */
/*  other: depth sets radius, opacity and stroke weight.               */
/* ------------------------------------------------------------------ */

export const HELIX_NODES = 56;

export const HELIX_HEIGHT = 430;

export const HELIX_AMPLITUDE = 38;

export const HELIX_TURNS = 2.6;

export function helixNode(i: number, phase: number) {
  const t = i / HELIX_NODES;
  const angle = t * HELIX_TURNS * Math.PI * 2 + phase;
  return {
    x: Math.round((HELIX_AMPLITUDE * Math.sin(angle) + HELIX_AMPLITUDE + 10) * 100) / 100,
    y: Math.round((t * HELIX_HEIGHT + 10) * 100) / 100,
    depth: (Math.cos(angle) + 1) / 2, // 0 = far, 1 = near
  };
}

export function Helix3D({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const { elementRef, visible } = useVisibilityRef<SVGSVGElement>();
  const strandA = useRef<SVGPolylineElement>(null);
  const strandB = useRef<SVGPolylineElement>(null);
  const nodesA = useRef<(SVGCircleElement | null)[]>([]);
  const nodesB = useRef<(SVGCircleElement | null)[]>([]);
  const rungs = useRef<(SVGLineElement | null)[]>([]);

  const indices = useMemo(() => Array.from({ length: HELIX_NODES + 1 }, (_, i) => i), []);
  const rungIndices = useMemo(() => indices.filter((i) => i % 4 === 0), [indices]);

  const initial = useMemo(() => {
    const a = indices.map((i) => helixNode(i, 0));
    const b = indices.map((i) => helixNode(i, Math.PI));
    return { a, b };
  }, [indices]);

  useAnimationFrame((t) => {
    if (reduced || !visible.current) return;
    const phase = (t / 1000) * 0.42;
    let pointsA = "";
    let pointsB = "";

    for (let i = 0; i <= HELIX_NODES; i++) {
      const a = helixNode(i, phase);
      const b = helixNode(i, phase + Math.PI);
      pointsA += `${a.x.toFixed(1)},${a.y.toFixed(1)} `;
      pointsB += `${b.x.toFixed(1)},${b.y.toFixed(1)} `;

      const ca = nodesA.current[i];
      if (ca) {
        ca.setAttribute("cx", a.x.toFixed(1));
        ca.setAttribute("r", (1.1 + a.depth * 2.4).toFixed(2));
        ca.setAttribute("opacity", (0.15 + a.depth * 0.75).toFixed(2));
      }
      const cb = nodesB.current[i];
      if (cb) {
        cb.setAttribute("cx", b.x.toFixed(1));
        cb.setAttribute("r", (1.1 + b.depth * 2.4).toFixed(2));
        cb.setAttribute("opacity", (0.15 + b.depth * 0.75).toFixed(2));
      }
    }

    strandA.current?.setAttribute("points", pointsA.trim());
    strandB.current?.setAttribute("points", pointsB.trim());

    rungIndices.forEach((i, k) => {
      const line = rungs.current[k];
      if (!line) return;
      const a = helixNode(i, phase);
      const b = helixNode(i, phase + Math.PI);
      line.setAttribute("x1", a.x.toFixed(1));
      line.setAttribute("x2", b.x.toFixed(1));
      line.setAttribute("opacity", (0.12 + Math.abs(a.depth - b.depth) * 0.42).toFixed(2));
      line.setAttribute("stroke-width", (0.6 + (a.depth + b.depth) * 0.7).toFixed(2));
    });
  });

  return (
    <svg
      ref={elementRef}
      className={className}
      width={HELIX_AMPLITUDE * 2 + 20}
      height={HELIX_HEIGHT + 20}
      viewBox={`0 0 ${HELIX_AMPLITUDE * 2 + 20} ${HELIX_HEIGHT + 20}`}
      fill="none"
      aria-hidden
    >
      {rungIndices.map((i, k) => {
        const a = initial.a[i];
        const b = initial.b[i];
        return (
          <line
            key={`rung-${i}`}
            ref={(el) => {
              rungs.current[k] = el;
            }}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={a.y}
            stroke="var(--accent)"
            strokeWidth="1"
            opacity="0.35"
          />
        );
      })}

      <polyline
        ref={strandA}
        points={initial.a.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
        stroke="var(--accent-light)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <polyline
        ref={strandB}
        points={initial.b.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
        stroke="var(--accent-2-light)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />

      {indices.map((i) => (
        <circle
          key={`a-${i}`}
          ref={(el) => {
            nodesA.current[i] = el;
          }}
          cx={initial.a[i].x}
          cy={initial.a[i].y}
          r={2}
          fill="var(--accent-light)"
          opacity="0.6"
        />
      ))}
      {indices.map((i) => (
        <circle
          key={`b-${i}`}
          ref={(el) => {
            nodesB.current[i] = el;
          }}
          cx={initial.b[i].x}
          cy={initial.b[i].y}
          r={2}
          fill="var(--accent-2-light)"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}
