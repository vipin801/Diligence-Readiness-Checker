/**
 * Theme state.
 *
 * DESIGN.md is light-first and says so repeatedly, so light is the default and
 * the tool does NOT flip with the visitor's OS setting — it is a page on a
 * light marketing site, and following `prefers-color-scheme` would make the
 * tool disagree with the site around it. Dark mode is a deliberate choice the
 * visitor makes, and it is remembered.
 *
 * The only thing stored is the word "light" or "dark". No answer, no result and
 * no identifier is ever persisted — that constraint is untouched.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "incentiv-theme";
export const DEFAULT_THEME: Theme = "light";

/**
 * Runs before first paint, from a blocking inline <script> in <head>, so a
 * visitor who chose dark last time never sees a cream flash first. Kept to one
 * expression and wrapped in try/catch: storage throws in some privacy modes,
 * and a theme is never worth breaking the page over.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}`;

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** The class on <html> is the source of truth once the page is live. */
export function currentTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

const listeners = new Set<() => void>();

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // A visitor who blocks storage still gets the theme for this visit.
  }
  for (const listener of listeners) listener();
}

/* --- useSyncExternalStore wiring -------------------------------------------
   The server has no way to know the stored theme, so it renders the default and
   the client corrects it on hydration. Going through useSyncExternalStore is
   what makes that correction a legitimate re-render rather than a hydration
   mismatch. */

export function subscribeToTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getThemeSnapshot(): Theme {
  return currentTheme();
}

export function getThemeServerSnapshot(): Theme {
  return DEFAULT_THEME;
}
