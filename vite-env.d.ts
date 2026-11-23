/// <reference types="vite-plugin-svgr/client" />

/** Latest GitHub release fetched at build time (see vite.config.ts), or null. */
declare const __LATEST_RELEASE__: {
  version?: string;
  url?: string;
  assets?: Partial<
    Record<"windows" | "macos" | "deb" | "rpm", { url: string; size: number }>
  >;
} | null;
