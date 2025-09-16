import { Request, Response } from "express";
import {
  DroppedAsset,
  errorHandler,
  getCredentials,
  initializeVisitorDataObject,
  Visitor,
  World,
} from "../utils/index.js";

export const handleRemoveAllPlants = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId } = credentials;

    // Create world instance for SDK operations
    const world = World.create(urlSlug, { credentials });

    // Get the visitor to clear their plants
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

    // Initialize the visitor's data object
    const visitorData = await initializeVisitorDataObject(visitor);

    // If there are no plants, return early
    if (!visitorData.plants || Object.keys(visitorData.plants).length === 0) {
      return res.json({
        success: true,
        message: "No plants to remove",
      });
    }

    // Get all plant IDs for deletion
    const plantIds = Object.keys(visitorData.plants);

    // Count of successfully removed plants
    let removedCount = 0;

    // Collect all plant IDs for batch deletion
    const plantIdsToRemove: string[] = [];

    // Track each plant in analytics
    for (const plantId of plantIds) {
      try {
        // Try to get the dropped asset first
        const droppedAsset = await DroppedAsset.get(plantId, urlSlug, { credentials });

        // Track the removal in analytics
        droppedAsset.updateDataObject(
          {
            wasRemoved: true,
            removedAt: new Date().toISOString(),
          },
          {
            analytics: [{ analyticName: "plantsRemoved", uniqueKey: visitorId.toString() }],
          },
        );

        // Add this plant ID to the list for deletion
        plantIdsToRemove.push(plantId);
        removedCount++;
      } catch (error) {
        console.error(`Failed to process plant ${plantId}:`, error);
        // Continue with other plants even if one fails
      }
    }

    // Delete all plants in a single batch operation
    if (plantIdsToRemove.length > 0) {
      try {
        await World.deleteDroppedAssets(urlSlug, plantIdsToRemove, process.env.INTERACTIVE_SECRET!, credentials);
        console.log(`Successfully removed ${plantIdsToRemove.length} plants from world.`);
      } catch (deleteError) {
        console.error(`Error deleting dropped assets:`, deleteError);
      }
    }

    // Clear the plants from the visitor's data object
    await visitor.updateDataObject(
      {
        plants: {},
      },
      {
        analytics: [
          {
            analyticName: "gardenCleared",
            uniqueKey: visitorId.toString(),
          },
        ],
      },
    );

    // Show a toast to inform the user
    try {
      // Fire a toast notification
      await world.fireToast({
        title: "Garden Cleared",
        text: `All ${removedCount} plants have been removed.`,
      });
    } catch (toastError) {
      console.error("Failed to fire toast:", toastError);
      // Continue even if toast fails
    }

    return res.json({
      success: true,
      message: `Successfully removed ${removedCount} plants`,
      removedCount,
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleRemoveAllPlants",
      message: "Error removing all plants",
      req,
      res,
    });
  }
};
