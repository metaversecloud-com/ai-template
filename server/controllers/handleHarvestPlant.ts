import { Response } from "express";
import { DroppedAsset, Visitor, World, getCredentials } from "../utils/index.js";
import { GardenRequest } from "../types/GardenTypes";
import { getSeedById, initializeVisitorDataObject, isPlantReadyForHarvest } from "../utils/garden/index.js";

/**
 * Handle harvesting a plant
 * @param req - The request object
 * @param res - The response object
 */
export const handleHarvestPlant = async (req: GardenRequest, res: Response) => {
  try {
    // Get full credentials
    const credentials = getCredentials(req.query);
    const { profileId, urlSlug, visitorId } = credentials;

    // Get plant ID from request body
    const { plantId } = req.body;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        error: "Missing plantId in request body",
      });
    }

    // Initialize visitor
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const visitorData = await initializeVisitorDataObject(visitor);

    // Check if the plant exists in visitor data
    if (!visitorData.plants[plantId]) {
      return res.status(404).json({
        success: false,
        error: "Plant not found",
      });
    }

    // Get the plant data
    const plant = visitorData.plants[plantId];

    // Check if the plant is ready for harvest
    if (!isPlantReadyForHarvest(plant)) {
      return res.status(400).json({
        success: false,
        error: "Plant is not ready for harvest",
      });
    }

    // Get the seed details to calculate reward
    const seed = getSeedById(plant.seedId);

    if (!seed) {
      return res.status(404).json({
        success: false,
        error: "Seed not found for this plant",
      });
    }

    // Calculate the reward
    const coinsEarned = seed.reward;
    const newTotalCoinsEarned = visitorData.totalCoinsEarned + coinsEarned;
    const newCoinsAvailable = visitorData.coinsAvailable + coinsEarned;

    // Mark the plot as available again
    const updatedAvailablePlots = { ...visitorData.availablePlots };
    updatedAvailablePlots[plant.plotId] = true;

    // Mark the plant as harvested
    const updatedPlant = { ...plant, wasHarvested: true };
    const updatedPlants = { ...visitorData.plants, [plantId]: updatedPlant };

    // Update visitor data
    await visitor.updateDataObject({
      coinsAvailable: newCoinsAvailable,
      totalCoinsEarned: newTotalCoinsEarned,
      availablePlots: updatedAvailablePlots,
      plants: updatedPlants,
    });

    // Remove the plant's dropped asset from the world
    try {
      const droppedAsset = await DroppedAsset.get(plantId, urlSlug, { credentials });
      const position = droppedAsset.position;

      // Delete the dropped asset using the correct SDK method
      await droppedAsset.deleteDroppedAsset();

      // Trigger a harvest particle effect
      const world = World.create(urlSlug, { credentials });
      world
        .triggerParticle({
          name: "coins",
          duration: 3,
          position: position,
        })
        .catch((error) => {
          console.error("Error triggering particle effect:", error);
          // Non-critical, continue
        });
    } catch (error) {
      console.error("Error removing plant dropped asset:", error);
      // Continue anyway, as the plant is marked as harvested in data
    }

    // Add analytics for harvesting
    await visitor.incrementDataObjectValue("plantsHarvested", 1, {
      analytics: [
        {
          analyticName: "harvestedPlant",
          uniqueKey: `${profileId}-harvest-${plantId}`,
          incrementBy: 1,
        },
      ],
    });

    return res.json({
      success: true,
      data: {
        coinsEarned,
        totalCoinsEarned: newTotalCoinsEarned,
        coinsAvailable: newCoinsAvailable,
      },
    });
  } catch (error) {
    console.error("Error harvesting plant:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to harvest plant",
    });
  }
};
