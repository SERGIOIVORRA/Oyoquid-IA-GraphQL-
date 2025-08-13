// proxy.js — CORS proxy para Shopify Admin GraphQL (CommonJS)
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/proxy", async (req, res) => {
  try {
    const { url, headers, body, method } = req.body || {};
    if (!url || !headers || !body) {
      return res.status(400).json({ error: "Faltan campos: url, headers, body" });
    }
    const r = await fetch(url, { method: method || "POST", headers, body });
    const text = await r.text();
    let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

const PORT = 8787;
app.listen(PORT, () => console.log(`✅ CORS proxy en http://localhost:${PORT}/proxy`));