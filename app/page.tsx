"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useInView,
  useScroll,
  useAnimationFrame,
  useReducedMotion,
  useIsomorphicLayoutEffect,
  type Variants,
  type MotionValue,
} from "framer-motion";
import {
  Dna,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  Check,
  Compass,
  Sparkles,
  Lightbulb,
  Camera,
  Play,
  Briefcase,
  Mail,
  Send,
  Atom,
  FlaskConical,
  Microscope,
  Leaf,
  GraduationCap,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Motion language — every timing in the site comes from here.        */
/*  Entrances use expo-out (fast start, long settle) so content feels  */
/*  "placed" rather than slid; interactions use springs so they carry  */
/*  weight and can be interrupted mid-flight.                          */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const SPRING_SOFT = { type: "spring", stiffness: 90, damping: 20, mass: 1 } as const;
const SPRING_SNAPPY = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 } as const;
const SPRING_CHAR = { type: "spring", stiffness: 300, damping: 26, mass: 0.8 } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE_EXPO },
  },
};

const fadeUpBig: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_EXPO },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_EXPO },
  },
};

/* A line that rises out of its own clipping box, with a touch of skew
   so the leading edge lags — the way real typeset lines settle. */
const maskLine: Variants = {
  hidden: { y: "110%", opacity: 0, skewY: 3.5 },
  visible: {
    y: "0%",
    opacity: 1,
    skewY: 0,
    transition: { duration: 1.15, ease: EASE_EXPO },
  },
};

const charIn: Variants = {
  hidden: { opacity: 0, y: "0.6em", rotateX: -80 },
  visible: { opacity: 1, y: "0em", rotateX: 0, transition: SPRING_CHAR },
};

const staggerContainer = (stagger = 0.15, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/* ------------------------------------------------------------------ */
/*  Small math helpers                                                 */
/* ------------------------------------------------------------------ */

/** Watches an element and reports visibility through a ref, so animation
    loops can idle when their subject is off screen without re-rendering. */
function useVisibilityRef<T extends Element>() {
  const elementRef = useRef<T>(null);
  const visible = useRef(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { elementRef, visible };
}

/** Deterministic pseudo-random in [0,1). Rounded because Math.sin is only
    accurate to ~1ulp and Node and the browser disagree in the last bits —
    unrounded, every seeded attribute becomes a hydration mismatch. */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1e5) / 1e5;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Hakkımda", href: "#hakkimda" },
  { label: "Branşlar", href: "#branslar" },
  { label: "Ders Notları", href: "#notlar" },
  { label: "İletişim", href: "#iletisim" },
];

const BRANCHES = [
  {
    icon: Atom,
    kademe: "ORTAOKUL",
    title: "Fen Bilimleri",
    desc: "Maddeyi, kuvveti ve canlıları meraklı bir zihinle keşfetmenin en eğlenceli hali.",
    topics: ["Kuvvet ve Hareket", "Madde ve Isı", "Canlılar ve Yaşam", "Dünya ve Evren"],
    tone: "pop" as const,
  },
  {
    icon: GraduationCap,
    kademe: "LİSE",
    title: "Biyoloji",
    desc: "Hücreden ekosisteme, YKS'ye hazırlanırken derinlemesine ve sistemli bir bakış.",
    topics: ["Hücre Biyolojisi", "Genetik", "Fizyoloji", "Ekoloji"],
    tone: "accent" as const,
  },
];

/* Literal class strings per tone — kept whole so Tailwind's scanner picks them up. */
const TONE_CLASSES = {
  accent: {
    badge: "bg-accent/10 text-accent",
    label: "text-accent/70",
    border: "hover:border-accent/40",
    dot: "text-accent/50",
    category: "text-accent/80",
    pillBg: "bg-gradient-to-r from-accent to-accent-2-light",
    glowVar: "var(--accent-2)",
  },
  pop: {
    badge: "bg-pop/10 text-pop",
    label: "text-pop/70",
    border: "hover:border-pop/40",
    dot: "text-pop/50",
    category: "text-pop/80",
    pillBg: "bg-gradient-to-r from-pop to-pop-light",
    glowVar: "var(--pop)",
  },
} as const;

type Tone = keyof typeof TONE_CLASSES;

const TOPICS_TICKER = [
  "HÜCRE",
  "FOTOSENTEZ",
  "KUVVET VE HAREKET",
  "GENETİK",
  "MADDE VE ISI",
  "EKOSİSTEMLER",
  "DNA",
  "İNSAN VE ÇEVRE",
  "HÜCRE BÖLÜNMESİ",
  "KALITIM",
];

const PHILOSOPHY = [
  {
    icon: Sparkles,
    title: "Merak Et",
    desc: "Sorular bilimin başlangıç noktasıdır.",
  },
  {
    icon: Compass,
    title: "Keşfet",
    desc: "Konuları gerçek yaşamla ilişkilendir.",
  },
  {
    icon: Lightbulb,
    title: "Anla",
    desc: "Ezberlemek yerine sistemin nasıl çalıştığını öğren.",
  },
];

const NOTE_TABS = ["Ortaokul • Fen Bilimleri", "Lise • Biyoloji"] as const;

const NOTE_TAB_TONE: Record<(typeof NOTE_TABS)[number], Tone> = {
  "Ortaokul • Fen Bilimleri": "pop",
  "Lise • Biyoloji": "accent",
};

const NOTES_FEN = [
  {
    category: "KUVVET VE HAREKET",
    title: "Sürtünme Kuvvetini Anlamak",
    desc: "Günlük hayattan örneklerle sürtünmenin hareketi nasıl etkilediğini keşfet.",
  },
  {
    category: "MADDE VE ISI",
    title: "Maddenin Hâlleri Neden Değişir?",
    desc: "Isı alışverişi ile katı, sıvı ve gaz arasındaki geçişleri deneylerle inceliyoruz.",
  },
  {
    category: "CANLILAR VE YAŞAM",
    title: "Vücudumuzdaki Sistemler",
    desc: "Sindirim, dolaşım ve solunum sistemlerinin birlikte nasıl çalıştığını öğren.",
  },
];

const NOTES_BIO = [
  {
    category: "YKS BİYOLOJİ",
    title: "YKS Biyoloji Şifreleri",
    desc: "Soruları daha hızlı çözmeni sağlayacak temel biyolojik bağlantılar.",
  },
  {
    category: "BİTKİ BİYOLOJİSİ",
    title: "Fotosentezin Bilinmeyenleri",
    desc: "Bir yaprağın içerisinde gerçekleşen inanılmaz enerji dönüşümüne yakından bakalım.",
  },
  {
    category: "GENETİK",
    title: "DNA: Yaşamın Kaynak Kodu",
    desc: "Milyarlarca yıllık biyolojik bilginin dört harfle nasıl saklandığını keşfet.",
  },
];

const NOTES_BY_TAB: Record<(typeof NOTE_TABS)[number], typeof NOTES_BIO> = {
  "Ortaokul • Fen Bilimleri": NOTES_FEN,
  "Lise • Biyoloji": NOTES_BIO,
};

