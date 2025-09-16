import { WorldDataInterface } from "../types/WorldDataInterface.js";

export const initializeWorldDataObject = async (world: any, sceneDropId?: string, assetId?: string) => {
  try {
    await world.fetchDataObject();
    const worldData = (world.dataObject as WorldDataInterface) || {};

    // If sceneDropId and assetId are provided, update the world data object
    if (sceneDropId && assetId && !worldData[sceneDropId]) {
      const updatedWorldData = {
        ...worldData,
        [sceneDropId]: assetId,
      };

      // Adding a lockId and releaseLock will prevent race conditions
      const lockId = `world-${new Date(Math.round(new Date().getTime() / 60000) * 60000)}`;
      await world
        .setDataObject(updatedWorldData, { lock: { lockId, releaseLock: true } })
        .catch(() => console.warn("Unable to acquire lock, another process may be updating the world data object"));

      return updatedWorldData;
    }

    // If the world data object doesn't exist, initialize it
    if (!worldData || Object.keys(worldData).length === 0) {
      const initialWorldData: WorldDataInterface = {};

      if (sceneDropId && assetId) {
        initialWorldData[sceneDropId] = assetId;
      }

      const lockId = `world-${new Date(Math.round(new Date().getTime() / 60000) * 60000)}`;
      await world
        .setDataObject(initialWorldData, { lock: { lockId, releaseLock: true } })
        .catch(() => console.warn("Unable to acquire lock, another process may be updating the world data object"));

      return initialWorldData;
    }

    return worldData;
  } catch (error: any) {
    // If fetchDataObject fails, initialize with a default structure
    const initialWorldData: WorldDataInterface = {};

    if (sceneDropId && assetId) {
      initialWorldData[sceneDropId] = assetId;
    }

    const lockId = `world-${new Date(Math.round(new Date().getTime() / 60000) * 60000)}`;
    await world
      .setDataObject(initialWorldData, { lock: { lockId, releaseLock: true } })
      .catch(() => console.warn("Unable to acquire lock, another process may be updating the world data object"));

    return initialWorldData;
  }
};
