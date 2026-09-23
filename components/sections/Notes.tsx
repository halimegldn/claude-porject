"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";
import { Atom } from "lucide-react";
import { CurriculumAccordion } from "@/components/sections/notes/CurriculumAccordion";
import { NoteCard } from "@/components/sections/notes/NoteCard";
import { FloatingDecor } from "@/components/ui/FloatingDecor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NOTE_TAB_TONE, NOTE_TABS, NOTES_BY_TAB, TONE_CLASSES } from "@/lib/data";
import { EASE, EASE_EXPO } from "@/lib/motion";

/* The card panel slides in from the side of the tab you moved toward and
   leaves toward the other, so switching tabs reads as moving through
   space. Cards inside still stagger in on the same "visible" label. */
const PANEL_VARIANTS: Variants = {
  hidden: (d: number) => ({ opacity: 0, x: d * 60, filter: "blur(8px)" }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_EXPO, staggerChildren: 0.12 },
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d * -40,
    filter: "blur(8px)",
    transition: { duration: 0.32, ease: EASE },
  }),
};

export function Notes() {
  const [tab, setTab] = useState<(typeof NOTE_TABS)[number]>(NOTE_TABS[0]);
  const [direction, setDirection] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  /* Cards wait until the grid is on screen — they used to play on mount,
     far below the fold, where nobody could see them. */
  const inView = useInView(gridRef, { once: true, margin: "-100px" });
  const activeTone = NOTE_TAB_TONE[tab];

  function selectTab(next: (typeof NOTE_TABS)[number]) {
    setDirection(NOTE_TABS.indexOf(next) > NOTE_TABS.indexOf(tab) ? 1 : -1);
    setTab(next);
  }

  /* Arrow keys, Home and End move between tabs, as the tabs pattern expects. */
  function handleTabKeys(e: React.KeyboardEvent<HTMLDivElement>) {
    const current = NOTE_TABS.indexOf(tab);
    let nextIndex: number;
    if (e.key === "ArrowRight") nextIndex = (current + 1) % NOTE_TABS.length;
    else if (e.key === "ArrowLeft") nextIndex = (current - 1 + NOTE_TABS.length) % NOTE_TABS.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = NOTE_TABS.length - 1;
    else return;
    e.preventDefault();
    const next = NOTE_TABS[nextIndex];
    selectTab(next);
    const buttons = e.currentTarget.querySelectorAll("button");
    buttons[NOTE_TABS.indexOf(next)]?.focus();
  }

  return (
    <section id="notlar" className="relative overflow-hidden px-6 py-32 sm:py-40">
      <FloatingDecor icon={Atom} className="right-[4%] top-20" duration={9} />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          lines={["Bilgiyi", "Keşfet"]}
          desc="Kademene göre seç: Fen Bilimleri mi, Biyoloji mi? Aşağıda sınıf sınıf tüm müfredatı bulabilirsin."
          className="mb-10 max-w-xl"
        />

        <Reveal className="mb-14 inline-block" delay={0.1}>
          <div
            role="tablist"
            aria-label="Kademe seçimi"
            onKeyDown={handleTabKeys}
            className="relative inline-flex rounded-full border border-foreground/10 bg-foreground/[0.02] p-1"
          >
            {NOTE_TABS.map((t) => (
              <motion.button
                key={t}
                role="tab"
                aria-selected={tab === t}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => selectTab(t)}
                whileTap={{ scale: 0.96 }}
                className={`relative z-10 rounded-full px-5 py-2.5 text-sm transition-colors duration-300 ${
                  tab === t ? "text-background" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-pill"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    className={`absolute inset-0 -z-10 rounded-full ${TONE_CLASSES[NOTE_TAB_TONE[t]].pillBg}`}
                  />
                )}
                {t}
              </motion.button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={tab}
            ref={gridRef}
            variants={PANEL_VARIANTS}
            custom={direction}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            exit="exit"
            className="grid gap-6 md:grid-cols-3"
          >
            {NOTES_BY_TAB[tab].map((note, i) => (
              <NoteCard key={note.title} note={note} tone={activeTone} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal className="mt-20">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">Tüm Konular</h3>
          <p className="mt-2 text-sm text-foreground/40">
            Sınıfına tıkla, o sınıfın tüm üniteleri açılsın.
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)", transition: { duration: 0.25 } }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
            >
              <CurriculumAccordion tab={tab} tone={activeTone} />
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
