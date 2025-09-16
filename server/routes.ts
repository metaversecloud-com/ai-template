import express from "express";
import {
  handleDropAsset,
  handleGetGameState,
  handleRemoveDroppedAssetsByUniqueName,
  handleFireToast,
  handlePlantSeed,
  handleHarvestPlant,
  handlePurchaseSeed,
  handleRemoveAllPlants,
  handleUpdateGrowthLevels,
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

// Game State
router.get("/game-state", handleGetGameState);

// Plants and Gardening
router.post("/plant-seed", handlePlantSeed);
router.post("/harvest-plant", handleHarvestPlant);
router.post("/purchase-seed", handlePurchaseSeed);
router.post("/update-growth-levels", handleUpdateGrowthLevels);
router.post("/remove-all-plants", handleRemoveAllPlants);

// Dropped Assets
router.post("/dropped-asset", handleDropAsset);
router.post("/remove-dropped-assets", handleRemoveDroppedAssetsByUniqueName);

// World
router.put("/world/fire-toast", handleFireToast);

export default router;
