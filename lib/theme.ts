import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Theme store                                                        */
/* ------------------------------------------------------------------ */

export type ThemeName = "dark" | "light";

export const themeListeners = new Set<() => void>();

export function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}

export function getThemeSnapshot(): ThemeName {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function getServerThemeSnapshot(): ThemeName {
  return "dark";
}

export function applyTheme(next: ThemeName) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
  themeListeners.forEach((listener) => listener());
}

/* The palette swap rides a View Transition where supported, so the two
   themes cross-dissolve instead of snapping channel by channel. */
export function setGlobalTheme(next: ThemeName) {
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
export function useThemeColors(names: string[]) {
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
