import { Response } from "express";
import { Visitor, getCredentials } from "../utils/index.js";
import { GardenRequest, PurchasedSeed } from "../types/GardenTypes";
import { canPurchaseSeed, getSeedById, initializeVisitorDataObject } from "../utils/garden/index.js";

/**
 * Handle purchasing a seed
 * @param req - The request object
 * @param res - The response object
 */
export const handlePurchaseSeed = async (req: GardenRequest, res: Response) => {
  try {
    // Get full credentials
    const credentials = getCredentials(req.query);
    const { profileId, urlSlug, visitorId } = credentials;

    // Get seed ID from request body
    const { seedId } = req.body;

    if (!seedId) {
      return res.status(400).json({
        success: false,
        error: "Missing seedId in request body",
      });
    }

    // Initialize visitor
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const visitorData = await initializeVisitorDataObject(visitor);

    // Check if user already owns this seed
    if (visitorData.seedsPurchased[seedId]) {
      return res.status(400).json({
        success: false,
        error: "You already own this seed",
      });
    }

    // Get seed details
    const seed = getSeedById(Number(seedId));

    if (!seed) {
      return res.status(404).json({
        success: false,
        error: "Seed not found",
      });
    }

    // Check if user can afford the seed
    if (!canPurchaseSeed(seed.id, visitorData.coinsAvailable)) {
      return res.status(400).json({
        success: false,
        error: "Not enough coins to purchase this seed",
      });
    }

    // Create purchased seed record
    const purchasedSeed: PurchasedSeed = {
      id: seed.id,
      datePurchased: new Date().toISOString(),
    };

    // Update visitor data - add seed to purchased seeds and deduct coins
    const updatedCoinsAvailable = visitorData.coinsAvailable - seed.cost;

    await visitor.updateDataObject({
      coinsAvailable: updatedCoinsAvailable,
      seedsPurchased: {
        ...visitorData.seedsPurchased,
        [seed.id]: purchasedSeed,
      },
    });

    // Add analytics for seed purchase
    await visitor.incrementDataObjectValue("seedsPurchased", 1, {
      analytics: [
        {
          analyticName: "seedPurchased",
          uniqueKey: `${profileId}-seed-${seed.id}`,
          incrementBy: 1,
        },
      ],
    });

    return res.json({
      success: true,
      data: {
        seedPurchased: purchasedSeed,
        coinsAvailable: updatedCoinsAvailable,
      },
    });
  } catch (error) {
    console.error("Error purchasing seed:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to purchase seed",
    });
  }
};
