import { useContext, useState } from "react";

// context
import { GlobalDispatchContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage } from "@/utils";

interface PlotGridProps {
  plotSquares: { [key: number]: string | null };
  plants: { [key: string]: any };
  isReadOnly: boolean;
  onStateUpdate?: () => void;
}

export const PlotGrid = ({ plotSquares, plants, isReadOnly, onStateUpdate }: PlotGridProps) => {
  const dispatch = useContext(GlobalDispatchContext);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [selectedSeedId, setSelectedSeedId] = useState<number | null>(null);
  const [isPlanting, setIsPlanting] = useState(false);

  const handleSquareClick = (squareIndex: number) => {
    if (isReadOnly || plotSquares[squareIndex]) return;

    setSelectedSquare(selectedSquare === squareIndex ? null : squareIndex);
  };

  const handlePlantSeed = async () => {
    if (!selectedSeedId || selectedSquare === null) return;

    try {
      setIsPlanting(true);
      await backendAPI.post("/plant/drop", {
        seedId: selectedSeedId,
        squareIndex: selectedSquare,
      });

      setSelectedSquare(null);
      setSelectedSeedId(null);
      onStateUpdate?.();
    } catch (error) {
      setErrorMessage(dispatch, error as ErrorType);
    } finally {
      setIsPlanting(false);
    }
  };

  const renderSquare = (squareIndex: number) => {
    const plantAssetId = plotSquares[squareIndex];
    const plant = plantAssetId ? plants[plantAssetId] : null;
    const isEmpty = !plantAssetId;
    const isSelected = selectedSquare === squareIndex;

    let squareClass = "card small";
    if (isEmpty && !isReadOnly) {
      squareClass += " cursor-pointer";
      if (isSelected) squareClass += " selected";
    }
    if (plant?.wasHarvested) {
      squareClass += " opacity-50";
    }

    return (
      <div
        key={squareIndex}
        className={squareClass}
        onClick={() => handleSquareClick(squareIndex)}
        style={{ minHeight: "80px", minWidth: "80px" }}
      >
        <div className="card-details text-center">
          {plant && !plant.wasHarvested ? (
            <div>
              <p className="p3">{getSeedName(plant.seedId)}</p>
              <p className="p4 text-muted">Lv {plant.growLevel}/10</p>
              {plant.growLevel >= 10 && (
                <p className="p4 text-success">Ready!</p>
              )}
            </div>
          ) : plant && plant.wasHarvested ? (
            <p className="p4 text-muted">Harvested</p>
          ) : (
            <p className="p3 text-muted">{isReadOnly ? "Empty" : "+"}</p>
          )}
        </div>
      </div>
    );
  };

  const getSeedName = (seedId: number) => {
    const seedNames: { [key: number]: string } = {
      1: "🥕",
      2: "🥬",
      3: "🍅",
      4: "🎃",
    };
    return seedNames[seedId] || "🌱";
  };

  return (
    <div className="flex-col">
      <h3 className="h3 text-center">Garden Plot (4x4)</h3>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        {Array.from({ length: 16 }, (_, i) => renderSquare(i))}
      </div>

      {!isReadOnly && selectedSquare !== null && (
        <div className="card">
          <div className="card-details">
            <h4 className="h4">Plant Seed in Square {selectedSquare}</h4>
            <p className="p3">Select a seed to plant:</p>

            <div className="flex">
              <button
                className={`btn btn-outline ${selectedSeedId === 1 ? "selected" : ""}`}
                onClick={() => setSelectedSeedId(1)}
              >
                🥕 Carrot (Free)
              </button>
              <button
                className={`btn btn-outline ${selectedSeedId === 2 ? "selected" : ""}`}
                onClick={() => setSelectedSeedId(2)}
              >
                🥬 Lettuce (Free)
              </button>
              <button
                className={`btn btn-outline ${selectedSeedId === 3 ? "selected" : ""}`}
                onClick={() => setSelectedSeedId(3)}
              >
                🍅 Tomato (5 coins)
              </button>
              <button
                className={`btn btn-outline ${selectedSeedId === 4 ? "selected" : ""}`}
                onClick={() => setSelectedSeedId(4)}
              >
                🎃 Pumpkin (10 coins)
              </button>
            </div>

            <div className="flex">
              <button
                className="btn"
                onClick={handlePlantSeed}
                disabled={!selectedSeedId || isPlanting}
              >
                {isPlanting ? "Planting..." : "Plant Seed"}
              </button>
              <button
                className="btn btn-text"
                onClick={() => {
                  setSelectedSquare(null);
                  setSelectedSeedId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlotGrid;