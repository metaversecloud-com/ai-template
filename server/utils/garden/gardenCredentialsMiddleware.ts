import { NextFunction, Response } from "express";
import { getCredentials } from "../index.js";
import { GardenCredentials, GardenRequest } from "../../types/GardenTypes";

/**
 * Middleware to extract and validate garden-specific credentials
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const gardenCredentialsMiddleware = (req: GardenRequest, res: Response, next: NextFunction) => {
  try {
    const credentials = getCredentials(req.query);
    const { assetId, displayName, profileId, sceneDropId } = credentials;

    if (!assetId || !profileId) {
      return res.status(400).json({
        success: false,
        error: "Missing required credentials",
      });
    }

    // Set garden-specific credentials on the request object
    req.gardenCredentials = {
      assetId,
      displayName: displayName || "Anonymous Gardener",
      profileId,
      sceneDropId,
    };

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Invalid credentials",
    });
  }
};
