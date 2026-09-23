"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send } from "lucide-react";
import { EASE_EXPO, fadeUp, SPRING_SNAPPY, SPRING_SOFT, staggerContainer } from "@/lib/motion";
import { seeded } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

export const INPUT_CLASS =
  "peer w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 pb-3 pt-6 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent/60 focus:bg-foreground/[0.05] focus:shadow-[0_0_0_4px_rgb(from_var(--accent)_r_g_b_/_10%)]";

export const LABEL_CLASS =
  "pointer-events-none absolute left-4 top-4 origin-left text-sm text-foreground/35 transition-all duration-300 peer-focus:top-2 peer-focus:text-[10px] peer-focus:tracking-[0.18em] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.18em]";

export function Field({
  name,
  label,
  type = "text",
  value,
  onChange,
}: {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <motion.div variants={fadeUp} className="relative">
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={INPUT_CLASS}
      />
      <span className={LABEL_CLASS}>{label}</span>
    </motion.div>
  );
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={SPRING_SOFT}
          className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 p-10 text-center"
        >
          {/* confetti burst */}
          {Array.from({ length: 14 }, (_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: 0,
                  x: Math.cos(angle) * (60 + seeded(i) * 70),
                  y: Math.sin(angle) * (60 + seeded(i * 2) * 70),
                  scale: 1,
                }}
                transition={{ duration: 1.1, delay: 0.15, ease: EASE_EXPO }}
                className={`absolute left-1/2 top-10 h-1.5 w-1.5 rounded-full ${
                  i % 2 ? "bg-accent" : "bg-accent-2-light"
                }`}
              />
            );
          })}

          <motion.span
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.1 }}
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent"
          >
            <Check size={22} strokeWidth={2.5} />
          </motion.span>
          <p className="font-medium text-accent">Mesajın ulaştı.</p>
          <p className="mt-2 text-sm text-foreground/50">En kısa sürede dönüş yapacağım.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -12 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Ad Soyad" value={form.name} onChange={handleChange} />
            <Field
              name="email"
              label="E-posta"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <Field name="subject" label="Konu" value={form.subject} onChange={handleChange} />

          <motion.div variants={fadeUp} className="relative">
            <textarea
              required
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder=" "
              rows={5}
              className={`${INPUT_CLASS} resize-none`}
            />
            <span className={LABEL_CLASS}>Mesaj</span>
          </motion.div>

          <motion.button
            variants={fadeUp}
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-background sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2-light to-accent bg-[length:200%_100%] transition-[background-position] duration-700 group-hover:bg-[position:100%_0]" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/30 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full" />
            <span className="relative flex items-center gap-2">
              Gönder
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Send size={15} />
              </motion.span>
            </span>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
