import {
  Compass,
  Sparkles,
  Lightbulb,
  Camera,
  Play,
  Briefcase,
  Mail,
  Atom,
  GraduationCap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

export const NAV_LINKS = [
  { label: "Hakkımda", href: "#hakkimda" },
  { label: "Branşlar", href: "#branslar" },
  { label: "Ders Notları", href: "#notlar" },
  { label: "İletişim", href: "#iletisim" },
];

export const BRANCHES = [
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
export const TONE_CLASSES = {
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

export type Tone = keyof typeof TONE_CLASSES;

export const TOPICS_TICKER = [
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

export const PHILOSOPHY = [
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

export const NOTE_TABS = ["Ortaokul • Fen Bilimleri", "Lise • Biyoloji"] as const;

export const NOTE_TAB_TONE: Record<(typeof NOTE_TABS)[number], Tone> = {
  "Ortaokul • Fen Bilimleri": "pop",
  "Lise • Biyoloji": "accent",
};

export const NOTES_FEN = [
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

export const NOTES_BIO = [
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

export const NOTES_BY_TAB: Record<(typeof NOTE_TABS)[number], typeof NOTES_BIO> = {
  "Ortaokul • Fen Bilimleri": NOTES_FEN,
  "Lise • Biyoloji": NOTES_BIO,
};

export const CURRICULUM: Record<(typeof NOTE_TABS)[number], { grade: string; topics: string[] }[]> = {
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

export const STATS: { value: number | string; suffix?: string; label: string }[] = [
  { value: 100, suffix: "+", label: "Ders Notu" },
  { value: 500, suffix: "+", label: "Öğrenci" },
  { value: 2, label: "Farklı Kademe" },
  { value: 10, suffix: "+", label: "Yıllık Deneyim" },
  { value: "∞", label: "Merak" },
];

export const SOCIALS = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Play, href: "#", label: "YouTube" },
  { icon: Briefcase, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:merhaba@bio.dev", label: "E-mail" },
];

export const SECTION_IDS = ["hero", "branslar", "hakkimda", "notlar", "iletisim"];

export const RAIL_SECTIONS = [
  { id: "hero", label: "Başlangıç" },
  { id: "branslar", label: "Branşlar" },
  { id: "hakkimda", label: "Hakkımda" },
  { id: "notlar", label: "Ders Notları" },
  { id: "iletisim", label: "İletişim" },
];
