"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useInView,
  useScroll,
  type Variants,
} from "framer-motion";
import {
  Dna,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
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
/*  Animation variants (reusable)                                      */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const fadeUpBig: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: EASE },
  },
};

const staggerContainer = (stagger = 0.15, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

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
/*  DNA helix path generator (module scope — pure, computed once)      */
/* ------------------------------------------------------------------ */

function generateHelixPoints(
  height: number,
  amplitude: number,
  turns: number,
  phase: number
) {
  const steps = 48;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * height;
    const x = amplitude * Math.sin((i / steps) * turns * Math.PI * 2 + phase) + amplitude;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points;
}

const HELIX_HEIGHT = 420;
const HELIX_AMPLITUDE = 36;
const strandA = generateHelixPoints(HELIX_HEIGHT, HELIX_AMPLITUDE, 3, 0);
const strandB = generateHelixPoints(HELIX_HEIGHT, HELIX_AMPLITUDE, 3, Math.PI);
const HELIX_RUNGS = strandA.filter((_, i) => i % 6 === 0);
const HELIX_RUNGS_B = strandB.filter((_, i) => i % 6 === 0);

/* ------------------------------------------------------------------ */
/*  Scroll progress bar                                                */
/* ------------------------------------------------------------------ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[70] bg-gradient-to-r from-accent via-accent-2-light to-accent"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor glow — follows the pointer across the whole page            */
/* ------------------------------------------------------------------ */

function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 60, damping: 22 });
  const springY = useSpring(y, { stiffness: 60, damping: 22 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className="hidden md:block fixed z-[55] w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-3xl pointer-events-none mix-blend-screen"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Floating Nav                                                       */
/* ------------------------------------------------------------------ */

type ThemeName = "dark" | "light";
const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => themeListeners.delete(callback);
}

function getThemeSnapshot(): ThemeName {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): ThemeName {
  return "dark";
}

function setGlobalTheme(next: ThemeName) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
  themeListeners.forEach((listener) => listener());
}

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  function toggle() {
    setGlobalTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      className="relative flex items-center justify-center w-9 h-9 shrink-0 rounded-full border border-foreground/10 text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors duration-300 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Moon size={16} strokeWidth={1.5} />
          ) : (
            <Sun size={16} strokeWidth={1.5} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 sm:px-6"
    >
      <div
        className={`mt-4 w-full max-w-5xl flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border border-accent/20 shadow-[0_0_40px_-15px_rgb(from_var(--accent-deep)_r_g_b_/_40%)]"
            : "bg-transparent border border-transparent"
        }`}
      >
        <a href="#" className="flex items-center gap-2 group">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="text-accent"
          >
            <Dna size={20} strokeWidth={1.5} />
          </motion.span>
          <span className="font-medium tracking-tight text-[15px] sm:text-base">
            BIO<span className="text-accent">.</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="relative text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
            >
              {link.label}
              <motion.span
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ originX: 0 }}
                className="absolute left-0 -bottom-1 h-px w-full bg-gradient-to-r from-accent to-accent-2-light"
              />
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-foreground/80 p-1"
            aria-label="Menüyü aç/kapat"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="md:hidden absolute top-20 inset-x-4 rounded-2xl border border-accent/20 bg-background-alt/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm text-foreground/80 border-b border-foreground/5 last:border-none"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero organic background                                            */
/* ------------------------------------------------------------------ */

