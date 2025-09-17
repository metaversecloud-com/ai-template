import { SEEDS, Seed } from "../../types/GardenTypes";

/**
 * Get a seed by its ID
 * @param seedId - The ID of the seed to retrieve
 * @returns The seed object or undefined if not found
 */
export const getSeedById = (seedId: number): Seed | undefined => {
  return SEEDS.find((seed) => seed.id === seedId);
};

/**
 * Get all available seeds
 * @returns Array of all seeds
 */
export const getAllSeeds = (): Seed[] => {
  return SEEDS;
};

/**
 * Check if a seed can be purchased with the given number of coins
 * @param seedId - The ID of the seed to check
 * @param coinsAvailable - The number of coins available
 * @returns True if the seed can be purchased
 */
export const canPurchaseSeed = (seedId: number, coinsAvailable: number): boolean => {
  const seed = getSeedById(seedId);
  if (!seed) return false;

  return coinsAvailable >= seed.cost;
};
