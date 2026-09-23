"use client";

import { motion } from "framer-motion";
import { Microscope } from "lucide-react";
import { LeafIllustration } from "@/components/illustrations/LeafIllustration";
import { AccentBar } from "@/components/ui/AccentBar";
import { FloatingDecor } from "@/components/ui/FloatingDecor";
import { MaskLine } from "@/components/ui/MaskLine";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { ShineSweep } from "@/components/ui/ShineSweep";
import { PHILOSOPHY } from "@/lib/data";
import { fadeUpBig, scaleIn, SPRING_SNAPPY, SPRING_SOFT, staggerContainer } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  About / Vision                                                     */
/* ------------------------------------------------------------------ */

export function About() {
  return (
    <section id="hakkimda" className="relative overflow-hidden px-6 py-32 sm:py-40">
      <FloatingDecor icon={Microscope} className="right-[6%] top-24" duration={11} delay={0.8} />

      <Parallax
        distance={70}
        className="pointer-events-none absolute -left-16 bottom-0 hidden h-80 w-80 md:block"
      >
        <motion.div
          animate={{ rotate: [-3.5, 3.5, -3.5], skewX: [0, 1.5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 100%" }}
          className="h-full w-full"
        >
          <LeafIllustration className="h-full w-full" />
        </motion.div>
      </Parallax>

      <div className="mx-auto max-w-5xl">
        <div className="relative grid items-start gap-6 md:grid-cols-[auto_1fr] md:gap-12">
          <motion.span
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="-mt-6 hidden select-none text-[10rem] font-semibold leading-none text-foreground/[0.04] md:block"
          >
            01
          </motion.span>

          <div>
            <AccentBar />
            <motion.h2
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
            >
              <MaskLine>Biyolojiyi Ezberletmiyorum.</MaskLine>
              <MaskLine className="text-accent">Anlamayı Öğretiyorum.</MaskLine>
            </motion.h2>

            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl leading-relaxed text-foreground/60">
                On yılı aşkın süredir hem ortaokulda Fen Bilimleri hem de lisede
                Biyoloji öğretiyorum; amacım öğrencilerin konuları ezberlemesi
                değil, yaşamın arkasındaki sistemi görmesi. Kuvvetten hücreye,
                ekosistemden genetiğe, her ölçekte aynı merakla yaklaşıyorum.
              </p>
            </Reveal>

            <motion.div
              variants={staggerContainer(0.14)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-14 grid gap-5 sm:grid-cols-3"
            >
              {PHILOSOPHY.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUpBig}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={SPRING_SOFT}
                  className="group relative rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 transition-colors duration-500 hover:border-accent/30"
                >
                  <ShineSweep />
                  <motion.div
                    whileHover={{ rotate: 14, scale: 1.2 }}
                    transition={SPRING_SNAPPY}
                    className="relative mb-4 inline-block"
                  >
                    <item.icon size={20} className="text-accent" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="relative mb-2 font-medium text-foreground/90">{item.title}</h3>
                  <p className="relative text-sm leading-relaxed text-foreground/50">
                    {item.desc}
                  </p>
                  <motion.span className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
