"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShineSweep } from "@/components/ui/ShineSweep";
import { SOCIALS } from "@/lib/data";
import { fadeUp, SPRING_SNAPPY, SPRING_SOFT, staggerContainer } from "@/lib/motion";

export function Contact() {
  return (
    <section id="iletisim" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="04"
          lines={["Aklında Bir", "Soru mu Var?"]}
          desc="Biyoloji bazen karmaşık görünebilir. Birlikte çözelim."
          className="mb-10 max-w-xl"
        />

        <div className="grid gap-16 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <motion.div
            variants={staggerContainer(0.1, 0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex gap-4 md:flex-col md:justify-start"
          >
            {SOCIALS.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                variants={fadeUp}
                whileHover={{ x: 8, scale: 1.02 }}
                transition={SPRING_SOFT}
                className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-foreground/10 px-5 py-4 text-sm text-foreground/70 transition-colors hover:border-accent/40 hover:text-foreground"
              >
                <ShineSweep />
                <motion.span
                  whileHover={{ rotate: 14, scale: 1.25 }}
                  transition={SPRING_SNAPPY}
                  className="relative inline-flex text-accent"
                >
                  <social.icon size={17} strokeWidth={1.5} />
                </motion.span>
                <span className="relative">{social.label}</span>
                <ArrowUpRight
                  size={13}
                  className="relative ml-auto hidden text-accent/50 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 md:block"
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
