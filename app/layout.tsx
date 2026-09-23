import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIO. | Fen Bilimleri & Biyoloji Öğretmeni",
  description:
    "Yaşamın kodlarını birlikte keşfedelim. Ortaokul Fen Bilimleri ve lise Biyoloji ders notları, blog ve kişisel portfolyo.",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (theme !== "light" && theme !== "dark") theme = "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
  try {
    /* Returning visitors and reduced-motion users skip the intro. Flag it
       before first paint so the server-rendered preloader never flashes. */
    if (
      sessionStorage.getItem("bio-intro-seen") === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.documentElement.setAttribute("data-preloaded", "");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
