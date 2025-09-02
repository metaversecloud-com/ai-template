const topiaMock = require("../mocks/@rtsdk/topia").__mock;

import express from "express";
import request from "supertest";

import router from "../routes.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  return app;
}

const baseCreds = {
  assetId: "asset-123",
  interactivePublicKey: process.env.INTERACTIVE_KEY,
  interactiveNonce: "nonce-xyz",
  visitorId: 1,
  urlSlug: "my-world",
};

describe("routes", () => {
  beforeEach(() => {
    topiaMock.reset();
  });

  test("GET /system/health returns status OK and env keys", async () => {
    const app = makeApp();
    let res = await request(app).get("/api/system/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("envs");
    expect(res.body.envs).toHaveProperty("NODE_ENV");
  });

  test("PUT /world/fire-toast sends a toast via World.fireToast and returns ok", async () => {
    const app = makeApp();

    const res = await request(app)
      .put("/api/world/fire-toast")
      .query(baseCreds)
      .send({ title: "Hello", text: "World" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    // Assert SDK usage
    expect(topiaMock.fireToast).toHaveBeenCalledTimes(1);
    expect(topiaMock.fireToast).toHaveBeenCalledWith({ title: "Hello", text: "World" });

    // Assert credentials flowed into WorldFactory.create
    const args = topiaMock.lastWorldCreateArgs;
    expect(args).toBeTruthy();
    expect(args.slug).toBe("my-world");
    expect(args.opts?.credentials).toMatchObject(baseCreds);
  });
});
