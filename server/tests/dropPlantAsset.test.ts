import request from "supertest";
import app from "../index";
jest.mock("@rtsdk/topia", () => require("../mocks/@rtsdk/topia"));

describe("POST /api/drop-plant-asset", () => {
  it("drops a plant asset and returns success", async () => {
    const imageUrl = "https://example.com/plant1.png";
    const res = await request(app).post("/api/drop-plant-asset").send({ imageUrl });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.asset).toBeDefined();
    expect(res.body.asset.url).toBe(imageUrl);
  });

  it("returns 400 for missing imageUrl", async () => {
    const res = await request(app).post("/api/drop-plant-asset").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
