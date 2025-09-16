import { Request, Response } from "express";
import {
  errorHandler,
  getCredentials,
  getSeedById,
  initializeVisitorDataObject,
  Visitor,
  World,
} from "../utils/index.js";

export const handlePurchaseSeed = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId } = credentials;
    const { seedId } = req.body;

    if (!seedId) {
      return res.status(400).json({
        success: false,
        error: "Missing seedId in request body",
      });
    }

    // Get the seed details
    const seed = getSeedById(seedId);
    if (!seed) {
      return res.status(400).json({
        success: false,
        error: `Invalid seedId: ${seedId}`,
      });
    }

    // Create a world instance
    const world = World.create(urlSlug, { credentials });

    // Get the visitor to check if they can purchase this seed
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

    // Initialize the visitor's data object
    const visitorData = await initializeVisitorDataObject(visitor);

    // Check if the seed is already unlocked
    const isAlreadyUnlocked =
      seed.unlockedByDefault || (visitorData.unlockedSeeds && visitorData.unlockedSeeds.includes(seedId));

    if (isAlreadyUnlocked) {
      return res.status(400).json({
        success: false,
        error: `You already own the ${seed.name} seed.`,
      });
    }

    // Check if the player has enough coins
    if (visitorData.coinsAvailable < seed.cost) {
      return res.status(400).json({
        success: false,
        error: `Not enough coins. You have ${visitorData.coinsAvailable}, but ${seed.name} costs ${seed.cost}.`,
      });
    }

    // Add the seed to the unlocked seeds array
    const unlockedSeeds = [...(visitorData.unlockedSeeds || []), seedId];

    // Update the visitor's data object
    const updatedCoinsAvailable = visitorData.coinsAvailable - seed.cost;

    await visitor.updateDataObject(
      {
        coinsAvailable: updatedCoinsAvailable,
        unlockedSeeds,
      },
      {
        analytics: [{ analyticName: "seedsPurchased", uniqueKey: visitorId.toString() }],
      },
    );

    // Fire a toast to notify the user
    world.fireToast({
      title: "Seed Purchased!",
      text: `You purchased the ${seed.name} seed for ${seed.cost} coins!`,
    });

    return res.json({
      success: true,
      seedId,
      visitorData: {
        totalCoinsEarned: visitorData.totalCoinsEarned,
        coinsAvailable: updatedCoinsAvailable,
        unlockedSeeds,
      },
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handlePurchaseSeed",
      message: "Error purchasing seed",
      req,
      res,
    });
  }
};