const CURRICULUM: Record<(typeof NOTE_TABS)[number], { grade: string; topics: string[] }[]> = {
  "Ortaokul • Fen Bilimleri": [
    {
      grade: "5. Sınıf",
      topics: [
        "Güneş, Dünya ve Ay",
        "Canlılar Dünyasını Gezelim, Tanıyalım",
        "Kuvvetin Ölçülmesi ve Sürtünme",
        "Maddenin Değişimi",
        "Işığın Yayılması",
        "Canlılar ve Enerji İlişkileri",
        "İnsan ve Çevre",
        "Elektrik Enerjisi",
      ],
    },
    {
      grade: "6. Sınıf",
      topics: [
        "Güneş Sistemi ve Tutulmalar",
        "Vücudumuzdaki Sistemler",
        "Kuvvet ve Hareket",
        "Madde ve Isı",
        "Sesin Yayılması",
        "Yaşamımızdaki Elektrik",
        "Madde ve Endüstri",
      ],
    },
    {
      grade: "7. Sınıf",
      topics: [
        "Güneş Sistemi ve Ötesi",
        "Hücre ve Bölünmeler",
        "Kuvvet ve Enerji",
        "Saf Madde ve Karışımlar",
        "Işığın Madde ile Etkileşimi",
        "Elektrik Yükleri ve Elektrik Enerjisi",
      ],
    },
    {
      grade: "8. Sınıf",
      topics: [
        "Mevsimler ve İklim",
        "DNA ve Genetik Kod",
        "Basınç",
        "Madde ve Endüstri",
        "Basit Makineler",
        "Enerji Dönüşümleri ve Çevre Bilimi",
        "Elektrik Yükleri ve Elektrik Enerjisi",
      ],
    },
  ],
  "Lise • Biyoloji": [
    {
      grade: "9. Sınıf",
      topics: ["Yaşam Bilimi Biyoloji", "Hücre", "Canlılar Dünyası"],
    },
    {
      grade: "10. Sınıf",
      topics: [
        "Hücre Bölünmeleri ve Üreme",
        "Kalıtımın Genel İlkeleri",
        "Ekosistem Ekolojisi",
        "Güncel Çevre Sorunları",
      ],
    },
    {
      grade: "11. Sınıf",
      topics: [
        "Destek ve Hareket Sistemi",
        "Sindirim Sistemi",
        "Dolaşım ve Bağışıklık Sistemi",
        "Solunum Sistemi",
        "Boşaltım Sistemi",
        "Denetleyici ve Düzenleyici Sistem",
        "Duyu Organları",
        "Endokrin Sistem",
        "Üreme Sistemi ve Embriyonik Gelişim",
      ],
    },
    {
      grade: "12. Sınıf",
      topics: [
        "Canlılarda Enerji Dönüşümleri",
        "Bitki Biyolojisi",
        "Komünite ve Popülasyon Ekolojisi",
        "Genden Proteine",
      ],
    },
  ],
};

const STATS: { value: number | string; suffix?: string; label: string }[] = [
  { value: 100, suffix: "+", label: "Ders Notu" },
  { value: 500, suffix: "+", label: "Öğrenci" },
  { value: 2, label: "Farklı Kademe" },
  { value: 10, suffix: "+", label: "Yıllık Deneyim" },
  { value: "∞", label: "Merak" },
];

const SOCIALS = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Play, href: "#", label: "YouTube" },
  { icon: Briefcase, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:merhaba@bio.dev", label: "E-mail" },
];

/* ------------------------------------------------------------------ */
/*  Theme store                                                        */
/* ------------------------------------------------------------------ */

type ThemeName = "dark" | "light";
const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}

function getThemeSnapshot(): ThemeName {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): ThemeName {
  return "dark";
}

function applyTheme(next: ThemeName) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
  themeListeners.forEach((listener) => listener());
}

/* The palette swap rides a View Transition where supported, so the two
   themes cross-dissolve instead of snapping channel by channel. */
function setGlobalTheme(next: ThemeName) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  if (typeof doc.startViewTransition !== "function") {
    applyTheme(next);
    return;
  }
  const transition = doc.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { opacity: [0, 1] },
        {
          duration: 500,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {});
}

/** Reads a CSS custom property off <html>, re-reading whenever the theme flips. */
function useThemeColors(names: string[]) {
  const [colors, setColors] = useState<string[]>(() => names.map(() => "#34d399"));

  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      setColors(names.map((n) => styles.getPropertyValue(n).trim() || "#34d399"));
    };
    read();
    return subscribeTheme(read);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names.join(",")]);

  return colors;
}

/* ------------------------------------------------------------------ */
/*  Preloader — draws the logo, counts the load, then splits away.     */
/* ------------------------------------------------------------------ */

function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const total = 1500;
    let raf = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone();
    };
    const tick = (now: number) => {
      /* Ease the counter out so it decelerates into 100 like a real load. */
      const t = Math.min((now - start) / total, 1);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 260);
    };
    raf = requestAnimationFrame(tick);

    /* Safety net: the counter rides requestAnimationFrame, which a paused
       compositor can stall indefinitely. Nothing may ever leave the visitor
       stuck behind an opaque overlay, so a timer force-finishes it. */
    const failsafe = setTimeout(finish, 4000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.55 } }}
    >
      {/* two curtains that part upward/downward on exit */}
      <motion.span
        className="absolute inset-x-0 top-0 h-1/2 bg-background-alt origin-top"
        exit={{ scaleY: 0, transition: { duration: 0.85, ease: EASE_EXPO } }}
      />
      <motion.span
        className="absolute inset-x-0 bottom-0 h-1/2 bg-background-alt origin-bottom"
        exit={{ scaleY: 0, transition: { duration: 0.85, ease: EASE_EXPO } }}
      />

      <motion.div
        className="relative flex flex-col items-center gap-6"
        exit={{ opacity: 0, y: -18, filter: "blur(8px)", transition: { duration: 0.4 } }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
          className="text-accent"
        >
          <Dna size={34} strokeWidth={1.4} />
        </motion.div>

        <div className="flex items-baseline gap-1 font-medium tracking-tight text-2xl">
          <span className="shimmer-text">BIO</span>
          <span className="text-accent">.</span>
        </div>

        <div className="relative h-px w-44 overflow-hidden bg-foreground/10">
          <motion.span
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-2-light"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-mono text-[11px] tabular-nums tracking-[0.3em] text-foreground/40">
          {String(progress).padStart(3, "0")}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom cursor — a hard dot on the real pointer position plus a     */
/*  spring-lagged ring, so motion reads as mass being dragged along.   */
/* ------------------------------------------------------------------ */

/* Pointer capability as an external store, so the cursor can be decided
   during render instead of being switched on from inside an effect. */
function subscribeFinePointer(callback: () => void) {
  const query = window.matchMedia("(pointer: fine)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getServerFinePointer() {
  return false;
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return false;
}

function CustomCursor() {
  const reduced = useReducedMotion();
  const fine = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointer,
    getServerFinePointer
  );
  const active = fine && !reduced;
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  /* Elements opt into a labelled cursor with data-cursor-label="Oku". */
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(
        !!target?.closest?.("a, button, input, textarea, [data-cursor='link']")
      );
      const labelled = target?.closest?.("[data-cursor-label]") as HTMLElement | null;
      setLabel(labelled?.dataset.cursorLabel ?? null);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [active, x, y]);

  if (!active) return null;

  return (
    <>
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: visible && !label ? 1 : 0,
          scale: pressed ? 0.6 : hovering ? 0.4 : 1,
        }}
        transition={SPRING_SNAPPY}
        className="pointer-events-none fixed left-0 top-0 z-[95] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent mix-blend-difference"
      />

      {/* The ring doubles as the label chip: over a labelled element it
          inflates into a filled pill rather than spawning a second object. */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.85 : label ? 1 : hovering ? 1.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="pointer-events-none fixed left-0 top-0 z-[94]"
      >
        <motion.div
          animate={{
            width: label ? 84 : 32,
            height: 32,
            backgroundColor: label
              ? "rgb(from var(--accent) r g b / 92%)"
              : "rgb(from var(--accent) r g b / 0%)",
            borderColor: label
              ? "rgb(from var(--accent) r g b / 0%)"
              : hovering
                ? "rgb(from var(--accent-2) r g b / 80%)"
                : "rgb(from var(--accent) r g b / 45%)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="-ml-4 -mt-4 flex items-center justify-center overflow-hidden rounded-full border"
        >
          <AnimatePresence mode="wait">
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="whitespace-nowrap text-[10px] font-medium tracking-[0.18em] text-background"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll progress — a filament across the top plus a moving glow.    */
/* ------------------------------------------------------------------ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.25 });
  const glowLeft = useTransform(scaleX, (v) => `${v * 100}%`);

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[3px]">
      <motion.div
        style={{ scaleX }}
        className="h-full origin-left bg-gradient-to-r from-accent via-accent-2-light to-accent"
      />
      <motion.div
        style={{ left: glowLeft }}
        className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/60 blur-md"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient pointer light                                              */
/* ------------------------------------------------------------------ */

function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 45, damping: 24, mass: 1.4 });
  const springY = useSpring(y, { stiffness: 45, damping: 24, mass: 1.4 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, x, y]);

  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed z-[55] hidden h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl mix-blend-screen md:block"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Particle field — spores drifting through the hero. Canvas keeps    */
/*  ~90 independent bodies cheap, and each one carries its own mass,   */
/*  depth and turbulence phase so the swarm never looks looped.        */
/* ------------------------------------------------------------------ */

type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  drift: number;
  color: number;
};

