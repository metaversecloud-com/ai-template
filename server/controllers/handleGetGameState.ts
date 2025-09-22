import { Request, Response } from "express";
import {
  errorHandler,
  getCredentials,
  initializeVisitorData,
  calculateGrowthLevel,
  getSeedConfig,
  Visitor,
  DroppedAsset,
} from "../utils/index.js";

/**
 * Get the current game state for a visitor including their plot, plants, and coin balance
 */
export const handleGetGameState = async (req: Request, res: Response) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId } = credentials;

    // Initialize visitor data with defaults if needed
    let visitorData = await initializeVisitorData(credentials);

    // Update plant growth levels for all plants
    const updatedPlants = { ...visitorData.plants };
    let hasUpdates = false;

    for (const [plantAssetId, plant] of Object.entries(visitorData.plants)) {
      if (!plant.wasHarvested) {
        const seedConfig = getSeedConfig(plant.seedId);
        if (seedConfig) {
          const currentGrowthLevel = calculateGrowthLevel(
            plant.dateDropped,
            seedConfig.growthTime,
            seedConfig.harvestLevel,
          );

          if (currentGrowthLevel !== plant.growLevel) {
            // Update growth level in memory
            updatedPlants[plantAssetId] = {
              ...plant,
              growLevel: currentGrowthLevel,
            };
            hasUpdates = true;

            try {
              const droppedAsset = await DroppedAsset.create(plantAssetId, urlSlug, { credentials });
              if (droppedAsset) {
                await droppedAsset.updateWebImageLayers("", seedConfig.imageVariations[currentGrowthLevel]);
              }
            } catch (error) {
              console.error("Failed to update dropped asset:", error);
            }
          }
        }
      }
    }

    // Save updated plant data if there were changes
    if (hasUpdates) {
      const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
      visitorData = { ...visitorData, plants: updatedPlants };
      await visitor.updateDataObject(visitorData, {
        analytics: [{ analyticName: "plant_growth_updated" }],
      });
    }

    return res.json({
      success: true,
      visitorData,
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleGetGameState",
      message: "Error getting game state",
      req,
      res,
    });
  }
};
