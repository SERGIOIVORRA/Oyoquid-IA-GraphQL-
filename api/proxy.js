// api/proxy.js — Vercel Serverless (Node 18/20)
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST /api/proxy" });
    }
    const { url, headers, body, method } = req.body || {};
    if (!url || !headers || typeof body === "undefined") {
      return res.status(400).json({ error: "Faltan campos: url, headers, body" });
    }

    // fetch global disponible en runtime de Vercel
    const r = await fetch(url, { method: method || "POST", headers, body });
    const text = await r.text();

    res.setHeader("Content-Type", "application/json");
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
};