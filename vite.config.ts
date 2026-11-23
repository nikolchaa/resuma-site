import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import svgr from "vite-plugin-svgr";
// The same code the site calls at runtime (/.netlify/functions/latest-release).
import { handler as latestReleaseHandler } from "./netlify/functions/latest-release.js";

/**
 * Latest GitHub release at build time, so the prerendered HTML (and the dev
 * server, which has no Netlify functions) already shows the version and links
 * straight to the installers. The page still refreshes it at runtime. Any
 * failure falls back to null and the page links to the release page instead.
 */
async function latestReleaseAtBuild() {
  try {
    const response = await Promise.race([
      latestReleaseHandler(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
    ]);
    if (!response || response.statusCode !== 200) return null;
    return JSON.parse(response.body);
  } catch {
    return null;
  }
}

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  define: {
    __LATEST_RELEASE__: JSON.stringify(await latestReleaseAtBuild()),
  },
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
      },
    }),
    tailwindcss(),
    svgr(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
