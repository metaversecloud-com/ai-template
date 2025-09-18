export interface VisitorDataObject {
  coinsAvailable: number; // Current spendable coins
  totalCoinsEarned: number; // Lifetime coins earned (for unlocks)
  ownedPlot: {
    plotAssetId: string;
    claimedDate: string;
    plotSquares: {
      [squareIndex: number]: string | null; // droppedAssetId of plant or null if empty (0-15)
    };
  } | null; // null if no plot claimed yet
  seedsPurchased: {
    [seedId: number]: {
      id: number;
      datePurchased: string;
    };
  };
  plants: {
    [droppedAssetId: string]: {
      dateDropped: string;
      seedId: number;
      growLevel: number;
      squareIndex: number; // Which square in the plot (0-15)
      wasHarvested: boolean;
    };
  };
}

export interface WorldDataObject {
  [sceneDropId: string]: string; // Maps sceneDropId to assetId
}

export interface PlotGridConfig {
  gridSize: 4; // 4x4 grid of squares
  squareSpacing: 32; // pixels between plot squares
  plotDimensions: {
    width: 128; // total plot width in world units
    height: 128; // total plot height in world units
  };
}