import { createContext, useContext } from "react";

/* ------------------------------------------------------------------ */
/*  Intro gate — true once the preloader curtains start to part, so    */
/*  the hero's entrance plays in view instead of behind the overlay.   */
/* ------------------------------------------------------------------ */

export const IntroContext = createContext(true);

export function useIntroReady() {
  return useContext(IntroContext);
}
