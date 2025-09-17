import request from "supertest";
import express from "express";
import router from "../routes";

// Mock all controller functions to avoid actual implementation
jest.mock("../controllers/index.js", () => ({
  handleGetHomeInstructions: jest.fn((req, res) => res.json({ success: true, data: "Test instructions" })),
  handleClaimPlot: jest.fn((req, res) => res.json({ success: true, data: { plotId: 1 } })),
  handleGetPlotDetails: jest.fn((req, res) => res.json({ success: true, data: { plotId: 1, isAvailable: true } })),
  handleGetSeedMenu: jest.fn((req, res) => res.json({ success: true, data: { seeds: [], coinsAvailable: 10 } })),
  handlePurchaseSeed: jest.fn((req, res) => res.json({ success: true, data: { coinsAvailable: 5 } })),
  handlePlantSeed: jest.fn((req, res) => res.json({ success: true, data: { plantId: "plant-123" } })),
  handleGetPlantDetails: jest.fn((req, res) =>
    res.json({ success: true, data: { plantId: "plant-123", growthPercentage: 50 } }),
  ),
  handleHarvestPlant: jest.fn((req, res) => res.json({ success: true, data: { coinsEarned: 10 } })),
  handleDropAsset: jest.fn((req, res) => res.json({ success: true })),
  handleGetGameState: jest.fn((req, res) => res.json({ success: true })),
  handleRemoveDroppedAssetsByUniqueName: jest.fn((req, res) => res.json({ success: true })),
  handleFireToast: jest.fn((req, res) => res.json({ success: true })),
}));

describe("Garden API Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api", router);
  });

  describe("GET /garden/home-instructions", () => {
    it("should return home instructions", async () => {
      const response = await request(app).get("/api/garden/home-instructions");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data", "Test instructions");
    });
  });

  describe("POST /garden/claim-plot", () => {
    it("should claim a plot", async () => {
      const response = await request(app).post("/api/garden/claim-plot").send({ plotId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("plotId", 1);
    });
  });

  describe("GET /garden/plot-details", () => {
    it("should return plot details", async () => {
      const response = await request(app).get("/api/garden/plot-details?plotId=1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("plotId", 1);
      expect(response.body.data).toHaveProperty("isAvailable", true);
    });
  });

  describe("GET /garden/seed-menu", () => {
    it("should return seed menu", async () => {
      const response = await request(app).get("/api/garden/seed-menu");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("seeds");
      expect(response.body.data).toHaveProperty("coinsAvailable", 10);
    });
  });

  describe("POST /garden/purchase-seed", () => {
    it("should purchase a seed", async () => {
      const response = await request(app).post("/api/garden/purchase-seed").send({ seedId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("coinsAvailable", 5);
    });
  });

  describe("POST /garden/plant-seed", () => {
    it("should plant a seed", async () => {
      const response = await request(app).post("/api/garden/plant-seed").send({ seedId: 1, plotId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("plantId", "plant-123");
    });
  });

  describe("GET /garden/plant-details", () => {
    it("should return plant details", async () => {
      const response = await request(app).get("/api/garden/plant-details?plantId=plant-123");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("plantId", "plant-123");
      expect(response.body.data).toHaveProperty("growthPercentage", 50);
    });
  });

  describe("POST /garden/harvest-plant", () => {
    it("should harvest a plant", async () => {
      const response = await request(app).post("/api/garden/harvest-plant").send({ plantId: "plant-123" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("coinsEarned", 10);
    });
  });
});
