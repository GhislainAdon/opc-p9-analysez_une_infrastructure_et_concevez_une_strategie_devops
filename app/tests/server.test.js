// Tests unitaires du squelette — exécutés par le job "test" du pipeline.
const request = require("supertest");
const app = require("../src/server");

describe("GET /health", () => {
  it("répond 200 avec le statut ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("glossaflow-api");
  });
});

describe("POST /translate", () => {
  it("traduit un texte (stub)", async () => {
    const res = await request(app).post("/translate").send({ text: "bonjour", target: "en" });
    expect(res.statusCode).toBe(200);
    expect(res.body.translation).toContain("bonjour");
  });

  it("renvoie 400 si les champs manquent", async () => {
    const res = await request(app).post("/translate").send({});
    expect(res.statusCode).toBe(400);
  });
});
