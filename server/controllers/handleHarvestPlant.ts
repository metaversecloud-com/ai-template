import { Request, Response } from "express";
import {
  DroppedAsset,
  errorHandler,
  getCredentials,
  getSeedById,
  initializeVisitorDataObject,
  Visitor,
  World,
} from "../utils/index.js";

export const handleHarvestPlant = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId } = credentials;
    const { plantId } = req.body;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        error: "Missing plantId in request body",
      });
    }

    // Create a world instance
    const world = World.create(urlSlug, { credentials });

    // Get the visitor to check their plants
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

    // Initialize the visitor's data object
    const visitorData = await initializeVisitorDataObject(visitor);

    // Check if the plant exists in the visitor's data
    if (!visitorData.plants || !visitorData.plants[plantId]) {
      return res.status(404).json({
        success: false,
        error: `Plant with ID ${plantId} not found in your garden.`,
      });
    }

    // Get the plant data
    const plant = visitorData.plants[plantId];

    // Check if the plant has already been harvested
    if (plant.wasHarvested) {
      return res.status(400).json({
        success: false,
        error: "This plant has already been harvested.",
      });
    }

    // Check if the plant is mature enough to harvest
    if (plant.growLevel < 10) {
      return res.status(400).json({
        success: false,
        error: `This plant is not ready for harvest yet. Current growth level: ${plant.growLevel}/10`,
      });
    }

    // Get the seed details to determine the reward
    const seed = getSeedById(plant.seedId);
    if (!seed) {
      return res.status(500).json({
        success: false,
        error: `Invalid seedId in plant data: ${plant.seedId}`,
      });
    }

    // Calculate the reward
    const reward = seed.reward;

    // Update the plant as harvested
    const updatedPlants = {
      ...visitorData.plants,
      [plantId]: {
        ...plant,
        wasHarvested: true,
      },
    };

    // Update the visitor's coins and plant data
    const updatedCoinsEarned = visitorData.totalCoinsEarned + reward;
    const updatedCoinsAvailable = visitorData.coinsAvailable + reward;

    await visitor.updateDataObject({
      totalCoinsEarned: updatedCoinsEarned,
      coinsAvailable: updatedCoinsAvailable,
      plants: updatedPlants,
    });

    // Get the dropped asset to find its position
    try {
      const droppedAsset = await DroppedAsset.get(plantId, urlSlug, { credentials });

      // Track harvest analytics
      droppedAsset.incrementDataObjectValue("harvestCount", 1, {
        analytics: [{ analyticName: "plantsHarvested", uniqueKey: visitorId.toString() }],
      });

      // Update dropped asset data to reflect harvested state
      droppedAsset.updateDataObject(
        {
          wasHarvested: true,
          harvestedAt: new Date().toISOString(),
          reward,
        },
        {
          analytics: [{ analyticName: "rewards", uniqueKey: visitorId.toString() }],
        },
      );

      // Trigger a particle effect at the plant's position
      world.triggerParticle({
        name: "Sparkle",
        duration: 5,
        position: droppedAsset.position,
      });

      // Remove the dropped asset from the world
      try {
        // Use the static World.deleteDroppedAssets method to remove the asset
        await World.deleteDroppedAssets(urlSlug, [plantId], process.env.INTERACTIVE_SECRET!, credentials);
        console.log(`Successfully removed plant ${plantId} from world.`);
      } catch (deleteError) {
        console.error(`Error deleting dropped asset ${plantId}:`, deleteError);
        // Continue execution even if asset removal fails
      }
    } catch (error) {
      console.error(`Error processing dropped asset ${plantId}:`, error);
      // Continue execution even if asset processing fails
    }

    // Fire a toast to notify the user
    world.fireToast({
      title: "Plant Harvested!",
      text: `You harvested your ${seed.name} and earned ${reward} coins!`,
    });

    return res.json({
      success: true,
      reward,
      visitorData: {
        totalCoinsEarned: updatedCoinsEarned,
        coinsAvailable: updatedCoinsAvailable,
      },
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleHarvestPlant",
      message: "Error harvesting plant",
      req,
      res,
    });
  }
};
