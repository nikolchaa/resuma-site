type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

export function setInitialTheme(
  storageKey = "vite-ui-theme",
  defaultTheme: Theme = "system"
) {
  const root = document.documentElement;

  const apply = (t: ResolvedTheme) => {
    root.classList.remove("light", "dark");
    root.classList.add(t);
  };

  const resolveSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const applyStoredTheme = () => {
    const stored = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    if (stored === "system") {
      apply(resolveSystemTheme());
    } else {
      apply(stored);
    }
  };

  // Initial apply
  applyStoredTheme();

  // Live system theme sync
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const systemListener = (e: MediaQueryListEvent) => {
    const current = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    if (current === "system") {
      apply(e.matches ? "dark" : "light");
    }
  };
  mql.addEventListener("change", systemListener);

  // Sync with other tabs/localStorage changes
  const storageListener = (e: StorageEvent) => {
    if (e.key === storageKey) {
      applyStoredTheme();
    }
  };
  window.addEventListener("storage", storageListener);

  // Optional: return cleanup for frameworks
  return () => {
    mql.removeEventListener("change", systemListener);
    window.removeEventListener("storage", storageListener);
  };
}
