import { Response } from "express";
import { Visitor, getCredentials } from "../utils/index.js";
import { GardenRequest } from "../types/GardenTypes";
import { getAllSeeds, initializeVisitorDataObject } from "../utils/garden/index.js";

/**
 * Handle getting the seed menu data
 * @param req - The request object
 * @param res - The response object
 */
export const handleGetSeedMenu = async (req: GardenRequest, res: Response) => {
  try {
    // Get full credentials
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId } = credentials;

    // Initialize visitor
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const visitorData = await initializeVisitorDataObject(visitor);

    // Get all seeds
    const allSeeds = getAllSeeds();

    // Get purchased seeds
    const purchasedSeeds = visitorData.seedsPurchased;

    // Return seed menu data
    return res.json({
      success: true,
      data: {
        availableSeeds: allSeeds,
        purchasedSeeds,
        coinsAvailable: visitorData.coinsAvailable,
      },
    });
  } catch (error) {
    console.error("Error getting seed menu:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get seed menu",
    });
  }
};
