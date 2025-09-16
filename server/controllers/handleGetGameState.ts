import { Request, Response } from "express";
import {
  errorHandler,
  getCredentials,
  getDroppedAsset,
  getSeedById,
  initializeVisitorDataObject,
  initializeWorldDataObject,
  SEEDS,
  updateGrowthLevels,
  Visitor,
  World,
} from "../utils/index.js";
import { VisitorInterface } from "@rtsdk/topia";
import axios from "axios";

export const handleGetGameState = async (req: Request, res: Response) => {
  try {
    const credentials = getCredentials(req.query);
    const { assetId, displayName, interactiveNonce, interactivePublicKey, profileId, sceneDropId, urlSlug, visitorId } =
      credentials;

    const droppedAsset = await getDroppedAsset(credentials);
    if (droppedAsset instanceof Error) throw droppedAsset;

    const world = World.create(urlSlug, { credentials });
    world.triggerParticle({ name: "Sparkle", duration: 3, position: droppedAsset.position }).catch((error: any) =>
      errorHandler({
        error,
        functionName: "handleGetGameState",
        message: "Error triggering particle effects",
      }),
    );

    // Get the visitor and initialize their data
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const { isAdmin } = visitor as VisitorInterface;

    // Initialize the visitor's data object
    let visitorData = await initializeVisitorDataObject(visitor);

    // Initialize the world's data object
    const worldData = await initializeWorldDataObject(world, sceneDropId, assetId);

    // Track analytics event for app open
    try {
      console.log("User opened the app - tracking 'joins' event");
      // Analytics tracking would go here in a real implementation
      // Since trackEvent is not available, we'll just log it
    } catch (error) {
      console.error("Error tracking joins event:", error);
    }

    // Update growth levels for all plants
    const updatedPlants = updateGrowthLevels(visitorData.plants);

    // If plants were updated, save the changes
    if (JSON.stringify(updatedPlants) !== JSON.stringify(visitorData.plants)) {
      await visitor.updateDataObject({
        plants: updatedPlants,
      });

      visitorData = {
        ...visitorData,
        plants: updatedPlants,
      };
    }

    try {
      await axios.post(
        `${process.env.LEADERBOARD_BASE_URL || "http://v2lboard0-prod-topia.topia-rtsdk.com"}/api/dropped-asset/increment-player-stats?assetId=${assetId}&displayName=${displayName}&interactiveNonce=${interactiveNonce}&interactivePublicKey=${interactivePublicKey}&profileId=${profileId}&urlSlug=${urlSlug}&visitorId=${visitorId}`,
        {
          publicKey: interactivePublicKey,
          secret: process.env.INTERACTIVE_SECRET,
          profileId,
          displayName,
          incrementBy: 1,
        },
      );
    } catch (error) {
      errorHandler({
        error,
        functionName: "handleGetGameState",
        message: "Error posting player stats to Leaderboard",
      });
    }

    // Prepare available seeds data for the client
    const availableSeeds = SEEDS.map((seed) => {
      const isLocked = !seed.unlockedByDefault && !visitorData.unlockedSeeds?.includes(seed.id);

      return {
        id: seed.id,
        name: seed.name,
        imageUrl: seed.imageUrl,
        cost: seed.cost,
        reward: seed.reward,
        growthTime: seed.growthTime,
        isLocked,
      };
    });

    // Return the complete game state
    return res.json({
      success: true,
      droppedAsset,
      isAdmin,
      visitorData,
      worldData,
      availableSeeds,
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "getDroppedAssetDetails",
      message: "Error getting dropped asset instance and data object",
      req,
      res,
    });
  }
};
