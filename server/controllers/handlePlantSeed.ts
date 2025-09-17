import { Response } from "express";
import { Asset, DroppedAsset, Visitor, World, getCredentials } from "../utils/index.js";
import { GardenRequest, Plant } from "../types/GardenTypes";
import {
  calculatePlantPosition,
  getPlantImageForGrowthLevel,
  getSeedById,
  initializeVisitorDataObject,
} from "../utils/garden/index.js";

/**
 * Handle planting a seed in a plot
 * @param req - The request object
 * @param res - The response object
 */
export const handlePlantSeed = async (req: GardenRequest, res: Response) => {
  try {
    // Get full credentials
    const credentials = getCredentials(req.query);
    const { assetId, profileId, urlSlug, visitorId } = credentials;

    // Get seed ID and plot ID from request body
    const { seedId, plotId } = req.body;

    if (seedId === undefined || plotId === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing seedId or plotId in request body",
      });
    }

    // Initialize visitor
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const visitorData = await initializeVisitorDataObject(visitor);

    // Get seed details
    const seed = getSeedById(Number(seedId));

    if (!seed) {
      return res.status(404).json({
        success: false,
        error: "Seed not found",
      });
    }

    // Check if the plot is available
    if (!visitorData.availablePlots[plotId]) {
      return res.status(400).json({
        success: false,
        error: "Plot is not available",
      });
    }

    // Check if the seed is free or the visitor owns it
    const isFree = seed.cost === 0;
    const isOwned = visitorData.seedsPurchased[seedId] !== undefined;

    if (!isFree && !isOwned) {
      return res.status(400).json({
        success: false,
        error: "You do not own this seed",
      });
    }

    // Get the plot's dropped asset
    const plotAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });

    // Calculate the position for the plant
    const position = await calculatePlantPosition(plotAsset, Number(plotId));

    // Create a web image asset for the plant
    const plantAsset = await Asset.create("webImageAsset", { credentials });

    // Get the initial image URL for the seed
    const imageUrl = getPlantImageForGrowthLevel(Number(seedId), 0);

    // Drop the plant asset into the world
    const world = World.create(urlSlug, { credentials });
    const plantDroppedAsset = await DroppedAsset.drop(plantAsset, {
      position,
      isInteractive: true,
      interactivePublicKey: credentials.interactivePublicKey,
      layer0: imageUrl,
      clickType: "link",
      clickableLink: `${req.hostname}/plant?plantId=${plantAsset.id}&ownerProfileId=${profileId}`,
      urlSlug,
    });

    // Create the plant record
    const plant: Plant = {
      dateDropped: new Date().toISOString(),
      seedId: Number(seedId),
      growLevel: 0,
      plotId: Number(plotId),
      wasHarvested: false,
    };

    // Update visitor data - mark plot as unavailable and add plant
    await visitor.updateDataObject({
      availablePlots: {
        ...visitorData.availablePlots,
        [plotId]: false,
      },
      plants: {
        ...visitorData.plants,
        [plantDroppedAsset.id as string]: plant,
      },
    });

    // Add analytics for planting
    await visitor.incrementDataObjectValue("plantsPlanted", 1, {
      analytics: [
        {
          analyticName: "plantedSeed",
          uniqueKey: `${profileId}-plant-${plantDroppedAsset.id}`,
          incrementBy: 1,
        },
      ],
    });

    // Trigger a particle effect
    world
      .triggerParticle({
        name: "growStar",
        duration: 3,
        position,
      })
      .catch((error) => {
        console.error("Error triggering particle effect:", error);
        // Non-critical, continue
      });

    return res.json({
      success: true,
      data: {
        plantId: plantDroppedAsset.id,
        plant,
      },
    });
  } catch (error) {
    console.error("Error planting seed:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to plant seed",
    });
  }
};