function HeroBackground({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const p1x = useTransform(springX, [-1, 1], [16, -16]);
  const p1y = useTransform(springY, [-1, 1], [16, -16]);
  const p2x = useTransform(springX, [-1, 1], [-24, 24]);
  const p2y = useTransform(springY, [-1, 1], [-12, 12]);
  const p3x = useTransform(springX, [-1, 1], [10, -10]);
  const p3y = useTransform(springY, [-1, 1], [-18, 18]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div style={{ x: p1x, y: p1y }} className="absolute -top-32 -left-32">
        <motion.div
          animate={{ x: [0, 60, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-[560px] h-[560px] rounded-full bg-accent-deep/20 blur-3xl"
        />
      </motion.div>

      <motion.div style={{ x: p2x, y: p2y }} className="absolute -bottom-40 -right-24">
        <motion.div
          animate={{ x: [0, -50, 20, 0], y: [0, 30, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 24, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-[520px] h-[520px] rounded-full bg-accent-2/10 blur-3xl"
        />
      </motion.div>

      <motion.div
        style={{ x: p3x, y: p3y }}
        className="hidden md:block absolute top-1/3 right-1/4"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-[280px] h-[280px] rounded-full bg-accent/10 blur-3xl"
        />
      </motion.div>

      {/* molecule dots */}
      <svg
        className="absolute left-[6%] bottom-[14%] w-[220px] h-[180px] opacity-25 hidden sm:block"
        viewBox="0 0 220 180"
        fill="none"
      >
        <g stroke="var(--accent)" strokeOpacity="0.4">
          <line x1="20" y1="30" x2="90" y2="70" />
          <line x1="90" y1="70" x2="160" y2="40" />
          <line x1="90" y1="70" x2="110" y2="140" />
          <line x1="110" y1="140" x2="180" y2="150" />
        </g>
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
            r={4}
            fill="var(--accent-2)"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* DNA helix */}
      <motion.svg
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden lg:block absolute right-16 top-24 opacity-20"
        width={HELIX_AMPLITUDE * 2 + 20}
        height={HELIX_HEIGHT}
        viewBox={`0 0 ${HELIX_AMPLITUDE * 2 + 20} ${HELIX_HEIGHT}`}
        fill="none"
      >
        <polyline
          points={strandA.join(" ")}
          stroke="var(--accent-light)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polyline
          points={strandB.join(" ")}
          stroke="var(--accent-2-light)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {HELIX_RUNGS.map((pt, i) => {
          const [x1, y1] = pt.split(",").map(Number);
          const [x2] = HELIX_RUNGS_B[i]?.split(",").map(Number) ?? [x1];
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y1}
              stroke="var(--accent)"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          );
        })}
      </motion.svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Magnetic button — nudges toward the cursor within its bounds       */
/* ------------------------------------------------------------------ */

function MagneticButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
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
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [fine] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
  );

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!fine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      <HeroBackground mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        variants={staggerContainer(0.16, 0.1)}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl text-center"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs sm:text-sm tracking-[0.3em] text-accent/80 font-medium mb-6"
        >
          FEN BİLİMLERİ • BİYOLOJİ • YAŞAM
        </motion.p>

        <h1 className="text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight">
          <motion.span variants={fadeUp} className="block">
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-r from-accent-light via-accent to-accent-2-light bg-[length:200%_100%] bg-clip-text text-transparent"
            >
              Yaşamın Kodlarını
            </motion.span>
          </motion.span>
          <motion.span variants={fadeUp} className="block text-foreground/95">
            Birlikte Keşfedelim.
          </motion.span>
        </h1>

        <motion.p
          variants={fadeUp}
          className="mt-8 text-base sm:text-lg text-foreground/60 max-w-xl mx-auto leading-relaxed"
        >
          Ortaokulda Fen Bilimleri, lisede Biyoloji — biyolojiyi ezberlenecek
          bilgilerden çıkarıp, yaşamı anlamanın bir yoluna dönüştürüyoruz.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            href="#notlar"
            className="group inline-flex items-center gap-2 rounded-full bg-accent text-background font-medium px-7 py-3.5 text-sm transition-shadow hover:shadow-[0_0_40px_-8px_rgb(from_var(--accent)_r_g_b_/_70%)]"
          >
            Ders Notlarını Keşfet
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </MagneticButton>
          <MagneticButton
            href="#hakkimda"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 text-foreground/80 px-7 py-3.5 text-sm hover:border-accent/40 hover:text-foreground transition-colors"
          >
            Ben Kimim?
          </MagneticButton>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
    >
      <div className="relative h-12 w-px bg-foreground/10 overflow-hidden">
        <motion.div
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
        />
      </div>
      <span className="text-[10px] tracking-[0.3em] text-foreground/40">KEŞFET</span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating decorative icon — drifts slowly, purely decorative        */
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
      animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
      transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }}
      className={`hidden md:block absolute pointer-events-none text-accent/20 ${className}`}
    >
      <Icon size={32} strokeWidth={1.2} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Illustrated biology motifs — bigger, "picture-like" background art */