function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const colors = useThemeColors(["--accent", "--accent-2", "--accent-light"]);
  const colorsRef = useRef(colors);

  /* The draw loop reads the palette through a ref so a theme switch
     repaints the swarm without tearing down the particle system. */
  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let last = performance.now();

    const build = () => {
      /* Scale the swarm to the machine as well as the viewport — a
         4-core laptop should not be asked to push a desktop's count. */
      const cores = navigator.hardwareConcurrency || 4;
      const budget = cores <= 4 ? 45 : cores <= 8 ? 80 : 110;
      const count = Math.round(
        Math.min(budget, Math.max(28, (width * height) / 16000))
      );
      particles = Array.from({ length: count }, (_, i) => {
        const z = 0.25 + seeded(i * 3.1) * 0.75;
        return {
          x: seeded(i * 1.7) * width,
          y: seeded(i * 2.3) * height,
          z,
          r: (0.7 + seeded(i * 5.9) * 2.1) * z,
          vx: (seeded(i * 7.3) - 0.5) * 8 * z,
          vy: -(6 + seeded(i * 11.1) * 16) * z,
          phase: seeded(i * 13.7) * Math.PI * 2,
          drift: 0.35 + seeded(i * 17.3) * 0.9,
          color: Math.floor(seeded(i * 19.7) * 3),
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      /* Don't burn frames once the hero has scrolled away. */
      if (document.hidden || window.scrollY > height * 1.25) return;

      ctx.clearRect(0, 0, width, height);
      const time = now / 1000;
      const palette = colorsRef.current;

      for (const p of particles) {
        /* Turbulent wind: two out-of-phase sines read as air, not a loop. */
        const wind =
          Math.sin(time * 0.35 * p.drift + p.phase) * 10 * p.z +
          Math.sin(time * 0.11 + p.y * 0.01) * 5 * p.z;

        p.x += (p.vx + wind) * dt;
        p.y += p.vy * dt;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        /* Depth drives size, brightness and a slow breathing flicker. */
        const twinkle = 0.55 + 0.45 * Math.sin(time * 1.1 * p.drift + p.phase);
        ctx.globalAlpha = 0.1 + p.z * 0.42 * twinkle;
        ctx.fillStyle = palette[p.color] || palette[0];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className={`pointer-events-none ${className}`} />;
}

/* ------------------------------------------------------------------ */
/*  Rotating double helix — positions are solved per frame from the    */
/*  actual 3D parametric curve, so nodes really do pass behind each    */
/*  other: depth sets radius, opacity and stroke weight.               */
/* ------------------------------------------------------------------ */

const HELIX_NODES = 56;
const HELIX_HEIGHT = 430;
const HELIX_AMPLITUDE = 38;
const HELIX_TURNS = 2.6;

function helixNode(i: number, phase: number) {
  const t = i / HELIX_NODES;
  const angle = t * HELIX_TURNS * Math.PI * 2 + phase;
  return {
    x: Math.round((HELIX_AMPLITUDE * Math.sin(angle) + HELIX_AMPLITUDE + 10) * 100) / 100,
    y: Math.round((t * HELIX_HEIGHT + 10) * 100) / 100,
    depth: (Math.cos(angle) + 1) / 2, // 0 = far, 1 = near
  };
}

function Helix3D({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const { elementRef, visible } = useVisibilityRef<SVGSVGElement>();
  const strandA = useRef<SVGPolylineElement>(null);
  const strandB = useRef<SVGPolylineElement>(null);
  const nodesA = useRef<(SVGCircleElement | null)[]>([]);
  const nodesB = useRef<(SVGCircleElement | null)[]>([]);
  const rungs = useRef<(SVGLineElement | null)[]>([]);

  const indices = useMemo(() => Array.from({ length: HELIX_NODES + 1 }, (_, i) => i), []);
  const rungIndices = useMemo(() => indices.filter((i) => i % 4 === 0), [indices]);

  const initial = useMemo(() => {
    const a = indices.map((i) => helixNode(i, 0));
    const b = indices.map((i) => helixNode(i, Math.PI));
    return { a, b };
  }, [indices]);

  useAnimationFrame((t) => {
    if (reduced || !visible.current) return;
    const phase = (t / 1000) * 0.42;
    let pointsA = "";
    let pointsB = "";

    for (let i = 0; i <= HELIX_NODES; i++) {
      const a = helixNode(i, phase);
      const b = helixNode(i, phase + Math.PI);
      pointsA += `${a.x.toFixed(1)},${a.y.toFixed(1)} `;
      pointsB += `${b.x.toFixed(1)},${b.y.toFixed(1)} `;

      const ca = nodesA.current[i];
      if (ca) {
        ca.setAttribute("cx", a.x.toFixed(1));
        ca.setAttribute("r", (1.1 + a.depth * 2.4).toFixed(2));
        ca.setAttribute("opacity", (0.15 + a.depth * 0.75).toFixed(2));
      }
      const cb = nodesB.current[i];
      if (cb) {
        cb.setAttribute("cx", b.x.toFixed(1));
        cb.setAttribute("r", (1.1 + b.depth * 2.4).toFixed(2));
        cb.setAttribute("opacity", (0.15 + b.depth * 0.75).toFixed(2));
      }
    }

    strandA.current?.setAttribute("points", pointsA.trim());
    strandB.current?.setAttribute("points", pointsB.trim());

    rungIndices.forEach((i, k) => {
      const line = rungs.current[k];
      if (!line) return;
      const a = helixNode(i, phase);
      const b = helixNode(i, phase + Math.PI);
      line.setAttribute("x1", a.x.toFixed(1));
      line.setAttribute("x2", b.x.toFixed(1));
      line.setAttribute("opacity", (0.12 + Math.abs(a.depth - b.depth) * 0.42).toFixed(2));
      line.setAttribute("stroke-width", (0.6 + (a.depth + b.depth) * 0.7).toFixed(2));
    });
  });

  return (
    <svg
      ref={elementRef}
      className={className}
      width={HELIX_AMPLITUDE * 2 + 20}
      height={HELIX_HEIGHT + 20}
      viewBox={`0 0 ${HELIX_AMPLITUDE * 2 + 20} ${HELIX_HEIGHT + 20}`}
      fill="none"
      aria-hidden
    >
      {rungIndices.map((i, k) => {
        const a = initial.a[i];
        const b = initial.b[i];
        return (
          <line
            key={`rung-${i}`}
            ref={(el) => {
              rungs.current[k] = el;
            }}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={a.y}
            stroke="var(--accent)"
            strokeWidth="1"
            opacity="0.35"
          />
        );
      })}

      <polyline
        ref={strandA}
        points={initial.a.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
        stroke="var(--accent-light)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <polyline
        ref={strandB}
        points={initial.b.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
        stroke="var(--accent-2-light)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />

      {indices.map((i) => (
        <circle
          key={`a-${i}`}
          ref={(el) => {
            nodesA.current[i] = el;
          }}
          cx={initial.a[i].x}
          cy={initial.a[i].y}
          r={2}
          fill="var(--accent-light)"
          opacity="0.6"
        />
      ))}
      {indices.map((i) => (
        <circle
          key={`b-${i}`}
          ref={(el) => {
            nodesB.current[i] = el;
          }}
          cx={initial.b[i].x}
          cy={initial.b[i].y}
          r={2}
          fill="var(--accent-2-light)"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Theme toggle                                                       */
/* ------------------------------------------------------------------ */

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  return (
    <motion.button
      onClick={() => setGlobalTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      whileHover={{ scale: 1.08, rotate: 8 }}
      whileTap={{ scale: 0.9, rotate: -12 }}
      transition={SPRING_SNAPPY}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/10 text-foreground/70 transition-colors duration-300 hover:border-accent/40 hover:text-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -120, scale: 0.4, y: 8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, rotate: 120, scale: 0.4, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Moon size={16} strokeWidth={1.5} />
          ) : (
            <Sun size={16} strokeWidth={1.5} />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating nav — retracts when you scroll down, returns the moment   */
/*  you scroll back up, and tracks the section you're actually in.     */
/* ------------------------------------------------------------------ */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const SECTION_IDS = ["hero", "branslar", "hakkimda", "notlar", "iletisim"];

const RAIL_SECTIONS = [
  { id: "hero", label: "Başlangıç" },
  { id: "branslar", label: "Branşlar" },
  { id: "hakkimda", label: "Hakkımda" },
  { id: "notlar", label: "Ders Notları" },
  { id: "iletisim", label: "İletişim" },
];

/* A wayfinding rail: where you are in the document, always answerable
   without scrolling back to the nav. Desktop only — it needs the gutter. */
function SectionRail() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 1.2, ease: EASE_EXPO }}
      aria-label="Bölümler"
      className="fixed right-6 top-1/2 z-[58] hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      {RAIL_SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3"
          >
            <motion.span
              animate={{
                opacity: isActive ? 1 : 0,
                x: isActive ? 0 : 8,
              }}
              transition={{ duration: 0.45, ease: EASE_EXPO }}
              className="text-[10px] tracking-[0.25em] text-foreground/50 group-hover:opacity-100"
            >
              {section.label.toLocaleUpperCase("tr-TR")}
            </motion.span>
            <span className="relative flex h-3 w-3 items-center justify-center">
              <motion.span
                animate={{
                  scale: isActive ? 1 : 0.45,
                  backgroundColor: isActive
                    ? "rgb(from var(--accent) r g b / 100%)"
                    : "rgb(from var(--foreground) r g b / 25%)",
                }}
                transition={SPRING_SOFT}
                className="h-1.5 w-1.5 rounded-full"
              />
              {isActive && (
                <motion.span
                  layoutId="rail-halo"
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  className="absolute inset-0 rounded-full border border-accent/50"
                />
              )}
            </span>
          </a>
        );
      })}
    </motion.nav>
  );
}

function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const active = useActiveSection(SECTION_IDS);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    const delta = y - lastY.current;
    if (Math.abs(delta) > 6) {
      setHidden(delta > 0 && y > 260 && !open);
      lastY.current = y;
    }
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: EASE_EXPO, delay: hidden ? 0 : 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-6"
    >
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? "rgb(from var(--background) r g b / 72%)"
            : "rgb(from var(--background) r g b / 0%)",
          borderColor: scrolled
            ? "rgb(from var(--accent) r g b / 22%)"
            : "rgb(from var(--accent) r g b / 0%)",
          y: scrolled ? 0 : 4,
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`mt-4 flex w-full max-w-5xl items-center justify-between rounded-2xl border px-5 py-3 ${
          scrolled
            ? "backdrop-blur-xl shadow-[0_8px_40px_-18px_rgb(from_var(--accent-deep)_r_g_b_/_55%)]"
            : ""
        }`}
      >
        <a href="#hero" className="group flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.25 }}
            className="text-accent"
          >
            <Dna size={20} strokeWidth={1.5} />
          </motion.span>
          <span className="text-[15px] font-medium tracking-tight sm:text-base">
            BIO<span className="text-accent">.</span>
          </span>
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`group relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.07] ring-1 ring-inset ring-accent/20"
                  />
                )}
                <span className="relative">{link.label}</span>
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2-light transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.88 }}
            className="p-1 text-foreground/80 md:hidden"
            aria-label="Menüyü aç/kapat"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="block"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE_EXPO }}
            className="absolute inset-x-4 top-20 overflow-hidden rounded-2xl border border-accent/20 bg-background-alt/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              variants={staggerContainer(0.06, 0.08)}
              initial="hidden"
              animate="visible"
              className="flex flex-col p-4"
            >
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  variants={fadeUp}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-foreground/5 py-3 text-sm text-foreground/80 last:border-none"
                >
                  {link.label}
                  <ArrowUpRight size={14} className="text-accent/60" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ */
/*  Text reveals                                                       */
/* ------------------------------------------------------------------ */

/** A line clipped by its own box — used for headline rows. */
function MaskLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.14em]">
      <motion.span variants={maskLine} className={`block ${className ?? ""}`}>
        {children}
      </motion.span>
    </span>
  );
}

/** Per-character 3D flip-in. Inherits the animation state of its parent. */
function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={staggerContainer(0.026)}
      className={`inline-block ${className ?? ""}`}
      style={{ perspective: 700 }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {Array.from(word).map((char, ci) => (
            <motion.span
              key={ci}
              variants={charIn}
              style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/** Generic scroll reveal with a focus-pull (blur → sharp). */
function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.95, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero background — parallax blobs, drifting spores, live helix      */
/* ------------------------------------------------------------------ */

function HeroBackground({
  mouseX,
  mouseY,
  scrollProgress,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
}) {
  const springX = useSpring(mouseX, { stiffness: 38, damping: 22, mass: 1.2 });
  const springY = useSpring(mouseY, { stiffness: 38, damping: 22, mass: 1.2 });

  /* Each layer answers the pointer by a different amount — the further
     "back" a layer is, the less it moves. Same trick for scroll. */
  const p1x = useTransform(springX, [-1, 1], [26, -26]);
  const p1y = useTransform(springY, [-1, 1], [22, -22]);
  const p2x = useTransform(springX, [-1, 1], [-34, 34]);
  const p2y = useTransform(springY, [-1, 1], [-18, 18]);
  const p3x = useTransform(springX, [-1, 1], [14, -14]);
  const p3y = useTransform(springY, [-1, 1], [-24, 24]);

  const slowY = useTransform(scrollProgress, [0, 1], [0, 90]);
  const midY = useTransform(scrollProgress, [0, 1], [0, 170]);
  const fastY = useTransform(scrollProgress, [0, 1], [0, 260]);
  const helixRotate = useTransform(scrollProgress, [0, 1], [0, 26]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ x: p1x, y: p1y }} className="absolute -left-32 -top-32">
        <motion.div
          animate={{ x: [0, 70, -24, 0], y: [0, -46, 34, 0], scale: [1, 1.18, 0.96, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="h-[560px] w-[560px] rounded-full bg-accent-deep/25 blur-3xl"
        />
      </motion.div>

      <motion.div style={{ x: p2x, y: p2y }} className="absolute -bottom-40 -right-24">
        <motion.div
          animate={{ x: [0, -58, 24, 0], y: [0, 36, -34, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: 31, repeat: Infinity, ease: "easeInOut" }}
          className="h-[520px] w-[520px] rounded-full bg-accent-2/12 blur-3xl"
        />
      </motion.div>

      <motion.div style={{ x: p3x, y: p3y }} className="absolute right-1/4 top-1/3 hidden md:block">
        <motion.div
          animate={{ scale: [1, 1.24, 1], opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="h-[280px] w-[280px] rounded-full bg-accent/12 blur-3xl"
        />
      </motion.div>

      <ParticleField className="absolute inset-0 h-full w-full" />

      {/* molecule diagram, drawn on load then breathing */}
      <motion.svg
        style={{ y: midY }}
        className="absolute bottom-[14%] left-[6%] hidden h-[180px] w-[220px] opacity-30 sm:block"
        viewBox="0 0 220 180"
        fill="none"
      >
        {[
          "M20 30 L90 70",
          "M90 70 L160 40",
          "M90 70 L110 140",
          "M110 140 L180 150",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="var(--accent)"
            strokeOpacity="0.45"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.7 + i * 0.16, ease: EASE_EXPO }}
          />
        ))}
        {[
          [20, 30],
          [90, 70],
          [160, 40],
          [110, 140],
          [180, 150],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            fill="var(--accent-2)"
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: [3, 5, 3], opacity: [0.35, 1, 0.35] }}
            transition={{
              r: { duration: 5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" },
              opacity: { duration: 5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" },
            }}
          />
        ))}
      </motion.svg>

      {/* live rotating helix */}
      <motion.div
        style={{ y: fastY, rotate: helixRotate }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.32, x: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE_EXPO }}
        className="absolute right-16 top-24 hidden lg:block"
      >
        <Helix3D />
      </motion.div>

      <motion.div style={{ y: slowY }} className="absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Magnetic button — the surface leans toward the cursor and a        */
/*  specular highlight tracks the contact point.                       */
/* ------------------------------------------------------------------ */

function MagneticButton({
  href,
  className,
  children,
  strength = 0.4,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const springX = useSpring(x, { stiffness: 260, damping: 17, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 17, mass: 0.5 });
  const rotate = useTransform(springX, [-30, 30], [-6, 6]);

  const glow = useMotionTemplate`radial-gradient(120px circle at ${glowX}% ${glowY}%, rgb(from var(--foreground) r g b / 22%), transparent 65%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, rotate }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_SNAPPY}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.span
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
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
      <HeroBackground mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollYProgress} />

      <motion.div
        style={{
          y: contentY,
          scale: contentScale,
          opacity: contentOpacity,
          filter: contentFilter,
        }}
        className="relative z-10 max-w-4xl text-center"
      >
        <motion.div variants={staggerContainer(0.14, 0.15)} initial="hidden" animate="visible">
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

function ScrollIndicator({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 1, ease: EASE_EXPO }}
      className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
    >
      <motion.div style={{ opacity }} className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-12 w-px overflow-hidden bg-foreground/10"
        >
          <motion.div
            animate={{ y: ["-110%", "110%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        </motion.div>
        <span className="text-[10px] tracking-[0.3em] text-foreground/40">KEŞFET</span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating decorative icon — drifts on two axes with a slow tilt,    */
/*  and rides section scroll so it never sits flat on the page.        */
/* ------------------------------------------------------------------ */

function FloatingDecor({
  icon: Icon,
  className,
  duration = 9,
  delay = 0,
}: {
  icon: typeof Atom;
  className: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -22, 0], x: [0, 8, 0], rotate: [0, 10, -4, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      className={`pointer-events-none absolute hidden text-accent/20 md:block ${className}`}
    >
      <Icon size={32} strokeWidth={1.2} />
    </motion.div>
  );
}

/** Wraps children in a scroll-driven vertical parallax. */
function Parallax({
  children,
  className,
  distance = 90,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Illustrated biology motifs — single continuous-line "one-line       */
/*  drawing" style, drawn on scroll via animated pathLength.           */
/* ------------------------------------------------------------------ */

function generateFlowerOutline(petalCount: number, innerR: number, outerR: number, steps = 240) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const r = innerR + (outerR - innerR) * Math.pow((1 + Math.cos(petalCount * theta)) / 2, 0.55);
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

const FLOWER_OUTLINE = generateFlowerOutline(6, 12, 34);

/* Naturalistic leaf outline: a width-envelope profile from apex to base,
   with a serration ripple (tapered to 0 at both tips) and a slightly
   different ripple phase per side for organic asymmetry. */
function generateLeafOutline(steps = 100) {
  const teethFreq = 15;
  const right: [number, number][] = [];
  const left: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const v = i / steps;
    const envelope = Math.sin(Math.PI * Math.pow(v, 0.8)) * 29;
    const taper = Math.sin(Math.PI * v);
    const y = 10 + v * 100;
    const rightRipple = taper * 1.7 * Math.sin(v * teethFreq * Math.PI * 2);
    const leftRipple = taper * 1.7 * Math.sin(v * teethFreq * Math.PI * 2 + 0.7);
    right.push([50 + envelope + rightRipple, y]);
    left.push([50 - envelope - leftRipple, y]);
  }
  const all = [...right, ...left.reverse()];
  return all.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

const LEAF_OUTLINE = generateLeafOutline();

const drawIn = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

const LEAF_VEINS = [
  { y: 32, left: "M49 32 C40 28 32 22 26 16", right: "M51 32 C60 28 68 22 74 16", delay: 2.6 },
  { y: 52, left: "M49 52 C38 50 27 46 19 40", right: "M51 52 C62 50 73 46 81 40", delay: 2.75 },
  { y: 72, left: "M49 72 C40 72 30 70 22 66", right: "M51 72 C60 72 70 70 78 66", delay: 2.9 },
  { y: 92, left: "M49 92 C43 94 37 94 31 92", right: "M51 92 C57 94 63 94 69 92", delay: 3.05 },
];

function LeafIllustration({ className }: { className?: string }) {
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 100 150"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.5" />
          <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--accent-deep)" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {/* blade fill — fades in as the outline finishes drawing */}
      <motion.polyline
        points={LEAF_OUTLINE}
        fill={`url(#${gradId})`}
        stroke="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.14 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.2, delay: 1.6, ease: "easeInOut" }}
      />
      {/* blade outline — naturalistic serrated, asymmetric ovate leaf */}
      <motion.polyline
        points={LEAF_OUTLINE}
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.62"
        strokeWidth="1"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      {/* petiole (stem) */}
      <motion.path
        d="M50 109 C49 118 51 129 50 140"
        stroke="var(--accent)"
        strokeOpacity="0.5"
        strokeWidth="1"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 1.9, ease: "easeInOut" }}
      />
      {/* midrib */}
      <motion.path
        d="M50 14 C50 45 50 80 50 106"
        stroke="var(--accent)"
        strokeOpacity="0.42"
        strokeWidth="0.7"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, delay: 2.2, ease: "easeInOut" }}
      />
      {/* pinnate side veins */}
      {LEAF_VEINS.map((v) => (
        <motion.path
          key={`l-${v.y}`}
          d={v.left}
          stroke="var(--accent)"
          strokeOpacity="0.3"
          strokeWidth="0.45"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: v.delay, ease: "easeInOut" }}
        />
      ))}
      {LEAF_VEINS.map((v) => (
        <motion.path
          key={`r-${v.y}`}
          d={v.right}
          stroke="var(--accent)"
          strokeOpacity="0.3"
          strokeWidth="0.45"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: v.delay, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

function FlowerIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.polyline
        points={FLOWER_OUTLINE}
        stroke="var(--accent-2)"
        strokeOpacity="0.55"
        strokeWidth="1.1"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="3.5"
        stroke="var(--pop)"
        strokeOpacity="0.55"
        strokeWidth="1"
        fill="var(--pop)"
        fillOpacity="0.12"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [0, 1.4, 1], opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 2.4, ease: EASE }}
      />
    </svg>
  );
}

/* Wing-beating butterfly: each wing scales on its own X axis, and the
   body bobs a half-beat behind so the flap reads as lift. */
function ButterflyIllustration({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const flap = reduced
    ? {}
    : {
        animate: { scaleX: [1, 0.35, 1] },
        transition: { duration: 0.42, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible" }}
    >
      <motion.g style={{ originX: "50px", originY: "50px" }} {...flap}>
        <motion.path
          d="M50 50 C30 20 5 25 8 45 C10 62 30 60 50 50 Z"
          stroke="var(--accent)"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          fill="var(--accent)"
          fillOpacity="0.07"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M50 50 C70 20 95 25 92 45 C90 62 70 60 50 50 Z"
          stroke="var(--accent)"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          fill="var(--accent)"
          fillOpacity="0.07"
          variants={drawIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </motion.g>
      <motion.path
        d="M50 30 C47 45 47 65 50 80"
        stroke="var(--accent)"
        strokeOpacity="0.45"
        strokeWidth="0.7"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 1.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 30 C46 24 42 20 37 18"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="0.5"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 1.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 30 C54 24 58 20 63 18"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="0.5"
        variants={drawIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Topics marquee — one steady, unhurried loop. Coupling the speed to  */
/*  scroll velocity made the strip lurch and change direction under     */
/*  the reader, so it runs at a constant rate instead.                  */
/* ------------------------------------------------------------------ */

function Marquee() {
  const loop = [...TOPICS_TICKER, ...TOPICS_TICKER];

  return (
    <section className="relative overflow-hidden border-y border-foreground/5 bg-foreground/[0.015] py-6">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
        className="mask-fade-x flex w-max items-center gap-10 whitespace-nowrap"
      >
        {loop.map((topic, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm tracking-[0.2em] text-foreground/30"
          >
            {topic}
            <span className={i % 2 === 0 ? TONE_CLASSES.accent.dot : TONE_CLASSES.pop.dot}>
              •
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared card chrome                                                 */
/* ------------------------------------------------------------------ */

function ShineSweep() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[400%]" />
    </span>
  );
}

function AccentBar({ tone = "accent" as Tone }: { tone?: Tone }) {
  return (
    <motion.span
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE_EXPO }}
      style={{ originX: 0 }}
      className={`mb-5 block h-[3px] w-12 rounded-full ${TONE_CLASSES[tone].pillBg}`}
    />
  );
}

/** Tilt + specular glare + depth layering, driven by springs. */
function useTilt(ref: React.RefObject<HTMLDivElement | null>, maxTilt = 9) {
  const reduced = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springRotateX = useSpring(rotateX, { stiffness: 190, damping: 18, mass: 0.6 });
  const springRotateY = useSpring(rotateY, { stiffness: 190, damping: 18, mass: 0.6 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * maxTilt * 2);
    rotateX.set((py - 0.5) * -maxTilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function onMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return { onMouseMove, onMouseLeave, springRotateX, springRotateY, glareX, glareY };
}

/* ------------------------------------------------------------------ */
/*  Branches                                                           */
/* ------------------------------------------------------------------ */

function BranchCard({
  branch,
  fromLeft,
}: {
  branch: (typeof BRANCHES)[number];
  fromLeft: boolean;
}) {
  const tone = TONE_CLASSES[branch.tone];
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt(cardRef, 9);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${tilt.glareX}% ${tilt.glareY}%, rgb(from ${tone.glowVar} r g b / 16%), transparent 62%)`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: fromLeft ? -70 : 70, rotateY: fromLeft ? -8 : 8 },
        visible: {
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: { duration: 1.05, ease: EASE_EXPO },
        },
      }}
      style={{ perspective: 1100 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        whileHover={{ y: -6 }}
        style={{
          rotateX: tilt.springRotateX,
          rotateY: tilt.springRotateY,
          transformStyle: "preserve-3d",
        }}
        transition={SPRING_SOFT}
        className={`group relative flex h-full flex-col rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-8 transition-colors duration-500 sm:p-10 ${tone.border}`}
      >
        <motion.span
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <ShineSweep />

        <motion.div
          animate={{ rotate: [0, 9, -5, 0], y: [0, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, rotate: 0 }}
          style={{ transform: "translateZ(50px)" }}
          className={`relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tone.badge}`}
        >
          <branch.icon size={22} strokeWidth={1.5} />
        </motion.div>

        <span
          style={{ transform: "translateZ(30px)" }}
          className={`relative text-[11px] tracking-[0.3em] ${tone.label}`}
        >
          {branch.kademe}
        </span>
        <h3
          style={{ transform: "translateZ(40px)" }}
          className="relative mt-2 text-2xl font-semibold text-foreground/95 sm:text-3xl"
        >
          {branch.title}
        </h3>
        <p
          style={{ transform: "translateZ(24px)" }}
          className="relative mt-4 max-w-sm text-sm leading-relaxed text-foreground/50"
        >
          {branch.desc}
        </p>

        <div
          style={{ transform: "translateZ(18px)" }}
          className="relative mt-auto flex flex-wrap gap-2 pt-7"
        >
          {branch.topics.map((topic, i) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.07, y: -2 }}
              transition={{ ...SPRING_SOFT, delay: 0.35 + i * 0.07 }}
              className="cursor-default rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-foreground/60 transition-colors duration-300 hover:border-foreground/30 hover:text-foreground/90"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Branches() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  /* The butterfly crosses the section as you scroll, with a sine bob. */
  const flightX = useTransform(scrollYProgress, [0, 1], ["-6vw", "92vw"]);
  const flightY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, -70, 20, -50, 10]);
  const flightRotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [8, -12, 6, -10, 4]);

  return (
    <section
      id="branslar"
      ref={ref}
      className="relative overflow-hidden px-6 py-32 sm:py-40"
    >
      <FloatingDecor icon={FlaskConical} className="left-[8%] top-16" duration={10} />
      <FloatingDecor icon={Leaf} className="bottom-24 right-[10%]" duration={8} delay={1.5} />

      <motion.div
        style={{ x: flightX, y: flightY, rotate: flightRotate }}
        className="pointer-events-none absolute left-0 top-16 hidden h-14 w-16 md:block"
      >
        <ButterflyIllustration className="h-full w-full" />
      </motion.div>

      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-14 max-w-xl">
          <AccentBar />
          <p className="mb-4 text-xs tracking-[0.3em] text-accent/80">İKİ KADEME, TEK TUTKU</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            İki Branş, Tek Merak
          </h2>
        </Reveal>

        <motion.div
          variants={staggerContainer(0.18)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {BRANCHES.map((branch, i) => (
            <BranchCard key={branch.title} branch={branch} fromLeft={i === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  About / Vision                                                     */
/* ------------------------------------------------------------------ */

function About() {
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

/* ------------------------------------------------------------------ */
/*  Living cell — membrane, nucleus and organelles are solved per      */
/*  frame. The membrane is a sum of three sine harmonics (so it never  */
/*  repeats on a visible cycle), organelles ride slow ellipses, and    */
/*  vesicles do a damped random walk: Brownian motion, roughly.        */
/* ------------------------------------------------------------------ */

function blobPath(cx: number, cy: number, radius: number, t: number, amp: number, seed: number) {
  const steps = 64;
  let d = "";
  for (let i = 0; i < steps; i++) {
    const th = (i / steps) * Math.PI * 2;
    const wobble =
      Math.sin(3 * th + t * 0.7 + seed) * 0.5 +
      Math.sin(5 * th - t * 0.45 + seed * 1.7) * 0.3 +
      Math.sin(7 * th + t * 0.95) * 0.2;
    const r = radius * (1 + amp * wobble);
    const x = cx + r * Math.cos(th);
    const y = cy + r * Math.sin(th);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

const ORGANELLES = [
  { label: "Mitokondri", rx: 52, ry: 34, speed: 0.22, phase: 0, w: 15, h: 7.5 },
  { label: "Mitokondri", rx: 46, ry: 40, speed: -0.17, phase: 2.1, w: 13, h: 6.6 },
  { label: "Kloroplast", rx: 58, ry: 30, speed: 0.13, phase: 4.2, w: 16, h: 9 },
];

const VESICLE_COUNT = 14;

/* Hover is reported upward rather than labelled in place: the caller
   frames this cell inside a clipping circle, and a label drawn in here
   would be cropped and would zoom along with the cell. */
function LivingCell({ onHover }: { onHover?: (label: string | null) => void }) {
  const reduced = useReducedMotion();
  const { elementRef, visible } = useVisibilityRef<HTMLDivElement>();
  const gradId = useId();
  const membrane = useRef<SVGPathElement>(null);
  const cytoplasm = useRef<SVGPathElement>(null);
  const nucleus = useRef<SVGPathElement>(null);
  const nucleolus = useRef<SVGCircleElement>(null);
  const organelles = useRef<(SVGGElement | null)[]>([]);
  const vesicles = useRef<(SVGCircleElement | null)[]>([]);

  /* Seeded start points render identically on server and client; the ref
     holds the live bodies the animation loop integrates. */
  const seedPositions = useMemo(
    () =>
      Array.from({ length: VESICLE_COUNT }, (_, i) => ({
        x: Number((100 + (seeded(i * 2.7) - 0.5) * 110).toFixed(2)),
        y: Number((100 + (seeded(i * 5.3) - 0.5) * 110).toFixed(2)),
        vx: (seeded(i * 7.1) - 0.5) * 6,
        vy: (seeded(i * 9.5) - 0.5) * 6,
        r: Number((1 + seeded(i * 3.3) * 1.6).toFixed(2)),
      })),
    []
  );
  const walk = useRef(seedPositions.map((p) => ({ ...p })));

  const initialMembrane = useMemo(() => blobPath(100, 100, 82, 0, 0.035, 0), []);
  const initialNucleus = useMemo(() => blobPath(100, 100, 27, 0, 0.05, 1.3), []);

  useAnimationFrame((ms, delta) => {
    if (reduced || !visible.current) return;
    const t = ms / 1000;
    const dt = Math.min(delta / 1000, 0.05);

    membrane.current?.setAttribute("d", blobPath(100, 100, 82, t, 0.035, 0));
    cytoplasm.current?.setAttribute("d", blobPath(100, 100, 76, t + 0.6, 0.028, 2.2));
    nucleus.current?.setAttribute("d", blobPath(100, 100, 27, t * 1.3, 0.05, 1.3));

    if (nucleolus.current) {
      nucleolus.current.setAttribute("r", (6 + Math.sin(t * 1.1) * 0.9).toFixed(2));
    }

    ORGANELLES.forEach((o, i) => {
      const g = organelles.current[i];
      if (!g) return;
      const a = t * o.speed + o.phase;
      /* Orbit + a slow radial breath so paths don't trace a fixed ring. */
      const breath = 1 + Math.sin(t * 0.4 + o.phase) * 0.08;
      const x = 100 + Math.cos(a) * o.rx * breath;
      const y = 100 + Math.sin(a) * o.ry * breath;
      const rot = (a * 180) / Math.PI + Math.sin(t * 0.8 + o.phase) * 14;
      g.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(1)})`);
    });

    walk.current.forEach((v, i) => {
      const c = vesicles.current[i];
      /* Random impulse + drag + a soft wall at the membrane. */
      v.vx += (Math.random() - 0.5) * 34 * dt;
      v.vy += (Math.random() - 0.5) * 34 * dt;
      v.vx *= 0.985;
      v.vy *= 0.985;
      v.x += v.vx * dt * 6;
      v.y += v.vy * dt * 6;
      const dx = v.x - 100;
      const dy = v.y - 100;
      const dist = Math.hypot(dx, dy);
      if (dist > 70) {
        const push = (dist - 70) * 0.06;
        v.vx -= (dx / dist) * push * 10;
        v.vy -= (dy / dist) * push * 10;
      }
      if (!c) return;
      c.setAttribute("cx", v.x.toFixed(2));
      c.setAttribute("cy", v.y.toFixed(2));
      c.setAttribute("opacity", (0.25 + 0.35 * Math.abs(Math.sin(t + i))).toFixed(2));
    });
  });

  return (
    <div ref={elementRef} className="relative h-full w-full">
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`${gradId}-cyto`} cx="42%" cy="36%">
            <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.22" />
            <stop offset="60%" stopColor="var(--accent-deep)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id={`${gradId}-nuc`} cx="38%" cy="32%">
            <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.85" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent-deep)" stopOpacity="0.25" />
          </radialGradient>
          <filter id={`${gradId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* membrane */}
        <motion.path
          ref={membrane}
          d={initialMembrane}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.35"
          strokeWidth="1.4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          ref={cytoplasm}
          d={blobPath(100, 100, 76, 0.6, 0.028, 2.2)}
          fill={`url(#${gradId}-cyto)`}
          stroke="var(--accent-light)"
          strokeOpacity="0.12"
          strokeWidth="0.6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE_EXPO }}
          style={{ originX: "100px", originY: "100px" }}
        />

        {/* endoplasmic reticulum — folded ribbons around the nucleus */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={`er-${i}`}
            d={`M${58 + i * 6} ${72 + i * 14} C${78 - i * 4} ${58 + i * 10}, ${122 + i * 4} ${62 + i * 8}, ${142 - i * 6} ${80 + i * 12}`}
            fill="none"
            stroke="var(--accent-2-light)"
            strokeOpacity={0.16 - i * 0.03}
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, delay: 0.9 + i * 0.15, ease: "easeInOut" }}
          />
        ))}

        {/* vesicles (Brownian) */}
        {seedPositions.map((p, i) => (
          <circle
            key={`v-${i}`}
            ref={(el) => {
              vesicles.current[i] = el;
            }}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="var(--accent-2-light)"
            opacity="0.4"
          />
        ))}

        {/* organelles */}
        {ORGANELLES.map((o, i) => (
          <g
            key={`o-${i}`}
            ref={(el) => {
              organelles.current[i] = el;
            }}
            transform={`translate(${(100 + Math.cos(o.phase) * o.rx).toFixed(2)} ${(100 + Math.sin(o.phase) * o.ry).toFixed(2)})`}
            onMouseEnter={() => onHover?.(o.label)}
            onMouseLeave={() => onHover?.(null)}
            className="cursor-pointer"
          >
            <motion.ellipse
              rx={o.w}
              ry={o.h}
              fill="var(--accent-deep)"
              fillOpacity="0.2"
              stroke="var(--accent-light)"
              strokeOpacity="0.4"
              strokeWidth="0.8"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...SPRING_SOFT, delay: 1 + i * 0.12 }}
            />
            {/* cristae */}
            <path
              d={`M${-o.w + 3} 0 L${-o.w / 2} ${-o.h / 2} L0 0 L${o.w / 2} ${-o.h / 2} L${o.w - 3} 0`}
              fill="none"
              stroke="var(--accent-light)"
              strokeOpacity="0.4"
              strokeWidth="0.6"
            />
          </g>
        ))}

        {/* nucleus */}
        <motion.path
          ref={nucleus}
          d={initialNucleus}
          fill={`url(#${gradId}-nuc)`}
          filter={`url(#${gradId}-glow)`}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...SPRING_SOFT, delay: 0.7 }}
          style={{ originX: "100px", originY: "100px" }}
        />
        <motion.circle
          ref={nucleolus}
          cx="94"
          cy="96"
          r="6"
          fill="var(--accent-deep)"
          fillOpacity="0.55"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...SPRING_SOFT, delay: 1.1 }}
        />
      </svg>

    </div>
  );
}

