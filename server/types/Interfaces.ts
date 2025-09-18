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
