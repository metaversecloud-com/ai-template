import { PlantInterface } from "../../types/PlantInterface.js";
import { getSeedById } from "../seedData.js";

// Calculate the growth level of a plant based on time elapsed
export const calculateGrowthLevel = (plant: PlantInterface): number => {
  const seed = getSeedById(plant.seedId);
  if (!seed) return plant.growLevel;

  const dateDropped = new Date(plant.dateDropped);
  const now = new Date();

  // Calculate elapsed time in minutes
  const elapsedMinutes = (now.getTime() - dateDropped.getTime()) / (1000 * 60);

  // Calculate the growth level based on the seed's growth time
  const calculatedLevel = Math.floor((elapsedMinutes / seed.growthTime) * seed.growthLevels);

  // Cap the growth level at the maximum (seed.growthLevels)
  return Math.min(calculatedLevel, seed.growthLevels);
};

// Update the growth levels of all plants
export const updateGrowthLevels = (plants: Record<string, PlantInterface>): Record<string, PlantInterface> => {
  const updatedPlants: Record<string, PlantInterface> = {};

  Object.entries(plants).forEach(([plantId, plant]) => {
    // Skip plants that have been harvested
    if (plant.wasHarvested) {
      updatedPlants[plantId] = plant;
      return;
    }

    const newGrowLevel = calculateGrowthLevel(plant);

    // Only update if the growth level has increased
    if (newGrowLevel > plant.growLevel) {
      updatedPlants[plantId] = {
        ...plant,
        growLevel: newGrowLevel,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      updatedPlants[plantId] = plant;
    }
  });

  return updatedPlants;
};
