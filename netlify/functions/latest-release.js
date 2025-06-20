export async function handler() {
  try {
    const token = process.env.GITHUB_TOKEN;
    console.log("Token present:", !!token);

    const response = await fetch(
      "https://api.github.com/repos/nikolchaa/tauri-plugin-hwinfo/releases/latest",
      {
        headers: {
          "User-Agent": "resuma-site",
          Authorization: `Bearer ${token || ""}`,
        },
      }
    );

    const data = await response.json();

    console.log("GitHub release response:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ version: data.tag_name }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.error("latest-release ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch version" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  }
}
