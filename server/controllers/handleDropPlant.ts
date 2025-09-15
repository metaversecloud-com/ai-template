import { Request, Response } from "express";
import { Asset, DroppedAsset, errorHandler, getCredentials, World, Visitor } from "../utils/index.js";
import { DroppedAssetInterface, VisitorInterface } from "@rtsdk/topia";

export const handleDropPlant = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, interactivePublicKey, visitorId } = credentials;
    const { imageUrl, plantName } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing imageUrl in request body",
      });
    }

    // Create a world instance
    const world = World.create(urlSlug, { credentials });

    // Calculate position for the new plant (random position for simplicity)
    // Using a fixed position since we can't easily get the visitor's position
    const position = {
      x: 500 + Math.floor(Math.random() * 200) - 100, // Random position around x: 500
      y: 500 + Math.floor(Math.random() * 200) - 100, // Random position around y: 500
    };

    // Create a unique name for the plant asset
    const uniqueName = `plant-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create an asset for the plant
    // Using the Topia Asset.create method
    const asset = Asset.create("webImageAsset", { credentials });

    // Drop the plant asset into the world
    // Using the Topia DroppedAsset.drop method to create the dropped asset
    const droppedAsset: DroppedAssetInterface = await DroppedAsset.drop(asset, {
      isInteractive: true,
      interactivePublicKey,
      layer0: imageUrl,
      position,
      uniqueName,
      urlSlug,
    });

    // Get the visitor to update their data object
    // Using the Topia Visitor.get method
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

    interface VisitorData {
      droppedPlants?: string[];
      [key: string]: any;
    }

    try {
      // Initialize visitor data object if needed
      const response = await visitor.fetchDataObject();
      // The dataObject is stored in the visitor instance after fetch
      const visitorData = (visitor.dataObject as VisitorData) || {};

      // If no droppedPlants array exists, initialize it
      if (!visitorData.droppedPlants || !Array.isArray(visitorData.droppedPlants)) {
        await visitor.setDataObject({
          ...visitorData,
          droppedPlants: [droppedAsset.id],
        });
      } else {
        await visitor.updateDataObject({
          droppedPlants: [...visitorData.droppedPlants, droppedAsset.id],
        });
      }
    } catch (error) {
      console.error("Error updating visitor data object", error);
      // Initialize with default data if fetchDataObject fails
      await visitor.setDataObject({
        droppedPlants: [droppedAsset.id],
      });
    }

    // Trigger a particle effect to highlight the new plant
    world.triggerParticle({
      name: "Sparkle",
      duration: 3,
      position,
    });

    // Fire a toast to notify the user
    world.fireToast({
      title: "Plant Added!",
      text: `Your ${plantName || "plant"} has been added to the world!`,
    });

    return res.json({
      success: true,
      droppedAsset,
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleDropPlant",
      message: "Error dropping plant asset",
      req,
      res,
    });
  }
};
