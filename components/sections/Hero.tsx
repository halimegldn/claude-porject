"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "@/components/sections/hero/HeroBackground";
import { ScrollIndicator } from "@/components/sections/hero/ScrollIndicator";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MaskLine } from "@/components/ui/MaskLine";
import { SplitText } from "@/components/ui/SplitText";
import { useIntroReady } from "@/lib/intro";
import { fadeUp, staggerContainer } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const ready = useIntroReady();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Content leaves faster than the background and softens as it goes —
     the same depth cue a camera rack-focus gives you. */
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const blurAmount = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const contentFilter = useMotionTemplate`blur(${blurAmount}px)`;

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <HeroBackground
        mouseX={mouseX}
        mouseY={mouseY}
        scrollProgress={scrollYProgress}
        ready={ready}
      />

      <motion.div
        style={{
          y: contentY,
          scale: contentScale,
          opacity: contentOpacity,
          filter: contentFilter,
        }}
        className="relative z-10 max-w-4xl text-center"
      >
        <motion.div
          variants={staggerContainer(0.14, 0.15)}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 flex items-center justify-center gap-3 text-xs font-medium tracking-[0.3em] text-accent/80 sm:text-sm"
          >
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent text-accent ring-pulse" />
            FEN BİLİMLERİ • BİYOLOJİ • YAŞAM
          </motion.p>

          <h1 className="text-[13vw] font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <MaskLine className="text-gradient-anim">Yaşamın Kodlarını</MaskLine>
            <span className="block text-foreground/95">
              <SplitText text="Birlikte Keşfedelim." />
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-foreground/60 sm:text-lg"
          >
            Ortaokulda Fen Bilimleri, lisede Biyoloji — biyolojiyi ezberlenecek
            bilgilerden çıkarıp, yaşamı anlamanın bir yoluna dönüştürüyoruz.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticButton
              href="#notlar"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-background transition-shadow hover:shadow-[0_0_50px_-8px_rgb(from_var(--accent)_r_g_b_/_75%)]"
            >
              Ders Notlarını Keşfet
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </MagneticButton>
            <MagneticButton
              href="#hakkimda"
              strength={0.28}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-7 py-3.5 text-sm text-foreground/80 transition-colors hover:border-accent/40 hover:text-foreground"
            >
              Ben Kimim?
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      <ScrollIndicator opacity={contentOpacity} />
    </section>
  );
}