/* ------------------------------------------------------------------ */

function LeafIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M50 8 C72 14 88 40 82 68 C76 98 58 122 48 132 C36 118 22 92 20 64 C18 36 30 14 50 8 Z"
        stroke="var(--accent)"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        fill="var(--accent)"
        fillOpacity="0.03"
      />
      <path d="M50 12 C48 48 46 90 47 128" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="0.55" />
      <path d="M48 32 C40 36 31 40 23 46" stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="0.4" />
      <path d="M49 32 C58 35 68 40 76 48" stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="0.4" />
      <path d="M47 57 C38 60 28 65 22 72" stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="0.4" />
      <path d="M48 57 C58 60 68 66 74 74" stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="0.4" />
      <path d="M47 82 C40 85 33 90 28 96" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="0.35" />
      <path d="M48 82 C56 85 63 90 68 97" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="0.35" />
      <path d="M48 103 C43 106 38 110 35 115" stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="0.3" />
      <path d="M48 103 C53 106 58 110 60 116" stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="0.3" />
    </svg>
  );
}

function FlowerIllustration({ className }: { className?: string }) {
  const petals = [
    { angle: 4, rx: 9, ry: 25 },
    { angle: 61, rx: 8, ry: 22 },
    { angle: 123, rx: 9.5, ry: 26 },
    { angle: 178, rx: 7.5, ry: 21 },
    { angle: 236, rx: 9, ry: 24 },
    { angle: 298, rx: 8, ry: 22 },
  ];
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {petals.map((p, i) => (
        <ellipse
          key={i}
          cx="50"
          cy={50 - p.ry + 5}
          rx={p.rx}
          ry={p.ry}
          stroke="var(--accent-2)"
          strokeOpacity="0.38"
          strokeWidth="0.55"
          fill="var(--accent-2)"
          fillOpacity="0.025"
          transform={`rotate(${p.angle} 50 50)`}
        />
      ))}
      {[10, 82, 154, 226, 298].map((deg, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="41"
          stroke="var(--accent-2)"
          strokeOpacity="0.32"
          strokeWidth="0.4"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="3.5" fill="var(--pop)" fillOpacity="0.16" stroke="var(--pop)" strokeOpacity="0.4" strokeWidth="0.5" />
    </svg>
  );
}

function ButterflyIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible" }}
    >
      <motion.g
        style={{ originX: 1, originY: 0.48 }}
        animate={{ scaleX: [1, 0.85, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M50 46 C34 20 12 18 6 34 C2 46 14 56 34 54 C42 52 47 50 50 46 Z"
          stroke="var(--accent)"
          strokeOpacity="0.42"
          strokeWidth="0.6"
          fill="var(--accent)"
          fillOpacity="0.035"
        />
        <path
          d="M50 52 C38 50 22 54 18 66 C15 78 26 86 38 80 C46 76 49 64 50 52 Z"
          stroke="var(--accent)"
          strokeOpacity="0.34"
          strokeWidth="0.5"
          fill="var(--accent)"
          fillOpacity="0.03"
        />
        <path d="M48 44 C38 35 25 30 12 31" stroke="var(--accent)" strokeOpacity="0.22" strokeWidth="0.3" />
      </motion.g>
      <motion.g
        style={{ originX: 0, originY: 0.48 }}
        animate={{ scaleX: [1, 0.85, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M50 46 C66 20 88 18 94 34 C98 46 86 56 66 54 C58 52 53 50 50 46 Z"
          stroke="var(--accent)"
          strokeOpacity="0.42"
          strokeWidth="0.6"
          fill="var(--accent)"
          fillOpacity="0.035"
        />
        <path
          d="M50 52 C62 50 78 54 82 66 C85 78 74 86 62 80 C54 76 51 64 50 52 Z"
          stroke="var(--accent)"
          strokeOpacity="0.34"
          strokeWidth="0.5"
          fill="var(--accent)"
          fillOpacity="0.03"
        />
        <path d="M52 44 C62 35 75 30 88 31" stroke="var(--accent)" strokeOpacity="0.22" strokeWidth="0.3" />
      </motion.g>
      <path d="M50 37 C48 45 48 58 50 65" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="0.7" />
      <path d="M50 37 C47 32 44 29 40 27" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="0.4" />
      <path d="M50 37 C53 32 56 29 60 27" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="0.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Topics marquee — infinite scrolling ticker                         */
/* ------------------------------------------------------------------ */

function Marquee() {
  const loop = [...TOPICS_TICKER, ...TOPICS_TICKER];
  return (
    <section className="relative py-6 border-y border-foreground/5 overflow-hidden bg-foreground/[0.015]">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="flex w-max items-center gap-10 whitespace-nowrap"
      >
        {loop.map((topic, i) => (
          <span key={i} className="flex items-center gap-10 text-sm tracking-[0.2em] text-foreground/30">
            {topic}
            <span className={i % 2 === 0 ? TONE_CLASSES.accent.dot : TONE_CLASSES.pop.dot}>•</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Branches — Ortaokul Fen Bilimleri & Lise Biyoloji                  */
/* ------------------------------------------------------------------ */

function BranchCard({
  branch,
  fromLeft,
}: {
  branch: (typeof BRANCHES)[number];
  fromLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const tone = TONE_CLASSES[branch.tone];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(py * -10);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: fromLeft ? -60 : 60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
      }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative h-full flex flex-col rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-8 sm:p-10 transition-colors duration-500 ${tone.border}`}
      >
        <ShineSweep />
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className={`relative inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 ${tone.badge}`}
        >
          <branch.icon size={22} strokeWidth={1.5} />
        </motion.div>

        <span className={`relative text-[11px] tracking-[0.3em] ${tone.label}`}>{branch.kademe}</span>
        <h3 className="relative mt-2 text-2xl sm:text-3xl font-semibold text-foreground/95">{branch.title}</h3>
        <p className="relative mt-4 text-sm text-foreground/50 leading-relaxed max-w-sm">{branch.desc}</p>

        <div className="relative mt-auto pt-7 flex flex-wrap gap-2">
          {branch.topics.map((topic, i) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: EASE }}
              className="text-xs rounded-full border border-foreground/10 px-3 py-1.5 text-foreground/60"
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
  return (
    <section id="branslar" className="relative py-32 sm:py-40 px-6 overflow-hidden">
      <FloatingDecor icon={FlaskConical} className="top-16 left-[8%]" duration={10} />
      <FloatingDecor icon={Leaf} className="bottom-24 right-[10%]" duration={8} delay={1.5} />
      <motion.div
        animate={{ x: ["0vw", "70vw", "20vw", "90vw", "0vw"], y: [0, -40, 30, -20, 0], rotate: [0, 6, -4, 8, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute top-10 left-0 w-16 h-14 pointer-events-none"
      >
        <ButterflyIllustration className="w-full h-full" />
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-xl mb-14"
        >
          <AccentBar />
          <p className="text-xs tracking-[0.3em] text-accent/80 mb-4">İKİ KADEME, TEK TUTKU</p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">İki Branş, Tek Merak</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-6"
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
/*  Accent bar — small animated draw-in line, used above headings      */
/* ------------------------------------------------------------------ */

function ShineSweep() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
    </span>
  );
}

function AccentBar({ tone = "accent" as Tone }: { tone?: Tone }) {
  return (
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{ originX: 0 }}
      className={`block h-[3px] w-12 rounded-full mb-5 ${TONE_CLASSES[tone].pillBg}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  About / Vision                                                     */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="hakkimda" className="relative py-32 sm:py-40 px-6 overflow-hidden">
      <FloatingDecor icon={Microscope} className="top-24 right-[6%]" duration={11} delay={0.8} />
      <motion.div
        animate={{ y: [0, -22, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="hidden md:block absolute -left-16 bottom-0 w-80 h-80 pointer-events-none"
      >
        <LeafIllustration className="w-full h-full" />
      </motion.div>
      <div className="max-w-5xl mx-auto">
        <div className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
          <motion.span
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="hidden md:block text-[10rem] leading-none font-semibold text-foreground/[0.04] select-none -mt-6"
          >
            01
          </motion.span>

          <div>
            <AccentBar />
            <motion.h2
              variants={fadeUpBig}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl sm:text-5xl font-semibold leading-tight tracking-tight max-w-2xl"
            >
              Biyolojiyi Ezberletmiyorum.{" "}
              <span className="text-accent">Anlamayı Öğretiyorum.</span>
            </motion.h2>

            <motion.p
              variants={fadeUpBig}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-foreground/60 max-w-xl leading-relaxed"
            >
              On yılı aşkın süredir hem ortaokulda Fen Bilimleri hem de lisede
              Biyoloji öğretiyorum; amacım öğrencilerin konuları ezberlemesi
              değil, yaşamın arkasındaki sistemi görmesi. Kuvvetten hücreye,
              ekosistemden genetiğe, her ölçekte aynı merakla yaklaşıyorum.
            </motion.p>

            <motion.div
              variants={staggerContainer(0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-14 grid sm:grid-cols-3 gap-5"
            >
              {PHILOSOPHY.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUpBig}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 hover:border-accent/30 transition-colors duration-500"
                >
                  <ShineSweep />
                  <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="relative inline-block mb-4">
                    <item.icon size={20} className="text-accent" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="relative font-medium text-foreground/90 mb-2">{item.title}</h3>
                  <p className="relative text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
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
/*  Interactive cell visual                                            */
/* ------------------------------------------------------------------ */

function CellVisual() {
  const organelles = [0, 60, 120, 180, 240, 300];

  return (
    <section className="relative py-32 sm:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative aspect-square max-w-md mx-auto"
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-accent/20 bg-gradient-to-br from-accent-deep/10 via-transparent to-accent-2/5"
          />
          <div className="absolute inset-8 rounded-full border border-dashed border-accent-light/15" />
          <div className="absolute inset-16 rounded-full border border-dashed border-accent-light/10" />

          {/* nucleus */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute inset-[35%] rounded-full bg-gradient-to-br from-accent/40 to-accent-2-light/20 shadow-[0_0_60px_-10px_rgb(from_var(--accent)_r_g_b_/_50%)]"
          />

          {/* orbiting organelles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            {organelles.map((deg) => (
              <div
                key={deg}
                className="absolute inset-0"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, delay: deg / 90, ease: "easeInOut" }}
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent-2-light"
                />
              </div>
            ))}
          </motion.div>

          {/* counter-rotating inner orbit */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="absolute inset-10"
          >
            {[30, 150, 270].map((deg) => (
              <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                <motion.span
                  animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: deg / 120, ease: "easeInOut" }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent"
                />
              </div>
            ))}
          </motion.div>

          {/* free-floating molecules escaping the membrane */}
          {[
            { top: "-4%", left: "10%", d: 7 },
            { top: "60%", left: "-6%", d: 9 },
            { top: "8%", left: "92%", d: 8 },
            { top: "80%", left: "88%", d: 6.5 },
          ].map((p, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -14, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: p.d, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: i * 0.7 }}
              style={{ top: p.top, left: p.left }}
              className="absolute w-1.5 h-1.5 rounded-full bg-accent-2-light pointer-events-none"
            />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUpBig}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-xs tracking-[0.3em] text-accent/80 mb-4">MİKRO DÜNYA</p>
          <p className="text-2xl sm:text-4xl font-semibold leading-snug tracking-tight text-foreground/90">
            &ldquo;Her hücre kendi içinde{" "}
            <span className="text-accent">kusursuz bir sistemdir.</span>&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Notes / Blog                                                       */
/* ------------------------------------------------------------------ */

function NoteCard({ note, tone }: { note: (typeof NOTES_BIO)[number]; tone: Tone }) {
  const toneClasses = TONE_CLASSES[tone];
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 8);
    rotateX.set(((e.clientY - rect.top) / rect.height - 0.5) * -8);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const background = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgb(from ${toneClasses.glowVar} r g b / 14%), transparent 70%)`;

  return (
    <motion.div
      variants={fadeUpBig}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -8, scale: 1.02 }}
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`group relative rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 overflow-hidden cursor-pointer ${toneClasses.border}`}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background }}
        />
        <ShineSweep />
        <div className="relative z-10">
          <span className={`text-[11px] tracking-[0.2em] ${toneClasses.category}`}>
            {note.category}
          </span>
          <h3 className="mt-4 text-xl font-medium text-foreground/95">{note.title}</h3>
          <p className="mt-3 text-sm text-foreground/50 leading-relaxed">{note.desc}</p>
          <div className="mt-8 flex items-center gap-2 text-sm text-foreground/70">
            <span>Devamını Oku</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1"
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
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <div className="flex items-center gap-4">
          <span className={`text-sm font-medium tracking-wide ${isOpen ? toneClasses.category : "text-foreground/70"}`}>
            {grade}
          </span>
          <span className="text-xs text-foreground/30">{topics.length} konu</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
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
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <motion.div
              variants={staggerContainer(0.04)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 pb-6"
            >
              {topics.map((topic) => (
                <motion.span
                  key={topic}
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  className={`text-xs rounded-full border border-foreground/10 px-3 py-1.5 text-foreground/60 transition-colors duration-300 ${toneClasses.border}`}
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
  const activeTone = NOTE_TAB_TONE[tab];

  return (
    <section id="notlar" className="relative py-32 sm:py-40 px-6 overflow-hidden">
      <FloatingDecor icon={Atom} className="top-20 right-[4%]" duration={9} />
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-xl mb-10"
        >
          <AccentBar />
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Bilgiyi Keşfet</h2>
          <p className="mt-4 text-foreground/50">
            Kademene göre seç: Fen Bilimleri mi, Biyoloji mi? Aşağıda sınıf sınıf tüm müfredatı bulabilirsin.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative inline-flex mb-14 rounded-full border border-foreground/10 bg-foreground/[0.02] p-1"
        >
          {NOTE_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative z-10 px-5 py-2.5 text-sm rounded-full transition-colors duration-300 ${
                tab === t ? "text-background" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className={`absolute inset-0 -z-10 rounded-full ${TONE_CLASSES[NOTE_TAB_TONE[t]].pillBg}`}
                />
              )}
              {t}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="grid md:grid-cols-3 gap-6"
          >
            {NOTES_BY_TAB[tab].map((note) => (
              <NoteCard key={note.title} note={note} tone={activeTone} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20"
        >
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">Tüm Konular</h3>
          <p className="mt-2 text-sm text-foreground/40">Sınıfına tıkla, o sınıfın tüm üniteleri açılsın.</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <CurriculumAccordion tab={tab} tone={activeTone} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                               */
/* ------------------------------------------------------------------ */

function CountUp({ target, duration = 1.6 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

function Stats() {
  return (
    <section className="relative py-28 sm:py-36 px-6 overflow-hidden">
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-bold text-foreground/[0.025] tracking-tight select-none whitespace-nowrap pointer-events-none">
        BIOLOGY
      </span>
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 text-center"
      >
        {STATS.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <div
              className={`text-4xl sm:text-5xl font-semibold ${
                stat.value === "∞" ? "text-pop" : "text-accent"
              }`}
            >
              {typeof stat.value === "number" ? (
                <>
                  <CountUp target={stat.value} />
                  {stat.suffix}
                </>
              ) : (
                stat.value
              )}
            </div>
            <div className="mt-2 text-sm text-foreground/50">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Quote                                                               */
/* ------------------------------------------------------------------ */

function WordReveal({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.p
      variants={staggerContainer(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className="text-2xl sm:text-4xl md:text-5xl font-semibold text-center leading-snug tracking-tight max-w-4xl mx-auto"
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={fadeUp} className="inline-block mr-[0.28em]">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

function Quote() {
  return (
    <section className="relative py-32 sm:py-44 px-6 overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-accent-deep/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-accent-2/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
        }}
        className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] pointer-events-none"
      >
        <FlowerIllustration className="w-full h-full" />
      </motion.div>
      <div className="relative">
        <WordReveal text="Bilim, cevaplardan çok doğru soruları sormayı öğretir." />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                             */
/* ------------------------------------------------------------------ */

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

  const inputClass =
    "w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:border-accent/60 focus:bg-foreground/[0.05] focus:shadow-[0_0_0_4px_rgb(from_var(--accent)_r_g_b_/_10%)]";

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl border border-accent/30 bg-accent/5 p-10 text-center"
        >
          <p className="text-accent font-medium">Mesajın ulaştı.</p>
          <p className="mt-2 text-sm text-foreground/50">En kısa sürede dönüş yapacağım.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ad Soyad"
              className={inputClass}
            />
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-posta"
              className={inputClass}
            />
          </motion.div>
          <motion.input
            variants={fadeUp}
            required
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Konu"
            className={inputClass}
          />
          <motion.textarea
            variants={fadeUp}
            required
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Mesaj"
            rows={5}
            className={`${inputClass} resize-none`}
          />
          <motion.button
            variants={fadeUp}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-background overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2-light to-accent bg-[length:200%_100%] transition-[background-position] duration-700 group-hover:bg-[position:100%_0]" />
            <span className="relative flex items-center gap-2">
              Gönder <Send size={15} />
            </span>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Contact() {
  return (
    <section id="iletisim" className="relative py-32 sm:py-40 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_0.8fr] gap-16">
        <motion.div
          variants={fadeUpBig}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <AccentBar />
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Aklında Bir Soru mu Var?
          </h2>
          <p className="mt-4 text-foreground/50 max-w-md">
            Biyoloji bazen karmaşık görünebilir. Birlikte çözelim.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex md:flex-col gap-4 md:justify-start"
        >
          {SOCIALS.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              variants={fadeUp}
              whileHover={{ x: 4, borderColor: "rgb(from var(--accent) r g b / 50%)" }}
              className="group flex items-center gap-3 rounded-xl border border-foreground/10 px-5 py-4 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              <motion.span
                whileHover={{ rotate: 12, scale: 1.15 }}
                className="inline-flex text-accent"
              >
                <social.icon size={17} strokeWidth={1.5} />
              </motion.span>
              {social.label}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative border-t border-foreground/10 px-6 py-8 overflow-hidden">
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
      />
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/40">
        <span className="flex items-center gap-2 text-foreground/70 font-medium">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="text-accent"
          >
            <Dna size={16} strokeWidth={1.5} />
          </motion.span>
          BIO<span className="text-accent">.</span>
        </span>
        <span className="text-center">Yaşamı anlamak, kendimizi anlamaktır.</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main className="relative bg-background text-foreground overflow-x-clip">
      <div className="noise-overlay" />
      <ScrollProgress />
      <CursorGlow />
      <FloatingNav />
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
    </main>
  );
}
