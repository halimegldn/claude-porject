"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { ButterflyIllustration } from "@/components/illustrations/ButterflyIllustration";

/* ------------------------------------------------------------------ */
/*  Butterfly flight — scroll drives the butterfly along a wavy path.  */
/*  Its heading follows the path's tangent and a trail is drawn        */
/*  behind it with pathLength, so the route reads as a real flight.    */
/* ------------------------------------------------------------------ */

const VIEW_W = 1000;
const VIEW_H = 200;
const FLIGHT_PATH =
  "M -40 150 C 90 40, 210 30, 320 110 S 520 210, 640 120 S 850 10, 1040 80";

export function ButterflyPath({ progress }: { progress: MotionValue<number> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const smooth = useSpring(progress, { stiffness: 60, damping: 20, mass: 0.6 });
  const x = useMotionValue(-120);
  const y = useMotionValue(0);
  const rotate = useMotionValue(90);

  const place = useCallback(
    (p: number) => {
      const svg = svgRef.current;
      const path = pathRef.current;
      if (!svg || !path) return;
      const len = path.getTotalLength();
      const at = Math.min(Math.max(p, 0), 1) * len;
      const a = path.getPointAtLength(Math.max(at - 1.5, 0));
      const b = path.getPointAtLength(Math.min(at + 1.5, len));
      const here = path.getPointAtLength(at);
      /* The SVG stretches to the section, so scale the tangent into
         screen space before reading its angle. */
      const sx = svg.clientWidth / VIEW_W;
      const sy = svg.clientHeight / VIEW_H;
      x.set(here.x * sx);
      y.set(here.y * sy);
      /* The drawing faces up; +90° turns it to face along the path. */
      rotate.set((Math.atan2((b.y - a.y) * sy, (b.x - a.x) * sx) * 180) / Math.PI + 90);
    },
    [x, y, rotate]
  );

  useMotionValueEvent(smooth, "change", place);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    place(smooth.get());
    const ro = new ResizeObserver(() => place(smooth.get()));
    ro.observe(svg);
    return () => ro.disconnect();
  }, [place, smooth]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-[220px] md:block">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        aria-hidden
      >
        {/* faint guide of the whole route */}
        <path
          d={FLIGHT_PATH}
          stroke="var(--accent)"
          strokeOpacity="0.08"
          strokeWidth="1"
          strokeDasharray="3 9"
        />
        {/* trail drawn behind the butterfly */}
        <motion.path
          ref={pathRef}
          d={FLIGHT_PATH}
          stroke="var(--accent)"
          strokeOpacity="0.32"
          strokeWidth="1.2"
          strokeLinecap="round"
          style={{ pathLength: smooth }}
        />
      </svg>

      <motion.div
        style={{ x, y, rotate }}
        className="absolute left-0 top-0 -ml-8 -mt-7 h-14 w-16"
      >
        <ButterflyIllustration className="h-full w-full" />
      </motion.div>
    </div>
  );
}
