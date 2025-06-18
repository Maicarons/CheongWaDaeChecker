export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  try {
    const fetchRes = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": req.headers["user-agent"] || "",
      },
    });

    const contentType =
      fetchRes.headers.get("content-type") || "application/json";
    const body = await fetchRes.text(); // 如果你要返回图片、Buffer，请使用 arrayBuffer

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", contentType);

    res.status(fetchRes.status).send(body);
  } catch (err) {
    res.status(502).json({ error: `Proxy fetch failed: ${err.message}` });
  }
}
