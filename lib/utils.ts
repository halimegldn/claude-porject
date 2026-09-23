/** Deterministic pseudo-random in [0,1). Rounded because Math.sin is only
    accurate to ~1ulp and Node and the browser disagree in the last bits —
    unrounded, every seeded attribute becomes a hydration mismatch. */
export function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1e5) / 1e5;
}
