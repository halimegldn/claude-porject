"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useThemeColors } from "@/lib/theme";
import { seeded } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Particle field — spores drifting through the hero. Canvas keeps    */
/*  ~90 independent bodies cheap, and each one carries its own mass,   */
/*  depth and turbulence phase so the swarm never looks looped.        */
/* ------------------------------------------------------------------ */

export type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  drift: number;
  color: number;
};

export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const colors = useThemeColors(["--accent", "--accent-2", "--accent-light"]);
  const colorsRef = useRef(colors);

  /* The draw loop reads the palette through a ref so a theme switch
     repaints the swarm without tearing down the particle system. */
  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let last = performance.now();

    const build = () => {
      /* Scale the swarm to the machine as well as the viewport — a
         4-core laptop should not be asked to push a desktop's count. */
      const cores = navigator.hardwareConcurrency || 4;
      const budget = cores <= 4 ? 45 : cores <= 8 ? 80 : 110;
      const count = Math.round(
        Math.min(budget, Math.max(28, (width * height) / 16000))
      );
      particles = Array.from({ length: count }, (_, i) => {
        const z = 0.25 + seeded(i * 3.1) * 0.75;
        return {
          x: seeded(i * 1.7) * width,
          y: seeded(i * 2.3) * height,
          z,
          r: (0.7 + seeded(i * 5.9) * 2.1) * z,
          vx: (seeded(i * 7.3) - 0.5) * 8 * z,
          vy: -(6 + seeded(i * 11.1) * 16) * z,
          phase: seeded(i * 13.7) * Math.PI * 2,
          drift: 0.35 + seeded(i * 17.3) * 0.9,
          color: Math.floor(seeded(i * 19.7) * 3),
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      /* Don't burn frames once the hero has scrolled away. */
      if (document.hidden || window.scrollY > height * 1.25) return;

      ctx.clearRect(0, 0, width, height);
      const time = now / 1000;
      const palette = colorsRef.current;

      for (const p of particles) {
        /* Turbulent wind: two out-of-phase sines read as air, not a loop. */
        const wind =
          Math.sin(time * 0.35 * p.drift + p.phase) * 10 * p.z +
          Math.sin(time * 0.11 + p.y * 0.01) * 5 * p.z;

        p.x += (p.vx + wind) * dt;
        p.y += p.vy * dt;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        /* Depth drives size, brightness and a slow breathing flicker. */
        const twinkle = 0.55 + 0.45 * Math.sin(time * 1.1 * p.drift + p.phase);
        ctx.globalAlpha = 0.1 + p.z * 0.42 * twinkle;
        ctx.fillStyle = palette[p.color] || palette[0];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className={`pointer-events-none ${className}`} />;
}
