import { Response } from "express";
import { DroppedAsset, Visitor, World, getCredentials } from "../utils/index.js";
import { GardenRequest } from "../types/GardenTypes";
import { getAllSeeds, initializeVisitorDataObject, initializeWorldDataObject } from "../utils/garden/index.js";

/**
 * Handle getting plot details
 * @param req - The request object
 * @param res - The response object
 */
export const handleGetPlotDetails = async (req: GardenRequest, res: Response) => {
  try {
    // Get full credentials
    const credentials = getCredentials(req.query);
    const { assetId, displayName, profileId, sceneDropId, urlSlug, visitorId } = credentials;

    // Initialize world and visitor
    const world = World.create(urlSlug, { credentials });
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const droppedAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });

    // Initialize data objects
    const worldData = await initializeWorldDataObject(world);
    const visitorData = await initializeVisitorDataObject(visitor);

    // Check if this plot has an owner
    const ownerId = worldData[sceneDropId];
    let ownerName = "Unknown Gardener";

    if (ownerId === profileId) {
      ownerName = displayName;
    } else if (ownerId) {
      // In a real implementation, we might look up the owner's name
      ownerName = "Another Gardener";
    }

    // If there's no owner, return basic info
    if (!ownerId) {
      return res.json({
        success: true,
        data: {
          hasOwner: false,
          ownerId: null,
          ownerName: null,
          isCurrentUserOwner: false,
        },
      });
    }

    // If the current user is not the owner, return owner info only
    if (ownerId !== profileId) {
      return res.json({
        success: true,
        data: {
          hasOwner: true,
          ownerId,
          ownerName,
          isCurrentUserOwner: false,
        },
      });
    }

    // If the current user is the owner, return full plot details
    const allSeeds = getAllSeeds();
    const ownedSeedIds = Object.keys(visitorData.seedsPurchased).map(Number);
    const ownedSeeds = allSeeds.filter((seed) => seed.cost === 0 || ownedSeedIds.includes(seed.id));

    return res.json({
      success: true,
      data: {
        hasOwner: true,
        ownerId,
        ownerName,
        isCurrentUserOwner: true,
        availablePlots: visitorData.availablePlots,
        ownedSeeds,
        coinsAvailable: visitorData.coinsAvailable,
      },
    });
  } catch (error) {
    console.error("Error getting plot details:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get plot details",
    });
  }
};
