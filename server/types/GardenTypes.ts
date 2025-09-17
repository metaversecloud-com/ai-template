import { Request, Response } from "express";

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
 * Default visitor data object
 */
export const DEFAULT_VISITOR_DATA: VisitorDataObject = {
  coinsAvailable: 10,
  totalCoinsEarned: 0,
  availablePlots: {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
  },
  seedsPurchased: {},
  plants: {},
};

/**
 * Interface for the world's data object structure
 */
export interface WorldDataObject {
  [sceneDropId: string]: string; // Maps sceneDropId to assetId
}

/**
 * Default world data object
 */
export const DEFAULT_WORLD_DATA: WorldDataObject = {};

/**
 * The structure of the garden-specific credential properties
 */
export interface GardenCredentials {
  profileId: string;
  displayName: string;
  sceneDropId: string;
  assetId: string;
}

/**
 * Extended request interface for garden requests
 */
export interface GardenRequest extends Request {
  gardenCredentials?: GardenCredentials;
}

/**
 * Helper seed data for the game
 */
export const SEEDS: Seed[] = [
  {
    id: 1,
    name: "Sunflower",
    imageUrl: "https://storage.googleapis.com/topia-world-assets/garden-game/sunflower_seed.png",
    cost: 0, // Free seed
    reward: 1,
    growthTimeSeconds: 30,
  },
  {
    id: 2,
    name: "Carrot",
    imageUrl: "https://storage.googleapis.com/topia-world-assets/garden-game/carrot_seed.png",
    cost: 0, // Free seed
    reward: 1,
    growthTimeSeconds: 60,
  },
  {
    id: 3,
    name: "Tomato",
    imageUrl: "https://storage.googleapis.com/topia-world-assets/garden-game/tomato_seed.png",
    cost: 0, // Free seed
    reward: 1,
    growthTimeSeconds: 90,
  },
  {
    id: 4,
    name: "Pumpkin",
    imageUrl: "https://storage.googleapis.com/topia-world-assets/garden-game/pumpkin_seed.png",
    cost: 5,
    reward: 10,
    growthTimeSeconds: 120,
  },
  {
    id: 5,
    name: "Rose",
    imageUrl: "https://storage.googleapis.com/topia-world-assets/garden-game/rose_seed.png",
    cost: 10,
    reward: 20,
    growthTimeSeconds: 180,
  },
  {
    id: 6,
    name: "Magic Bean",
    imageUrl: "https://storage.googleapis.com/topia-world-assets/garden-game/magic_bean_seed.png",
    cost: 20,
    reward: 40,
    growthTimeSeconds: 300,
  },
];

/**
 * Maps seedId -> growLevel -> imageUrl
 */
export const PLANT_IMAGES: Record<number, Record<number, string>> = {
  1: {
    // Sunflower
    0: "https://storage.googleapis.com/topia-world-assets/garden-game/sunflower_seed.png",
    1: "https://storage.googleapis.com/topia-world-assets/garden-game/sunflower_sprout.png",
    3: "https://storage.googleapis.com/topia-world-assets/garden-game/sunflower_small.png",
    5: "https://storage.googleapis.com/topia-world-assets/garden-game/sunflower_medium.png",
    7: "https://storage.googleapis.com/topia-world-assets/garden-game/sunflower_large.png",
    10: "https://storage.googleapis.com/topia-world-assets/garden-game/sunflower_full.png",
  },
  2: {
    // Carrot
    0: "https://storage.googleapis.com/topia-world-assets/garden-game/carrot_seed.png",
    1: "https://storage.googleapis.com/topia-world-assets/garden-game/carrot_sprout.png",
    3: "https://storage.googleapis.com/topia-world-assets/garden-game/carrot_small.png",
    5: "https://storage.googleapis.com/topia-world-assets/garden-game/carrot_medium.png",
    7: "https://storage.googleapis.com/topia-world-assets/garden-game/carrot_large.png",
    10: "https://storage.googleapis.com/topia-world-assets/garden-game/carrot_full.png",
  },
  3: {
    // Tomato
    0: "https://storage.googleapis.com/topia-world-assets/garden-game/tomato_seed.png",
    1: "https://storage.googleapis.com/topia-world-assets/garden-game/tomato_sprout.png",
    3: "https://storage.googleapis.com/topia-world-assets/garden-game/tomato_small.png",
    5: "https://storage.googleapis.com/topia-world-assets/garden-game/tomato_medium.png",
    7: "https://storage.googleapis.com/topia-world-assets/garden-game/tomato_large.png",
    10: "https://storage.googleapis.com/topia-world-assets/garden-game/tomato_full.png",
  },
  4: {
    // Pumpkin
    0: "https://storage.googleapis.com/topia-world-assets/garden-game/pumpkin_seed.png",
    1: "https://storage.googleapis.com/topia-world-assets/garden-game/pumpkin_sprout.png",
    3: "https://storage.googleapis.com/topia-world-assets/garden-game/pumpkin_small.png",
    5: "https://storage.googleapis.com/topia-world-assets/garden-game/pumpkin_medium.png",
    7: "https://storage.googleapis.com/topia-world-assets/garden-game/pumpkin_large.png",
    10: "https://storage.googleapis.com/topia-world-assets/garden-game/pumpkin_full.png",
  },
  5: {
    // Rose
    0: "https://storage.googleapis.com/topia-world-assets/garden-game/rose_seed.png",
    1: "https://storage.googleapis.com/topia-world-assets/garden-game/rose_sprout.png",
    3: "https://storage.googleapis.com/topia-world-assets/garden-game/rose_small.png",
    5: "https://storage.googleapis.com/topia-world-assets/garden-game/rose_medium.png",
    7: "https://storage.googleapis.com/topia-world-assets/garden-game/rose_large.png",
    10: "https://storage.googleapis.com/topia-world-assets/garden-game/rose_full.png",
  },
  6: {
    // Magic Bean
    0: "https://storage.googleapis.com/topia-world-assets/garden-game/magic_bean_seed.png",
    1: "https://storage.googleapis.com/topia-world-assets/garden-game/magic_bean_sprout.png",
    3: "https://storage.googleapis.com/topia-world-assets/garden-game/magic_bean_small.png",
    5: "https://storage.googleapis.com/topia-world-assets/garden-game/magic_bean_medium.png",
    7: "https://storage.googleapis.com/topia-world-assets/garden-game/magic_bean_large.png",
    10: "https://storage.googleapis.com/topia-world-assets/garden-game/magic_bean_full.png",
  },
};
