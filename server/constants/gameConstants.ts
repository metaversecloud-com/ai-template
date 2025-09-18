import { VisitorDataObject } from "../../shared/types/VisitorData.js";
import { PlotGridConfig } from "../types/Interfaces.js";

export const PLOT_GRID_CONFIG: PlotGridConfig = {
  gridSize: 4,
  squareSpacing: 32,
  plotDimensions: {
    width: 128,
    height: 128,
  },
};

export const DEFAULT_VISITOR_DATA: VisitorDataObject = {
  coinsAvailable: 0, // Starting coins
  totalCoinsEarned: 0,
  ownedPlot: null, // No plot claimed initially
  seedsPurchased: {},
  plants: {},
};
