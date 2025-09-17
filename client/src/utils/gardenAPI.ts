import axios from "axios";
import { ApiResponse, PlantDetails, PlotDetails, Seed, CoinReward } from "../types/gardenTypes";
import { backendAPI } from "./backendAPI";

/**
 * Fetches the game instructions
 */
export const getHomeInstructions = async (): Promise<ApiResponse<string>> => {
  try {
    const { data } = await backendAPI.get("/garden/home-instructions");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to fetch game instructions",
    };
  }
};

/**
 * Claims a plot for the player
 * @param plotId The ID of the plot to claim
 */
export const claimPlot = async (plotId: number): Promise<ApiResponse<{ plotId: number }>> => {
  try {
    const { data } = await backendAPI.post("/garden/claim-plot", { plotId });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to claim plot",
    };
  }
};

/**
 * Gets details about a specific plot
 * @param plotId The ID of the plot
 */
export const getPlotDetails = async (plotId: number): Promise<ApiResponse<PlotDetails>> => {
  try {
    const { data } = await backendAPI.get(`/garden/plot-details?plotId=${plotId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to get plot details",
    };
  }
};

/**
 * Gets the list of available seeds
 */
export const getSeedMenu = async (): Promise<ApiResponse<{ seeds: Seed[]; coinsAvailable: number }>> => {
  try {
    const { data } = await backendAPI.get("/garden/seed-menu");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to get seed menu",
    };
  }
};

/**
 * Purchases a seed
 * @param seedId The ID of the seed to purchase
 */
export const purchaseSeed = async (seedId: number): Promise<ApiResponse<{ coinsAvailable: number }>> => {
  try {
    const { data } = await backendAPI.post("/garden/purchase-seed", { seedId });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to purchase seed",
    };
  }
};

/**
 * Plants a seed in a plot
 * @param seedId The ID of the seed to plant
 * @param plotId The ID of the plot to plant in
 */
export const plantSeed = async (seedId: number, plotId: number): Promise<ApiResponse<{ plantId: string }>> => {
  try {
    const { data } = await backendAPI.post("/garden/plant-seed", { seedId, plotId });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to plant seed",
    };
  }
};

/**
 * Gets details about a specific plant
 * @param plantId The ID of the plant
 */
export const getPlantDetails = async (plantId: string): Promise<ApiResponse<PlantDetails>> => {
  try {
    const { data } = await backendAPI.get(`/garden/plant-details?plantId=${plantId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to get plant details",
    };
  }
};

/**
 * Harvests a plant
 * @param plantId The ID of the plant to harvest
 */
export const harvestPlant = async (plantId: string): Promise<ApiResponse<CoinReward>> => {
  try {
    const { data } = await backendAPI.post("/garden/harvest-plant", { plantId });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: "Failed to harvest plant",
    };
  }
};
