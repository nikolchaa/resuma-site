const REPO = "nikolchaa/resuma";

// Matches the bundle names tauri-action produces (see release assets).
const ASSET_PATTERNS = {
  windows: /_x64-setup\.exe$/,
  macos: /_aarch64\.dmg$/,
  deb: /_amd64\.deb$/,
  rpm: /\.x86_64\.rpm$/,
};

// `durable` keeps one cached copy shared by every Netlify edge node, so most
// visitors get a cached answer and GitHub is asked about once per 15 minutes.
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=300",
  "Netlify-CDN-Cache-Control":
    "public, durable, s-maxage=900, stale-while-revalidate=86400",
};

// Errors must never be cached, by the browser or the Netlify CDN.
const errorHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export async function handler() {
  try {
    const token = process.env.GITHUB_TOKEN;

    const response = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        headers: {
          "User-Agent": "resuma-site",
          Accept: "application/vnd.github+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      console.error("latest-release: GitHub API status", response.status);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Failed to fetch latest release" }),
        headers: errorHeaders,
      };
    }

    const data = await response.json();
    const assets = {};

    for (const [key, pattern] of Object.entries(ASSET_PATTERNS)) {
      const match = data.assets?.find((asset) => pattern.test(asset.name));
      if (match) {
        assets[key] = {
          url: match.browser_download_url,
          size: match.size,
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        version: data.tag_name,
        url: data.html_url,
        assets,
      }),
      headers,
    };
  } catch (err) {
    console.error("latest-release ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch version" }),
      headers: errorHeaders,
    };
  }
}
