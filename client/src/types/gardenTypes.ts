/**
 * Interface for a seed in the gardening game
 */
export interface Seed {
  id: number;
  name: string;
  imageUrl: string;
  cost: number;
  reward: number;
  growthTimeSeconds: number;
}

/**
 * Interface for a planted plant
 */
export interface Plant {
  dateDropped: string;
  seedId: number;
  growLevel: number;
  plotId: number;
  wasHarvested: boolean;
}

/**
 * Interface for a purchased seed
 */
export interface PurchasedSeed {
  id: number;
  datePurchased: string;
}

/**
 * Interface for the visitor's data object structure
 */
export interface VisitorDataObject {
  coinsAvailable: number;
  totalCoinsEarned: number;
  availablePlots: Record<number, boolean>;
  seedsPurchased: Record<number, PurchasedSeed>;
  plants: Record<string, Plant>; // Key is droppedAssetId
}

/**
 * Interface for plot details
 */
export interface PlotDetails {
  plotId: number;
  isAvailable: boolean;
  plantId?: string;
  plantDetails?: Plant;
}

/**
 * Interface for plant details
 */
export interface PlantDetails {
  plantId: string;
  seedId: number;
  seedName: string;
  growLevel: number;
  growthPercentage: number;
  imageUrl: string;
  isReadyForHarvest: boolean;
  dateDropped: string;
  plotId: number;
  isOwner: boolean;
  canHarvest: boolean;
}

/**
 * Interface for API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Interface for coin rewards
 */
export interface CoinReward {
  coinsEarned: number;
  totalCoinsEarned: number;
  coinsAvailable: number;
}
