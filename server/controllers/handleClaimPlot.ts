import { Request, Response } from "express";
import { errorHandler, getCredentials, initializeVisitorData, Visitor, DroppedAsset } from "../utils/index.js";

/**
 * Handle plot claiming - allows visitor to claim ownership of a plot
 * Each visitor can only claim one plot total
 */
export const handleClaimPlot = async (req: Request, res: Response) => {
  try {
    const credentials = getCredentials(req.query);
    const { assetId, urlSlug, visitorId, profileId, displayName } = credentials;

    // Initialize visitor data and check if they already own a plot
    const visitorData = await initializeVisitorData(credentials);
    console.log("🚀 ~ handleClaimPlot.ts:21 ~ visitorData:", visitorData);

    if (visitorData.ownedPlot) {
      return res.status(400).json({
        success: false,
        error: "You already own a plot. Each player can only claim one plot.",
      });
    }

    // Check if this plot is already claimed by someone else
    const plotAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });
    await plotAsset.fetchDataObject();

    const plotData = plotAsset.dataObject as { ownerId?: string; ownerName?: string };

    if (plotData?.ownerId && plotData.ownerId !== profileId) {
      return res.status(400).json({
        success: false,
        error: `This plot is already owned by ${plotData.ownerName || "another player"}.`,
      });
    }

    // Claim the plot
    const claimedDate = new Date().toISOString();

    // Initialize empty 4x4 grid (16 squares, all null initially)
    const plotSquares: { [key: number]: string | null } = {};
    for (let i = 0; i < 16; i++) {
      plotSquares[i] = null;
    }

    // Update visitor's data object
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    const updatedVisitorData = {
      ...visitorData,
      ownedPlot: {
        plotAssetId: assetId,
        claimedDate,
        plotSquares,
      },
    };

    await visitor.updateDataObject(updatedVisitorData, {
      analytics: [{ analyticName: "plot_claimed" }],
    });

    // Update plot asset's data object to mark ownership
    await plotAsset.setDataObject({
      ownerId: profileId,
      ownerName: displayName,
      claimedDate,
    });

    // TODO: Update plot's clickable link when SDK method is available
    // const updatedLink = `${req.get('host') || 'localhost'}/plot?ownerName=${encodeURIComponent(displayName)}&ownerProfileId=${profileId}`;
    // await plotAsset.updateAsset({ clickableLink: updatedLink });

    return res.json({
      success: true,
      data: {
        plotAssetId: assetId,
        claimedDate,
      },
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleClaimPlot",
      message: "Error claiming plot",
      req,
      res,
    });
  }
};
