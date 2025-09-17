import { Response } from "express";
import { DroppedAsset, World, getCredentials } from "../utils/index.js";
import { GardenRequest } from "../types/GardenTypes";
import { initializeWorldDataObject } from "../utils/garden/index.js";

/**
 * Handle claiming a plot for gardening
 * @param req - The request object
 * @param res - The response object
 */
export const handleClaimPlot = async (req: GardenRequest, res: Response) => {
  try {
    // Get full credentials
    const credentials = getCredentials(req.query);
    const { assetId, displayName, profileId, sceneDropId, urlSlug } = credentials;

    // Initialize world and get dropped asset
    const world = World.create(urlSlug, { credentials });
    const droppedAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });

    // Initialize world data object
    const worldData = await initializeWorldDataObject(world);

    // Check if this plot is already claimed
    if (worldData[sceneDropId]) {
      // If the plot is already claimed, get the owner info
      const ownerId = worldData[sceneDropId];

      // If current user is the owner, just return success
      if (ownerId === profileId) {
        return res.json({
          success: true,
          data: {
            ownerId: profileId,
            ownerName: displayName,
          },
        });
      }

      // Otherwise, return owner info
      return res.json({
        success: true,
        data: {
          ownerId,
          ownerName: "Another Gardener", // We would ideally get the real name from a user lookup
        },
      });
    }

    // If not claimed, claim the plot for this user
    await world.updateDataObject({
      [sceneDropId]: profileId,
    });

    // Update the dropped asset's clickable link to include owner info
    await droppedAsset.updateDataObject({
      ownerId: profileId,
      ownerName: displayName,
    });

    // Add owner info to the URL
    const baseUrl = req.hostname;
    const newClickableLink = `${baseUrl}/plot?ownerName=${encodeURIComponent(displayName)}&ownerProfileId=${profileId}`;

    try {
      // This is a stub - in a real implementation, we'd use the appropriate SDK method
      // to update the clickable link. Since we don't have access to the full SDK docs,
      // this is a placeholder.
      // await droppedAsset.updateClickableLink(newClickableLink);

      console.log(`Updated clickable link to: ${newClickableLink}`);
    } catch (linkError) {
      console.error("Error updating clickable link:", linkError);
      // Continue anyway, as this is not critical
    }

    return res.json({
      success: true,
      data: {
        ownerId: profileId,
        ownerName: displayName,
      },
    });
  } catch (error) {
    console.error("Error claiming plot:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to claim plot",
    });
  }
};