function CellVisual() {
  const [hoveredOrganelle, setHoveredOrganelle] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          data-cursor-label="İNCELE"
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          {/* dashed guide rings — slow counter-rotation adds depth */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-accent-light/15"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 rounded-full border border-dashed border-accent-light/10"
          />
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-6 rounded-full bg-accent/5 blur-2xl"
          />

          <LivingCell onHover={setHoveredOrganelle} />

          <AnimatePresence>
            {hoveredOrganelle && (
              <motion.span
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="pointer-events-none absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/30 bg-background/90 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur"
              >
                {hoveredOrganelle}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <div>
          <Reveal>
            <p className="mb-4 text-xs tracking-[0.3em] text-accent/80">MİKRO DÜNYA</p>
          </Reveal>

          <motion.p
            variants={staggerContainer(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl font-semibold leading-snug tracking-tight text-foreground/90 sm:text-4xl"
          >
            <MaskLine>&ldquo;Her hücre kendi içinde</MaskLine>
            <MaskLine className="text-accent">kusursuz bir sistemdir.&rdquo;</MaskLine>
          </motion.p>

          <Reveal delay={0.25}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/45">
              Organellerin üzerine gel — zar dalgalanır, veziküller Brown
              hareketiyle sürüklenir, mitokondriler kendi yörüngelerinde döner.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Notes / Blog                                                       */
/* ------------------------------------------------------------------ */

function NoteCard({ note, tone, index }: { note: (typeof NOTES_BIO)[number]; tone: Tone; index: number }) {
  const toneClasses = TONE_CLASSES[tone];
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt(cardRef, 8);
  const glow = useMotionTemplate`radial-gradient(440px circle at ${tilt.glareX}% ${tilt.glareY}%, rgb(from ${toneClasses.glowVar} r g b / 15%), transparent 68%)`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, rotateX: -10, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, delay: index * 0.08, ease: EASE_EXPO },
        },
      }}
      style={{ perspective: 1100 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        whileHover={{ y: -10 }}
        data-cursor-label="OKU"
        style={{
          rotateX: tilt.springRotateX,
          rotateY: tilt.springRotateY,
          transformStyle: "preserve-3d",
        }}
        transition={SPRING_SOFT}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 ${toneClasses.border}`}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <ShineSweep />
        <div className="relative z-10" style={{ transform: "translateZ(35px)" }}>
          <span className={`text-[11px] tracking-[0.2em] ${toneClasses.category}`}>
            {note.category}
          </span>
          <h3 className="mt-4 text-xl font-medium text-foreground/95">{note.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/50">{note.desc}</p>
          <div className="mt-8 flex items-center gap-2 text-sm text-foreground/70">
            <span className="relative">
              Devamını Oku
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1.5"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CurriculumRow({
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

function CurriculumAccordion({ tab, tone }: { tab: (typeof NOTE_TABS)[number]; tone: Tone }) {
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

function Notes() {
  const [tab, setTab] = useState<(typeof NOTE_TABS)[number]>(NOTE_TABS[0]);
  const [direction, setDirection] = useState(1);
  const activeTone = NOTE_TAB_TONE[tab];

  function selectTab(next: (typeof NOTE_TABS)[number]) {
    setDirection(NOTE_TABS.indexOf(next) > NOTE_TABS.indexOf(tab) ? 1 : -1);
    setTab(next);
  }

  /* Arrow keys move between tabs, as the tabs pattern expects. */
  function handleTabKeys(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next =
      NOTE_TABS[(NOTE_TABS.indexOf(tab) + step + NOTE_TABS.length) % NOTE_TABS.length];
    selectTab(next);
    const buttons = e.currentTarget.querySelectorAll("button");
    buttons[NOTE_TABS.indexOf(next)]?.focus();
  }

  return (
    <section id="notlar" className="relative overflow-hidden px-6 py-32 sm:py-40">
      <FloatingDecor icon={Atom} className="right-[4%] top-20" duration={9} />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-10 max-w-xl">
          <AccentBar />
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Bilgiyi Keşfet</h2>
          <p className="mt-4 text-foreground/50">
            Kademene göre seç: Fen Bilimleri mi, Biyoloji mi? Aşağıda sınıf sınıf tüm müfredatı
            bulabilirsin.
          </p>
        </Reveal>

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
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate="visible"
            exit={{
              opacity: 0,
              x: direction * -40,
              filter: "blur(8px)",
              transition: { duration: 0.32, ease: EASE },
            }}
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

/* ------------------------------------------------------------------ */
/*  Stats — spring-driven counters. A spring decelerates into its      */
/*  target the way a physical dial would, unlike a linear tween.       */
/* ------------------------------------------------------------------ */

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const value = useSpring(0, { stiffness: 42, damping: 18, mass: 1.1 });
  const display = useTransform(value, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      value.jump(target);
      return;
    }
    value.set(target);
  }, [inView, target, reduced, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
    </span>
  );
}

function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wordX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.01, 0.035, 0.01]);

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-28 sm:py-36">
      <motion.span
        style={{ x: wordX, opacity: wordOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[16vw] font-bold tracking-tight text-foreground"
      >
        BIOLOGY
      </motion.span>

      <motion.div
        variants={staggerContainer(0.11)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative mx-auto grid max-w-5xl grid-cols-2 gap-10 text-center md:grid-cols-5"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -6, scale: 1.04 }}
            transition={SPRING_SOFT}
            className="group"
          >
            <div
              className={`text-4xl font-semibold sm:text-5xl ${
                stat.value === "∞" ? "text-pop" : "text-accent"
              }`}
            >
              {typeof stat.value === "number" ? (
                <>
                  <CountUp target={stat.value} />
                  {stat.suffix}
                </>
              ) : (
                <motion.span
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  {stat.value}
                </motion.span>
              )}
            </div>
            <div className="mt-2 text-sm text-foreground/50">{stat.label}</div>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.3 }}
              className="mx-auto mt-3 block h-px w-8 origin-center bg-gradient-to-r from-transparent via-accent/50 to-transparent"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Quote — each word's opacity, lift and focus are tied directly to   */
/*  scroll position, so the sentence resolves as you read it.          */
/* ------------------------------------------------------------------ */

function ScrollWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [16, 0]);
  const blurPx = useTransform(progress, range, [6, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.span style={{ opacity, y, filter }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

function ScrollReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <ScrollWord
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </ScrollWord>
      ))}
    </p>
  );
}

function Quote() {
  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-44">
      <motion.div
        animate={{ x: [0, 48, -20, 0], y: [0, -24, 16, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/4 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent-deep/12 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -34, 18, 0], y: [0, 24, -14, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-1/4 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-accent-2/12 blur-3xl"
      />
      <Parallax
        distance={60}
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 sm:block"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.12, 1] }}
          transition={{
            rotate: { duration: 70, repeat: Infinity, ease: "linear" },
            scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
          className="h-full w-full"
        >
          <FlowerIllustration className="h-full w-full" />
        </motion.div>
      </Parallax>

      <div className="relative">
        <ScrollReveal
          text="Bilim, cevaplardan çok doğru soruları sormayı öğretir."
          className="mx-auto max-w-4xl text-center text-2xl font-semibold leading-snug tracking-tight sm:text-4xl md:text-5xl"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

const INPUT_CLASS =
  "peer w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 pb-3 pt-6 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent/60 focus:bg-foreground/[0.05] focus:shadow-[0_0_0_4px_rgb(from_var(--accent)_r_g_b_/_10%)]";

const LABEL_CLASS =
  "pointer-events-none absolute left-4 top-4 origin-left text-sm text-foreground/35 transition-all duration-300 peer-focus:top-2 peer-focus:text-[10px] peer-focus:tracking-[0.18em] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.18em]";

function Field({
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

function ContactForm() {
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

function Contact() {
  return (
    <section id="iletisim" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-xl">
          <AccentBar />
          <motion.h2
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            <MaskLine>Aklında Bir Soru mu Var?</MaskLine>
          </motion.h2>
          <Reveal delay={0.12}>
            <p className="mt-4 max-w-md text-foreground/50">
              Biyoloji bazen karmaşık görünebilir. Birlikte çözelim.
            </p>
          </Reveal>
        </div>

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

/* ------------------------------------------------------------------ */
/*  Back to top — the ring is the page's own scroll progress.          */
/* ------------------------------------------------------------------ */

function BackToTop() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => setVisible(v > 0.12));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING_SNAPPY}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Başa dön"
          className="fixed bottom-6 right-6 z-[65] flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-background/80 text-accent backdrop-blur-xl"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp size={17} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 px-6 py-8">
      <motion.div
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-foreground/40 sm:flex-row"
      >
        <span className="flex items-center gap-2 font-medium text-foreground/70">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.3 }}
            className="text-accent"
          >
            <Dna size={16} strokeWidth={1.5} />
          </motion.span>
          BIO<span className="text-accent">.</span>
        </span>
        <span className="text-center">Yaşamı anlamak, kendimizi anlamaktır.</span>
        <span>© 2026</span>
      </motion.div>
    </footer>
  );
}

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
