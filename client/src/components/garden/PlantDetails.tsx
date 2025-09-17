/**
 * PlantDetails component
 * Displays details about a specific plant and allows harvesting
 */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import { PageContainer } from "@/components";
import { GrowthTimer } from "./GrowthTimer";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage } from "@/utils";
import { formatCurrency } from "@/utils/garden";

// types
interface PlantDetailsType {
  id: string;
  plotId: number;
  seedId: string;
  seedName: string;
  imageUrl: string;
  growthTime: number; // in seconds
  growthLevel: number;
  growthPercentage: number;
  dateDropped: string;
  isReadyForHarvest: boolean;
  canHarvest: boolean;
  isOwner: boolean;
}

interface CoinReward {
  coinsEarned: number;
  totalCoinsEarned: number;
  coinsAvailable: number;
}

export const PlantDetails = () => {
  // Access global state and dispatch
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  const [plant, setPlant] = useState<PlantDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [harvestResult, setHarvestResult] = useState<CoinReward | null>(null);

  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();

  // Fetch plant details
  useEffect(() => {
    const fetchPlantDetails = async () => {
      if (!plantId) return;

      try {
        setIsLoading(true);
        const response = await backendAPI.get(`/garden/plants/${plantId}`);

        if (response.data) {
          setPlant(response.data);
        }
      } catch (err) {
        setErrorMessage(dispatch, err as ErrorType);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasInteractiveParams) {
      fetchPlantDetails();

      // Set up polling to refresh growth status every 30 seconds
      const interval = setInterval(fetchPlantDetails, 30000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
    }
  }, [plantId, dispatch, hasInteractiveParams]);

  // Handle harvesting a plant
  const handleHarvestPlant = async () => {
    if (!plantId || !plant || !plant.canHarvest) return;

    try {
      setIsHarvesting(true);
      const response = await backendAPI.post(`/garden/plants/${plantId}/harvest`);

      if (response.data) {
        setHarvestResult(response.data);
      }
    } catch (err) {
      setErrorMessage(dispatch, err as ErrorType);
    } finally {
      setIsHarvesting(false);
    }
  };

  // Handle going back to the garden
  const handleBackToGarden = () => {
    navigate("/garden/plots");
  };

  if (!plantId || (!isLoading && !plant)) {
    return (
      <PageContainer headerText="Plant Details" isLoading={false}>
        <div className="container">
          <div className="card card-error">
            <div className="card-details">
              <p className="p2">Plant not found. Please go back and try again.</p>
              <div className="actions mt-4">
                <button className="btn" onClick={handleBackToGarden}>
                  Back to Garden
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Show harvest result screen
  if (harvestResult) {
    return (
      <PageContainer headerText="Harvest Successful!" isLoading={false}>
        <div className="container">
          <div className="card card-success">
            <div className="card-details">
              <h2 className="card-title h2">Harvest Successful!</h2>

              <div className="card-media">
                <img
                  src="https://storage.googleapis.com/topia-world-assets/garden-game/harvest_success.png"
                  alt="Harvest"
                  className="media-img"
                />
              </div>

              <p className="p2">You harvested your {plant?.seedName} and earned:</p>

              <div className="media-group">
                <img
                  src="https://storage.googleapis.com/topia-world-assets/garden-game/coin_icon.png"
                  alt="Coins"
                  className="icon-md"
                />
                <span className="h3 text-highlight">{formatCurrency(harvestResult.coinsEarned)} Coins</span>
              </div>

              <div className="text-muted">
                <p className="p3">Total Coins Earned: {formatCurrency(harvestResult.totalCoinsEarned)}</p>
                <p className="p3">Available Coins: {formatCurrency(harvestResult.coinsAvailable)}</p>
              </div>

              <div className="actions mt-4">
                <button className="btn" onClick={handleBackToGarden}>
                  Back to Garden
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer headerText={plant?.seedName ? `${plant.seedName} Plant` : "Plant Details"} isLoading={isLoading}>
      {plant && (
        <div className="container">
          <div className="nav-actions">
            <button className="btn btn-secondary" onClick={handleBackToGarden}>
              Back to Garden
            </button>
            <span className="text-muted p3">Plot {plant.plotId + 1}</span>
          </div>

          <div className="card">
            <div className="card-details">
              <div className="card-media">
                <img src={plant.imageUrl} alt={plant.seedName} className="media-img" />
              </div>

              <h2 className="card-title h2">{plant.seedName}</h2>

              <GrowthTimer
                currentLevel={plant.growthLevel}
                dateDropped={new Date(plant.dateDropped)}
                growthTime={plant.growthTime}
              />

              <div className="info-group">
                <span className="p2">Status: </span>
                {plant.isReadyForHarvest ? (
                  <span className="p2 text-success">Ready to harvest!</span>
                ) : (
                  <span className="p2 text-highlight">Growing</span>
                )}
              </div>

              <div className="info-group">
                <span className="p2">Planted on: </span>
                <span className="p2">
                  {new Date(plant.dateDropped).toLocaleDateString()} at{" "}
                  {new Date(plant.dateDropped).toLocaleTimeString()}
                </span>
              </div>

              {plant.canHarvest && (
                <div className="actions mt-4">
                  <button className="btn btn-primary" onClick={handleHarvestPlant} disabled={isHarvesting}>
                    {isHarvesting ? "Harvesting..." : "Harvest Plant"}
                  </button>
                </div>
              )}

              {!plant.isOwner && <p className="p3 text-muted mt-4">This plant belongs to another player.</p>}
            </div>
          </div>

          <div className="card card-info mt-4">
            <div className="card-details">
              <h3 className="h3">About {plant.seedName} Plants:</h3>
              <p className="p2">
                {plant.seedName} plants grow over time and can be harvested when fully grown. Remember to check back on
                your plants regularly!
              </p>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
