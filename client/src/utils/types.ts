// Seeds
export type SeedType = "tomato" | "carrot" | "corn" | "strawberry" | "pumpkin" | "sunflower";

export interface SeedInterface {
  type: SeedType;
  name: string;
  description: string;
  growthTime: number; // in milliseconds
  value: number;
  cost: number;
  isPremium: boolean;
  imageUrl: string;
}

// Plants
export interface PlantInterface {
  id: string;
  seedType: SeedType;
  dateDropped: number;
  growLevel: number;
  position: {
    x: number;
    y: number;
  };
  wasHarvested: boolean;
}

// Game State
export interface GameState {
  success: boolean;
  visitorData: {
    coins: number;
    unlockedSeeds: SeedType[];
  };
  worldData: {
    highScore: number;
  };
  plants: Record<string, PlantInterface>;
  availableSeeds: SeedInterface[];
}

// API Responses
export interface PlantSeedResponse {
  success: boolean;
  plant: PlantInterface;
  remainingCoins: number;
}

export interface HarvestPlantResponse {
  success: boolean;
  coins: number;
  totalCoins: number;
  plantId: string;
}

export interface PurchaseSeedResponse {
  success: boolean;
  purchasedSeed: SeedType;
  remainingCoins: number;
  unlockedSeeds: SeedType[];
}

export interface UpdateGrowthResponse {
  success: boolean;
  updatedPlants: Array<{
    id: string;
    previousLevel: number;
    newLevel: number;
  }>;
}

export interface RemoveAllPlantsResponse {
  success: boolean;
  message: string;
  removedCount: number;
}
