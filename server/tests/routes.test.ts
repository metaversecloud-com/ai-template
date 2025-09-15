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

  test("POST /drop-plant creates a dropped asset with the provided image URL", async () => {
    const app = makeApp();
    const plantImageUrl = "https://assets.topia.io/image/plants/plant1.png";
    const plantName = "Fern Plant";

    const res = await request(app)
      .post("/api/drop-plant")
      .query(baseCreds)
      .send({ imageUrl: plantImageUrl, plantName });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("droppedAsset");

    // Assert SDK method calls
    expect(topiaMock.lastAssetCreateArgs).toBeTruthy();
    expect(topiaMock.lastAssetCreateArgs.assetIdOrUrl).toBe("webImageAsset");
    expect(topiaMock.lastAssetCreateArgs.opts.credentials).toMatchObject(baseCreds);

    // Assert DroppedAsset.drop was called with correct parameters
    expect(topiaMock.lastDroppedAssetArgs).toBeTruthy();
    expect(topiaMock.lastDroppedAssetArgs.opts.isInteractive).toBe(true);
    expect(topiaMock.lastDroppedAssetArgs.opts.interactivePublicKey).toBe(baseCreds.interactivePublicKey);
    expect(topiaMock.lastDroppedAssetArgs.opts.urlSlug).toBe(baseCreds.urlSlug);
    expect(topiaMock.lastDroppedAssetArgs.opts.position).toHaveProperty("x");
    expect(topiaMock.lastDroppedAssetArgs.opts.position).toHaveProperty("y");
    expect(topiaMock.lastDroppedAssetArgs.opts.uniqueName).toContain("plant-");
    expect(topiaMock.lastDroppedAssetArgs.opts.layer0).toBe(plantImageUrl);

    // Assert Visitor.get was called
    expect(topiaMock.lastVisitorGetArgs).toBeTruthy();
    expect(topiaMock.lastVisitorGetArgs.visitorId).toBe(baseCreds.visitorId);
    expect(topiaMock.lastVisitorGetArgs.urlSlug).toBe(baseCreds.urlSlug);
    expect(topiaMock.lastVisitorGetArgs.opts.credentials).toMatchObject(baseCreds);

    // Assert World.triggerParticle and World.fireToast were called
    expect(topiaMock.triggerParticle).toHaveBeenCalledTimes(1);
    expect(topiaMock.fireToast).toHaveBeenCalledTimes(1);
    expect(topiaMock.fireToast).toHaveBeenCalledWith({
      title: "Plant Added!",
      text: `Your ${plantName} has been added to the world!`,
    });
  });

  test("POST /drop-plant returns error if imageUrl is missing", async () => {
    const app = makeApp();

    const res = await request(app).post("/api/drop-plant").query(baseCreds).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("error", "Missing imageUrl in request body");
  });
});
