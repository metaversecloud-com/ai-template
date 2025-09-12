import { Request, Response } from "express";
import { dropPlantAsset } from "../utils/droppedAssets/dropPlantAsset";
import { DroppedAssetInterface } from "../types/DroppedAssetInterface";

// POST /api/drop-plant-asset
export async function handleDropPlantAsset(req: Request, res: Response) {
  const { imageUrl } = req.body;
  if (typeof imageUrl !== "string" || !imageUrl) {
    return res.status(400).json({ success: false, error: "Missing or invalid imageUrl" });
  }
  try {
    // DroppedAsset.create
    const asset: DroppedAssetInterface = await dropPlantAsset(imageUrl);
    return res.json({ success: true, asset });
  } catch (err) {
    // errorHandler pattern
    return res.status(500).json({ success: false, error: err.message || "Failed to drop asset" });
  }
}
