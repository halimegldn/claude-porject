"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, useIsomorphicLayoutEffect } from "framer-motion";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { SectionRail } from "@/components/layout/SectionRail";
import { Preloader } from "@/components/Preloader";
import { About } from "@/components/sections/About";
import { Branches } from "@/components/sections/Branches";
import { CellVisual } from "@/components/sections/CellVisual";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Notes } from "@/components/sections/Notes";
import { Quote } from "@/components/sections/Quote";
import { Stats } from "@/components/sections/Stats";
import { getReducedMotion, getServerReducedMotion, subscribeReducedMotion } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [loading, setLoading] = useState(true);
  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion
  );

  /* Skip the intro for returning visitors and for anyone who asked for
     reduced motion — both before first paint, so no curtain ever flashes. */
  useIsomorphicLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("bio-intro-seen") === "1") setLoading(false);
    } catch {}
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (prefersReduced) setLoading(false);
  }, [prefersReduced]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("bio-intro-seen", "1");
      } catch {}
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <main className="relative overflow-x-clip bg-background text-foreground">
        <div className="aurora" />
        <div className="noise-overlay" />
        <ScrollProgress />
        <CursorGlow />
        <CustomCursor />
        <FloatingNav />
        <SectionRail />
        <BackToTop />
        <div className="relative z-10">
          <Hero />
          <Marquee />
          <Branches />
          <About />
          <CellVisual />
          <Notes />
          <Stats />
          <Quote />
          <Contact />
          <Footer />
        </div>
      </main>
    </MotionConfig>
  );
}
