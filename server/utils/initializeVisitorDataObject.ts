import { VisitorDataInterface } from "../types/VisitorDataInterface.js";
import { SEEDS } from "./seedData.js";

export const initializeVisitorDataObject = async (visitor: any) => {
  try {
    await visitor.fetchDataObject();
    const visitorData = visitor.dataObject as VisitorDataInterface;

    // If the visitor data object doesn't exist or is missing required properties, initialize it
    if (
      !visitorData ||
      typeof visitorData.totalCoinsEarned !== "number" ||
      typeof visitorData.coinsAvailable !== "number" ||
      !visitorData.plants
    ) {
      // Get default unlocked seeds
      const defaultUnlockedSeeds = SEEDS.filter((seed) => seed.unlockedByDefault).map((seed) => seed.id);

      const initialVisitorData: VisitorDataInterface = {
        totalCoinsEarned: 0,
        coinsAvailable: 0,
        plants: {},
        unlockedSeeds: defaultUnlockedSeeds,
      };

      // Adding a lockId and releaseLock will prevent race conditions
      const lockId = `visitor-${new Date(Math.round(new Date().getTime() / 60000) * 60000)}`;
      await visitor
        .setDataObject(initialVisitorData, { lock: { lockId, releaseLock: true } })
        .catch(() => console.warn("Unable to acquire lock, another process may be updating the visitor data object"));

      return initialVisitorData;
    }

    // If unlockedSeeds is missing, add it with default values
    if (!visitorData.unlockedSeeds) {
      const defaultUnlockedSeeds = SEEDS.filter((seed) => seed.unlockedByDefault).map((seed) => seed.id);

      await visitor.updateDataObject({
        unlockedSeeds: defaultUnlockedSeeds,
      });

      return {
        ...visitorData,
        unlockedSeeds: defaultUnlockedSeeds,
      };
    }

    return visitorData;
  } catch (error: any) {
    // If fetchDataObject fails, initialize with a default structure
    const defaultUnlockedSeeds = SEEDS.filter((seed) => seed.unlockedByDefault).map((seed) => seed.id);

    const initialVisitorData: VisitorDataInterface = {
      totalCoinsEarned: 0,
      coinsAvailable: 0,
      plants: {},
      unlockedSeeds: defaultUnlockedSeeds,
    };

    const lockId = `visitor-${new Date(Math.round(new Date().getTime() / 60000) * 60000)}`;
    await visitor
      .setDataObject(initialVisitorData, { lock: { lockId, releaseLock: true } })
      .catch(() => console.warn("Unable to acquire lock, another process may be updating the visitor data object"));

    return initialVisitorData;
  }
};
