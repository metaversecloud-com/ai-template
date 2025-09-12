import { Request, Response } from "express";
import { Asset, DroppedAsset, errorHandler, getCredentials, World } from "../utils/index.js";
import { DroppedAssetInterface } from "@rtsdk/topia";

export const handleDropPlantAsset = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { interactivePublicKey, profileId, sceneDropId, urlSlug } = credentials;
    const { imageUrl, plantName } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const world = World.create(urlSlug, { credentials });

    // Create a new web image asset
    const asset = Asset.create("webImageAsset", { credentials });

    // Generate random position near the center of the world
    const xOffset = Math.floor(Math.random() * 400) - 200; // -200 to +200
    const yOffset = Math.floor(Math.random() * 400) - 200; // -200 to +200
    const x = 500 + xOffset; // Center around 500, 500
    const y = 500 + yOffset;

    // Drop the asset in the world with the image URL set to layer0
    await DroppedAsset.drop(asset, {
      isInteractive: true,
      interactivePublicKey,
      position: { x, y },
      uniqueName: `${sceneDropId}-plant-${Date.now()}`,
      urlSlug,
      layer0: imageUrl,
    });

    // Trigger a particle effect at the drop location
    world.triggerParticle({
      name: "whiteStar_burst",
      duration: 3,
      position: { x, y },
    });

    return res.json({
      success: true,
      message: "Plant asset dropped successfully!",
      position: { x, y },
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleDropPlantAsset",
      message: "Error dropping plant asset",
      req,
      res,
    });
  }
};
