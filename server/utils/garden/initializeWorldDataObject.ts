import { World } from "@rtsdk/topia";
import { DEFAULT_WORLD_DATA, WorldDataObject } from "../../types/GardenTypes";

/**
 * Check if a data object has the structure needed for world garden data
 * @param data - The data object to check
 * @returns True if the data has the correct structure
 */
function isValidWorldData(data: any): data is WorldDataObject {
  return typeof data === "object" && data !== null;
}

/**
 * Initialize the world's garden data object if it doesn't exist
 * @param world - The world instance
 * @returns The current world data object
 */
export const initializeWorldDataObject = async (world: World): Promise<WorldDataObject> => {
  try {
    const worldData = await world.fetchDataObject();

    // If the world doesn't have any data, initialize it
    if (!worldData || !isValidWorldData(worldData)) {
      await world.setDataObject(DEFAULT_WORLD_DATA);
      return DEFAULT_WORLD_DATA;
    }

    return worldData as WorldDataObject;
  } catch (error) {
    console.error("Error initializing world data object:", error);
    throw new Error("Failed to initialize world data object");
  }
};
