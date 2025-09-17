/**
 * Garden API utility functions
 */
import { backendAPI } from "../backendAPI";

// Get game state
export const fetchGameState = async () => {
  try {
    const response = await backendAPI.get("/game-state");
    return response;
  } catch (error) {
    console.error("Error fetching game state:", error);
    throw error;
  }
};

// Claim a plot
export const claimPlot = async (plotId: number) => {
  try {
    const response = await backendAPI.post("/plot/claim", { plotId });
    return response;
  } catch (error) {
    console.error("Error claiming plot:", error);
    throw error;
  }
};

// Purchase a seed
export const purchaseSeed = async (seedId: number) => {
  try {
    const response = await backendAPI.post("/seed/purchase", { seedId });
    return response;
  } catch (error) {
    console.error("Error purchasing seed:", error);
    throw error;
  }
};

// Plant a seed
export const plantSeed = async (seedId: number, plotId: number) => {
  try {
    const response = await backendAPI.post("/plant/drop", { seedId, plotId });
    return response;
  } catch (error) {
    console.error("Error planting seed:", error);
    throw error;
  }
};

// Harvest a plant
export const harvestPlant = async (droppedAssetId: string) => {
  try {
    const response = await backendAPI.post("/plant/harvest", { droppedAssetId });
    return response;
  } catch (error) {
    console.error("Error harvesting plant:", error);
    throw error;
  }
};

// Update plant growth level
export const updatePlantGrowth = async (droppedAssetId: string, newGrowthLevel: number) => {
  try {
    const response = await backendAPI.post("/plant/update-growth", {
      droppedAssetId,
      newGrowthLevel,
    });
    return response;
  } catch (error) {
    console.error("Error updating plant growth:", error);
    throw error;
  }
};
