import { Request, Response } from "express";
import {
  Asset,
  DroppedAsset,
  errorHandler,
  getCredentials,
  getSeedById,
  initializeVisitorDataObject,
  SEEDS,
  Visitor,
  World,
} from "../utils/index.js";
import { PlantInterface } from "../types/PlantInterface.js";

export const handlePlantSeed = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, interactivePublicKey, visitorId } = credentials;
    const { seedId, position } = req.body;

    if (!seedId) {
      return res.status(400).json({
        success: false,
        error: "Missing seedId in request body",
      });
    }

    // Get the seed details
    const seed = getSeedById(seedId);
    if (!seed) {
      return res.status(400).json({
        success: false,
        error: `Invalid seedId: ${seedId}`,
      });
    }

    // Create a world instance
    const world = World.create(urlSlug, { credentials });

    // Get the visitor to check if they have unlocked this seed
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

    // Initialize the visitor's data object
    const visitorData = await initializeVisitorDataObject(visitor);

    // Check if the seed is unlocked
    const isUnlocked =
      seed.unlockedByDefault || (visitorData.unlockedSeeds && visitorData.unlockedSeeds.includes(seedId));

    if (!isUnlocked) {
      return res.status(400).json({
        success: false,
        error: `Seed ${seedId} is not unlocked. Purchase it first.`,
      });
    }

    // Check if the player has enough coins if the seed costs money
    if (seed.cost > 0 && visitorData.coinsAvailable < seed.cost) {
      return res.status(400).json({
        success: false,
        error: `Not enough coins. You have ${visitorData.coinsAvailable}, but ${seed.name} costs ${seed.cost}.`,
      });
    }

    // Calculate position for the new plant
    // If no position is provided, use a random position
    const plantPosition = position || {
      x: 500 + Math.floor(Math.random() * 200) - 100, // Random position around x: 500
      y: 500 + Math.floor(Math.random() * 200) - 100, // Random position around y: 500
    };

    // Create a unique name for the plant asset
    const uniqueName = `plant-${seedId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create an asset for the plant using the growth image for level 0
    const asset = Asset.create("webImageAsset", { credentials });

    // Drop the plant asset into the world
    const droppedAsset = await DroppedAsset.drop(asset, {
      isInteractive: false, // Plants are not interactive on their own
      interactivePublicKey,
      layer0: seed.imageUrl, // Use the seed's image
      position: plantPosition,
      uniqueName,
      urlSlug,
    });

    // Track analytics for the planted seed
    droppedAsset.setDataObject(
      {
        seedId,
        dateDropped: new Date().toISOString(),
        growLevel: 0,
      },
      {
        analytics: [{ analyticName: "seedsPlanted", uniqueKey: visitorId.toString() }],
      },
    );

    // Create plant data object
    const plantData: PlantInterface = {
      dateDropped: new Date().toISOString(),
      seedId,
      growLevel: 0,
      wasHarvested: false,
      lastUpdated: new Date().toISOString(),
    };

    // Deduct coins if the seed costs money
    const updatedCoinsAvailable = seed.cost > 0 ? visitorData.coinsAvailable - seed.cost : visitorData.coinsAvailable;

    // Update the visitor's data object
    await visitor.updateDataObject({
      coinsAvailable: updatedCoinsAvailable,
      plants: {
        ...visitorData.plants,
        [droppedAsset.id as string]: plantData,
      },
    });

    // Track analytics event for planting a seed
    try {
      console.log(`User planted a ${seed.name} seed - tracking 'seedsPlanted' event`);
      // Analytics tracking would go here in a real implementation
    } catch (error) {
      console.error("Error tracking seedsPlanted event:", error);
    }

    // Trigger a particle effect to highlight the new plant
    world.triggerParticle({
      name: "Sparkle",
      duration: 3,
      position: plantPosition,
    });

    // Fire a toast to notify the user
    world.fireToast({
      title: "Seed Planted!",
      text: `You planted a ${seed.name} seed. Come back later to see it grow!`,
    });

    return res.json({
      success: true,
      droppedAsset: {
        id: droppedAsset.id,
        position: plantPosition,
        seedId,
      },
      visitorData: {
        totalCoinsEarned: visitorData.totalCoinsEarned,
        coinsAvailable: updatedCoinsAvailable,
      },
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handlePlantSeed",
      message: "Error planting seed",
      req,
      res,
    });
  }
};
