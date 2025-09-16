import { Request, Response } from "express";
import {
  DroppedAsset,
  errorHandler,
  getCredentials,
  initializeVisitorDataObject,
  updateGrowthLevels,
  Visitor,
} from "../utils/index.js";

export const handleUpdateGrowthLevels = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId } = credentials;

    // Get the visitor to update their plants' growth levels
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

    // Initialize the visitor's data object
    const visitorData = await initializeVisitorDataObject(visitor);

    // If there are no plants, return early
    if (!visitorData.plants || Object.keys(visitorData.plants).length === 0) {
      return res.json({
        success: true,
        updatedPlants: [],
      });
    }

    // Store the original growth levels for comparison
    const originalLevels: Record<string, number> = {};
    Object.entries(visitorData.plants).forEach(([plantId, plant]) => {
      if (!plant.wasHarvested) {
        originalLevels[plantId] = plant.growLevel;
      }
    });

    // Update growth levels for all plants
    const updatedPlants = updateGrowthLevels(visitorData.plants);

    // If plants were updated, save the changes
    if (JSON.stringify(updatedPlants) !== JSON.stringify(visitorData.plants)) {
      await visitor.updateDataObject(
        {
          plants: updatedPlants,
        },
        {
          analytics: [{ analyticName: "plantsGrown", uniqueKey: visitorId.toString() }],
        },
      );

      // Update the dropped asset analytics as well
      const plantsWithGrowthChanges = Object.entries(updatedPlants).filter(([plantId, plant]) => {
        return (
          !plant.wasHarvested && originalLevels[plantId] !== undefined && plant.growLevel > originalLevels[plantId]
        );
      });

      // Update each plant's dropped asset with its new growth level
      for (const [plantId, plant] of plantsWithGrowthChanges) {
        try {
          const droppedAsset = await DroppedAsset.get(plantId, urlSlug, { credentials });

          // Update the growth level in the dropped asset data
          await droppedAsset.updateDataObject(
            {
              growLevel: plant.growLevel,
              lastUpdated: new Date().toISOString(),
            },
            {
              analytics: [
                {
                  analyticName: "plantGrowthUpdated",
                  uniqueKey: visitorId.toString(),
                },
              ],
            },
          );
        } catch (error) {
          console.error(`Failed to update dropped asset for plant ${plantId}:`, error);
          // Continue with other plants even if one fails
        }
      }

      // Prepare response data showing which plants were updated
      const plantUpdates = plantsWithGrowthChanges.map(([plantId, plant]) => ({
        id: plantId,
        previousLevel: originalLevels[plantId],
        newLevel: plant.growLevel,
      }));

      return res.json({
        success: true,
        updatedPlants: plantUpdates,
      });
    }

    // If no plants were updated
    return res.json({
      success: true,
      updatedPlants: [],
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleUpdateGrowthLevels",
      message: "Error updating plant growth levels",
      req,
      res,
    });
  }
};
