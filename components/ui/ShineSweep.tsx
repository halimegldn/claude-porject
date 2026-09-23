"use client";

/* ------------------------------------------------------------------ */
/*  Shared card chrome                                                 */
/* ------------------------------------------------------------------ */

export function ShineSweep() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[400%]" />
    </span>
  );
}
