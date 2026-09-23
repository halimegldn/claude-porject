import { TONE_CLASSES, TOPICS_TICKER } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Topics marquee — two counter-running strips at a steady rate.      */
/*  Coupling the speed to scroll velocity made the strip lurch and     */
/*  change direction under the reader, so it runs on pure CSS instead. */
/*  Filled and hollow items alternate; hover pauses the strip.         */
/* ------------------------------------------------------------------ */

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div
      className="marquee-track flex w-max items-center gap-10 whitespace-nowrap"
      data-reverse={reverse ? "" : undefined}
    >
      {loop.map((topic, i) => (
        <span
          key={i}
          aria-hidden={i >= items.length}
          className="flex items-center gap-10 text-base font-medium tracking-[0.18em] sm:text-xl"
        >
          <span
            className={
              (i + (reverse ? 1 : 0)) % 2 === 0
                ? "text-foreground/35 transition-colors duration-300 hover:text-foreground/80"
                : "text-outline"
            }
          >
            {topic}
          </span>
          <span
            className={`text-sm ${i % 2 === 0 ? TONE_CLASSES.accent.dot : TONE_CLASSES.pop.dot}`}
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const reversed = [...TOPICS_TICKER].reverse();

  return (
    <section className="marquee mask-fade-x relative flex flex-col gap-4 overflow-hidden border-y border-foreground/5 bg-foreground/[0.015] py-6">
      <MarqueeRow items={TOPICS_TICKER} />
      <MarqueeRow items={reversed} reverse />
    </section>
  );
}
