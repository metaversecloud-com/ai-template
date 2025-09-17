import { DroppedAsset } from "@rtsdk/topia";
import { PLANT_IMAGES, Plant, Seed } from "../../types/GardenTypes";
import { getSeedById } from "./getSeedData";

/**
 * Get the appropriate image URL for a plant based on its growth level
 * @param seedId - The seed ID of the plant
 * @param growLevel - The current growth level
 * @returns The URL for the plant image
 */
export const getPlantImageForGrowthLevel = (seedId: number, growLevel: number): string => {
  const growthLevels = Object.keys(PLANT_IMAGES[seedId])
    .map(Number)
    .sort((a, b) => a - b);

  // Find the highest growth level that's less than or equal to the current level
  const appropriateLevel = growthLevels.filter((level) => level <= growLevel).pop() || 0;

  return PLANT_IMAGES[seedId][appropriateLevel];
};

/**
 * Check if a plant is ready for harvest
 * @param plant - The plant object
 * @returns True if the plant is ready for harvest
 */
export const isPlantReadyForHarvest = (plant: Plant): boolean => {
  return plant.growLevel >= 10 && !plant.wasHarvested;
};

/**
 * Calculate the current growth level of a plant based on time passed
 * @param plant - The plant object
 * @returns The updated growth level (0-10)
 */
export const calculateGrowthLevel = (plant: Plant): number => {
  const seed = getSeedById(plant.seedId);
  if (!seed) return plant.growLevel;

  const plantingTime = new Date(plant.dateDropped).getTime();
  const currentTime = Date.now();
  const growthTimeMs = seed.growthTimeSeconds * 1000;

  // Calculate how much time has passed as a percentage of total growth time
  const timePassedPercent = Math.min(1, (currentTime - plantingTime) / growthTimeMs);

  // Map to growth level (0-10)
  const growthLevel = Math.floor(timePassedPercent * 10);

  return growthLevel;
};
