// GlossaFlow API (squelette d'initialisation) — service HTTP minimal servant de
// support au pipeline CI/CD. Deux routes : /health (supervision) et /translate (stub).
const express = require("express");

const app = express();
app.use(express.json());

// Route de santé — utilisée par les probes Kubernetes et les smoke tests du pipeline
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "glossaflow-api", version: process.env.APP_VERSION || "dev" });
});

// Stub de traduction — l'implémentation réelle appellera le moteur GlossaFlow
app.post("/translate", (req, res) => {
  const { text, target } = req.body || {};
  if (!text || !target) {
    return res.status(400).json({ error: "Champs requis : text, target" });
  }
  res.json({ source: text, target, translation: `[${target}] ${text}` });
});

// Démarrage uniquement hors tests (supertest importe l'app sans écouter)
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`glossaflow-api à l'écoute sur :${port}`));
}

module.exports = app;
