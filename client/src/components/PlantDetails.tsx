import { useContext, useState } from "react";

// context
import { GlobalDispatchContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage } from "@/utils";

interface SeedConfig {
  id: number;
  name: string;
  cost: number;
  reward: number;
  growthTime: number;
  icon: string;
}

const SEED_CONFIGS: { [key: number]: SeedConfig } = {
  1: { id: 1, name: "Carrot", cost: 0, reward: 2, growthTime: 60, icon: "🥕" },
  2: { id: 2, name: "Lettuce", cost: 0, reward: 3, growthTime: 90, icon: "🥬" },
  3: { id: 3, name: "Tomato", cost: 5, reward: 8, growthTime: 120, icon: "🍅" },
  4: { id: 4, name: "Pumpkin", cost: 10, reward: 25, growthTime: 300, icon: "🎃" },
};

interface PlantDetailsProps {
  plant: {
    dateDropped: string;
    seedId: number;
    growLevel: number;
    squareIndex: number;
    wasHarvested: boolean;
  };
  plantAssetId?: string;
  isReadOnly: boolean;
  onStateUpdate?: () => void;
}

export const PlantDetails = ({ plant, plantAssetId, isReadOnly, onStateUpdate }: PlantDetailsProps) => {
  const dispatch = useContext(GlobalDispatchContext);
  const [isHarvesting, setIsHarvesting] = useState(false);

  const seedConfig = SEED_CONFIGS[plant.seedId];
  if (!seedConfig) {
    return (
      <div className="card danger">
        <div className="card-details">
          <p className="p2">Unknown plant type</p>
        </div>
      </div>
    );
  }

  const handleHarvest = async () => {
    if (!plantAssetId) return;

    try {
      setIsHarvesting(true);
      const response = await backendAPI.post("/plant/harvest", {
        droppedAssetId: plantAssetId,
      });

      // Show success message
      if (response.data.success) {
        console.log(`Harvested! Earned ${response.data.data.coinsEarned} coins`);
      }

      onStateUpdate?.();
    } catch (error) {
      setErrorMessage(dispatch, error as ErrorType);
    } finally {
      setIsHarvesting(false);
    }
  };

  const calculateTimeRemaining = () => {
    const plantedTime = new Date(plant.dateDropped).getTime();
    const currentTime = new Date().getTime();
    const elapsedSeconds = (currentTime - plantedTime) / 1000;
    const totalGrowthTime = seedConfig.growthTime;
    const timePerLevel = totalGrowthTime / 10;
    const timeForNextLevel = (plant.growLevel + 1) * timePerLevel;
    const remainingSeconds = Math.max(0, timeForNextLevel - elapsedSeconds);

    if (remainingSeconds === 0 || plant.growLevel >= 10) {
      return null;
    }

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

  const getGrowthStatus = () => {
    if (plant.wasHarvested) return "Harvested";
    if (plant.growLevel >= 10) return "Ready for Harvest!";
    return `Growing... (Level ${plant.growLevel}/10)`;
  };

  const getGrowthColor = () => {
    if (plant.wasHarvested) return "text-muted";
    if (plant.growLevel >= 10) return "text-success";
    return "text-muted";
  };

  const timeRemaining = calculateTimeRemaining();

  return (
    <div className="flex-col">
      <div className="card">
        <div className="card-details">
          <div className="flex items-center">
            <div style={{ fontSize: "3rem", marginRight: "1rem" }}>
              {seedConfig.icon}
            </div>
            <div className="flex-col">
              <h3 className="card-title">{seedConfig.name} Plant</h3>
              <p className={`p2 ${getGrowthColor()}`}>{getGrowthStatus()}</p>
            </div>
          </div>

          <div className="flex-col">
            <div className="card small">
              <div className="card-details">
                <h4 className="h4">Growth Progress</h4>
                <div className="flex">
                  <div className="flex-col" style={{ marginRight: "1rem" }}>
                    <p className="p3">Level: {plant.growLevel}/10</p>
                    <p className="p3">
                      Planted: {new Date(plant.dateDropped).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-col">
                    {timeRemaining && (
                      <p className="p3">Next level: {timeRemaining}</p>
                    )}
                    <p className="p3">
                      Plot Square: {plant.squareIndex + 1}/16
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card small">
              <div className="card-details">
                <h4 className="h4">Seed Info</h4>
                <div className="flex">
                  <div className="flex-col" style={{ marginRight: "1rem" }}>
                    <p className="p3">
                      Cost: {seedConfig.cost === 0 ? "Free" : `${seedConfig.cost} coins`}
                    </p>
                    <p className="p3">Growth Time: {Math.floor(seedConfig.growthTime / 60)}m</p>
                  </div>
                  <div className="flex-col">
                    <p className="p3">Reward: {seedConfig.reward} coins</p>
                    <p className="p3">
                      Profit: +{seedConfig.reward - seedConfig.cost} coins
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Harvest button for current user */}
          {!isReadOnly && !plant.wasHarvested && plant.growLevel >= 10 && (
            <div className="actions">
              <button
                className="btn"
                onClick={handleHarvest}
                disabled={isHarvesting}
              >
                {isHarvesting ? "Harvesting..." : `🌾 Harvest (+${seedConfig.reward} coins)`}
              </button>
            </div>
          )}

          {/* Already harvested */}
          {plant.wasHarvested && (
            <div className="card success">
              <div className="card-details">
                <p className="p2 text-center">✅ Plant has been harvested!</p>
                <p className="p3 text-center">Earned {seedConfig.reward} coins</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;