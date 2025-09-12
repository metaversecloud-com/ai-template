import { IDroppedAsset } from "../../types/DroppedAssetInterface";
import { getTopiaWorld } from "../topiaInit";

export async function dropPlantAsset(imageUrl: string): Promise<IDroppedAsset> {
  try {
    const world = getTopiaWorld();
    // DroppedAsset.create
    // SDK: https://metaversecloud-com.github.io/mc-sdk-js/classes/DroppedAsset.html#create
    const asset = await world.DroppedAsset.create({ url: imageUrl });
    return asset as IDroppedAsset;
  } catch (err: any) {
    // error pattern
    throw new Error("dropPlantAsset failed: " + (err?.message || err));
  }
}
