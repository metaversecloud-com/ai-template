export interface VisitorDataInterface {
  totalCoinsEarned: number;
  coinsAvailable: number;
  plants: {
    [droppedAssetId: string]: import("./PlantInterface").PlantInterface;
  };
  unlockedSeeds?: number[]; // Array of unlocked seed IDs
}
