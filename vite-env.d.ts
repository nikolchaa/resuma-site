/// <reference types="vite-plugin-svgr/client" />

/** An installer key from netlify/functions/latest-release.js. */
type ReleaseAssetKey =
  | "windows-x64"
  | "windows-arm64"
  | "macos-arm64"
  | "macos-x64"
  | "appimage-x64"
  | "appimage-arm64"
  | "deb-x64"
  | "deb-arm64"
  | "rpm-x64"
  | "rpm-arm64";

/** Latest GitHub release fetched at build time (see vite.config.ts), or null. */
declare const __LATEST_RELEASE__: {
  version?: string;
  url?: string;
  assets?: Partial<Record<ReleaseAssetKey, { url: string; size: number }>>;
} | null;
