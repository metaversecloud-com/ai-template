import { backendAPI } from "./backendAPI";
import { SeedType, PlantInterface } from "./types";

// Get game state
export const getGameState = async () => {
  const response = await backendAPI.get("/game-state");
  return response.data;
};

// Plant a seed
export const plantSeed = async (seedType: SeedType, position: { x: number; y: number }) => {
  const response = await backendAPI.post("/plant-seed", { seedType, position });
  return response.data;
};

// Harvest a plant
export const harvestPlant = async (plantId: string) => {
  const response = await backendAPI.post("/harvest-plant", { plantId });
  return response.data;
};

// Purchase a seed
export const purchaseSeed = async (seedType: SeedType) => {
  const response = await backendAPI.post("/purchase-seed", { seedType });
  return response.data;
};

// Update growth levels
export const updateGrowthLevels = async () => {
  const response = await backendAPI.post("/update-growth-levels");
  return response.data;
};

// Remove all plants (admin function)
export const removeAllPlants = async () => {
  const response = await backendAPI.post("/remove-all-plants");
  return response.data;
};
