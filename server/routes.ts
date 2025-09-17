import express from "express";
import {
  handleDropAsset,
  handleGetGameState,
  handleRemoveDroppedAssetsByUniqueName,
  handleFireToast,
  handleGetHomeInstructions,
  handleClaimPlot,
  handleGetPlotDetails,
  handleGetSeedMenu,
  handlePurchaseSeed,
  handlePlantSeed,
  handleGetPlantDetails,
  handleHarvestPlant,
} from "./controllers/index.js";
import { getVersion } from "./utils/getVersion.js";

const router = express.Router();
const SERVER_START_DATE = new Date();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

router.get("/system/health", (req, res) => {
  return res.json({
    appVersion: getVersion(),
    status: "OK",
    serverStartDate: SERVER_START_DATE,
    envs: {
      NODE_ENV: process.env.NODE_ENV,
      INSTANCE_DOMAIN: process.env.INSTANCE_DOMAIN,
      INTERACTIVE_KEY: process.env.INTERACTIVE_KEY,
      S3_BUCKET: process.env.S3_BUCKET,
    },
  });
});

// Dropped Assets
router.get("/game-state", handleGetGameState);
router.post("/dropped-asset", handleDropAsset);
router.post("/remove-dropped-assets", handleRemoveDroppedAssetsByUniqueName);

// World
router.put("/world/fire-toast", handleFireToast);

// Garden Game Routes
router.get("/garden/home-instructions", handleGetHomeInstructions);
router.post("/garden/claim-plot", handleClaimPlot);
router.get("/garden/plot-details", handleGetPlotDetails);
router.get("/garden/seed-menu", handleGetSeedMenu);
router.post("/garden/purchase-seed", handlePurchaseSeed);
router.post("/garden/plant-seed", handlePlantSeed);
router.get("/garden/plant-details", handleGetPlantDetails);
router.post("/garden/harvest-plant", handleHarvestPlant);

export default router;
