import { Response } from "express";
import { DroppedAsset, Visitor, World, getCredentials } from "../utils/index.js";
import { GardenRequest } from "../types/GardenTypes";
import {
  calculateGrowthLevel,
  getSeedById,
  initializeVisitorDataObject,
  isPlantReadyForHarvest,
} from "../utils/garden/index.js";

/**
 * Handle getting plant details and updating growth if needed
 * @param req - The request object
 * @param res - The response object
 */
export const handleGetPlantDetails = async (req: GardenRequest, res: Response) => {
  try {
    // Get full credentials
    const credentials = getCredentials(req.query);
    const { profileId, urlSlug, visitorId } = credentials;

    // Get plant ID from query
    const { plantId } = req.query;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        error: "Missing plantId parameter",
      });
    }

    // Initialize visitor
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const visitorData = await initializeVisitorDataObject(visitor);

    // Check if the plant exists in visitor data
    if (!visitorData.plants[plantId as string]) {
      return res.status(404).json({
        success: false,
        error: "Plant not found",
      });
    }

    // Get the plant data
    const plant = visitorData.plants[plantId as string];

    // Get the plant's dropped asset
    let droppedAsset;
    try {
      droppedAsset = await DroppedAsset.get(plantId as string, urlSlug, { credentials });
    } catch (error) {
      // If the asset is gone, it was probably removed or harvested
      return res.status(404).json({
        success: false,
        error: "Plant dropped asset not found",
      });
    }

    // Calculate the current growth level based on time passed
    const newGrowthLevel = calculateGrowthLevel(plant);

    // If growth level has changed, update it
    if (newGrowthLevel > plant.growLevel) {
      // Update the plant's growth level
      plant.growLevel = newGrowthLevel;

      // Update the visitor data
      await visitor.updateDataObject({
        plants: {
          ...visitorData.plants,
          [plantId as string]: plant,
        },
      });

      // If the plant is fully grown, trigger a particle effect
      if (isPlantReadyForHarvest(plant)) {
        const world = World.create(urlSlug, { credentials });
        world
          .triggerParticle({
            name: "confetti",
            duration: 5,
            position: droppedAsset.position,
          })
          .catch((error) => {
            console.error("Error triggering particle effect:", error);
            // Non-critical, continue
          });
      }
    }

    // Get the seed details
    const seed = getSeedById(plant.seedId);

    if (!seed) {
      return res.status(404).json({
        success: false,
        error: "Seed not found for this plant",
      });
    }

    // Determine if the current user is the owner
    const isOwner = true; // This would be determined by comparing profileId with plant owner

    // Determine if the plant can be harvested
    const canHarvest = isOwner && isPlantReadyForHarvest(plant);

    return res.json({
      success: true,
      data: {
        plant,
        seed,
        ownerName: "You", // This would be the actual owner name
        isOwner,
        canHarvest,
      },
    });
  } catch (error) {
    console.error("Error getting plant details:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get plant details",
    });
  }
};
