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
      "https://api.github.com/repos/nikolchaa/resuma",
      {
        headers: {
          "User-Agent": "resuma-site",
          Accept: "application/vnd.github+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      console.error("stars: GitHub API status", response.status);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Failed to fetch repository" }),
        headers: errorHeaders,
      };
    }

    const data = await response.json();
    const stars = data?.stargazers_count;

    if (typeof stars !== "number") {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "GitHub response missing stargazers_count",
        }),
        headers: errorHeaders,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ stars }),
      headers,
    };
  } catch (err) {
    console.error("stars ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch stars" }),
      headers: errorHeaders,
    };
  }
}
