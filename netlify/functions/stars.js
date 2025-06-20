export async function handler() {
  try {
    const token = process.env.GITHUB_TOKEN;
    console.log("Token present:", !!token);

    const response = await fetch(
      "https://api.github.com/repos/nikolchaa/resuma",
      {
        headers: {
          "User-Agent": "resuma-site",
          Authorization: `Bearer ${token || ""}`,
        },
      }
    );

    const status = response.status;
    const data = await response.json();

    console.log("GitHub API status:", status);
    console.log("GitHub API body:", data);

    const stars = data?.stargazers_count;

    if (!stars && stars !== 0) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "GitHub response missing stargazers_count",
          received: data,
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ stars }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  }
}
