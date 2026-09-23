"use client";

import { useEffect, useState } from "react";
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

/* Confetti is precomputed at module level from seeded() so every burst is
   identical and no Math.random() runs during render. Each piece shoots
   up and out, then gravity pulls it down past its launch point. */
const CONFETTI_COLORS = ["bg-accent", "bg-accent-2-light", "bg-pop", "bg-accent-light"];
export const CONFETTI = Array.from({ length: 40 }, (_, i) => {
  const angle = -Math.PI / 2 + (seeded(i + 3) - 0.5) * Math.PI * 1.5;
  const power = 90 + seeded(i * 7 + 1) * 120;
  const dx = Math.cos(angle) * power;
  const dy = Math.sin(angle) * power;
  return {
    x: [0, dx * 0.8, dx],
    y: [0, dy, dy + 140 + seeded(i * 5) * 80],
    rotate: [0, (seeded(i * 11) - 0.5) * 540],
    delay: seeded(i * 13) * 0.12,
    duration: 1.3 + seeded(i * 17) * 0.5,
    round: i % 3 === 0,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  /* Sending is simulated for now — there is no backend yet. */
  useEffect(() => {
    if (status !== "sending") return;
    const timer = setTimeout(() => setStatus("sent"), 900);
    return () => clearTimeout(timer);
  }, [status]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "idle") setStatus("sending");
  }

  const sending = status === "sending";

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={SPRING_SOFT}
          className="relative rounded-2xl border border-accent/30 bg-accent/5 p-10 text-center"
        >
          {/* confetti burst */}
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              aria-hidden
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
              animate={{ opacity: [1, 1, 0], x: c.x, y: c.y, rotate: c.rotate, scale: 1 }}
              transition={{
                duration: c.duration,
                delay: 0.1 + c.delay,
                ease: [0.2, 0.7, 0.4, 1],
                opacity: { duration: c.duration, delay: 0.1 + c.delay, times: [0, 0.7, 1] },
                scale: { duration: 0.25, delay: 0.1 + c.delay, ease: EASE_EXPO },
              }}
              className={`absolute left-1/2 top-16 ${
                c.round ? "h-1.5 w-1.5 rounded-full" : "h-2.5 w-1 rounded-[1px]"
              } ${c.color}`}
            />
          ))}

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
            disabled={sending}
            aria-busy={sending}
            whileHover={sending ? undefined : { scale: 1.03 }}
            whileTap={sending ? undefined : { scale: 0.97 }}
            transition={SPRING_SNAPPY}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-background disabled:cursor-wait sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2-light to-accent bg-[length:200%_100%] transition-[background-position] duration-700 group-hover:bg-[position:100%_0]" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/30 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={sending ? "sending" : "idle"}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.25, ease: EASE_EXPO }}
                className="relative flex items-center gap-2"
              >
                {sending ? (
                  <>
                    Gönderiliyor
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="block h-3.5 w-3.5 rounded-full border-2 border-background/30 border-t-background"
                    />
                  </>
                ) : (
                  <>
                    Gönder
                    <motion.span
                      animate={{ x: [0, 3, 0], rotate: [0, -8, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                    >
                      <Send size={15} />
                    </motion.span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
