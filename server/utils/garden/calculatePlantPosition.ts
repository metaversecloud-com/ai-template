import { DroppedAsset } from "@rtsdk/topia";

/**
 * Grid configuration for plot layout
 */
const GRID_CONFIG = {
  rows: 4,
  cols: 3,
  cellWidth: 32, // Width of each grid cell in pixels
  cellHeight: 32, // Height of each grid cell in pixels
  offsetX: -48, // Offset from the plot asset center
  offsetY: -48, // Offset from the plot asset center
};

/**
 * Calculate the position for a plant based on the plot position and grid cell
 * @param plotAsset - The plot's dropped asset
 * @param plotId - The plot ID (grid cell) where the plant will be placed
 * @returns The calculated position for the plant
 */
export const calculatePlantPosition = async (
  plotAsset: DroppedAsset,
  plotId: number,
): Promise<{ x: number; y: number }> => {
  try {
    if (!plotAsset || !plotAsset.position) {
      throw new Error("Plot asset position not available");
    }

    // Calculate the row and column from the plotId
    const row = Math.floor(plotId / GRID_CONFIG.cols);
    const col = plotId % GRID_CONFIG.cols;

    // Calculate the position relative to the plot's position
    const relativeX = GRID_CONFIG.offsetX + col * GRID_CONFIG.cellWidth;
    const relativeY = GRID_CONFIG.offsetY + row * GRID_CONFIG.cellHeight;

    // Calculate the absolute position
    const x = plotAsset.position.x + relativeX;
    const y = plotAsset.position.y + relativeY;

    return { x, y };
  } catch (error) {
    console.error("Error calculating plant position:", error);
    throw new Error("Failed to calculate plant position");
  }
};
