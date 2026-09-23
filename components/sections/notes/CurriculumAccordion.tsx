"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CURRICULUM, NOTE_TABS, type Tone, TONE_CLASSES } from "@/lib/data";
import { EASE_EXPO, SPRING_SOFT, staggerContainer } from "@/lib/motion";

export function CurriculumRow({
  grade,
  topics,
  tone,
  isOpen,
  onToggle,
}: {
  grade: string;
  topics: string[];
  tone: Tone;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const toneClasses = TONE_CLASSES[tone];

  return (
    <div className="border-b border-foreground/10 last:border-none">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-5 text-left"
      >
        <div className="flex items-center gap-4">
          <motion.span
            animate={{ x: isOpen ? 6 : 0 }}
            transition={SPRING_SOFT}
            className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
              isOpen ? toneClasses.category : "text-foreground/70 group-hover:text-foreground"
            }`}
          >
            {grade}
          </motion.span>
          <span className="text-xs text-foreground/30">{topics.length} konu</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          transition={SPRING_SOFT}
          className="text-foreground/40 group-hover:text-foreground/70"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.5, ease: EASE_EXPO },
              opacity: { duration: 0.3 },
            }}
            className="overflow-hidden"
          >
            <motion.div
              variants={staggerContainer(0.035)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 pb-6"
            >
              {topics.map((topic) => (
                <motion.span
                  key={topic}
                  variants={{
                    hidden: { opacity: 0, y: 12, scale: 0.92 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: SPRING_SOFT },
                  }}
                  whileHover={{ scale: 1.07, y: -2 }}
                  className={`cursor-default rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-foreground/60 transition-colors duration-300 ${toneClasses.border}`}
                >
                  {topic}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CurriculumAccordion({ tab, tone }: { tab: (typeof NOTE_TABS)[number]; tone: Tone }) {
  const [openIndex, setOpenIndex] = useState(0);
  const groups = CURRICULUM[tab];

  return (
    <div className="mt-4 rounded-3xl border border-foreground/10 bg-foreground/[0.015] px-6 sm:px-8">
      {groups.map((g, i) => (
        <CurriculumRow
          key={g.grade}
          grade={g.grade}
          topics={g.topics}
          tone={tone}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
