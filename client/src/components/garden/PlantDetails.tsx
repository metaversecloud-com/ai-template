import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlantDetails, harvestPlant } from "../../utils/gardenAPI";
import { PlantDetails as PlantDetailsType, CoinReward } from "../../types/gardenTypes";
import { PageContainer } from "../PageContainer";

/**
 * PlantDetails component displays details about a specific plant
 */
const PlantDetails: React.FC = () => {
  const [plant, setPlant] = useState<PlantDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [harvesting, setHarvesting] = useState<boolean>(false);
  const [harvestResult, setHarvestResult] = useState<CoinReward | null>(null);
  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();

  // Fetch plant details
  useEffect(() => {
    const fetchPlantDetails = async () => {
      if (!plantId) return;

      try {
        setLoading(true);
        const response = await getPlantDetails(plantId);

        if (response.success && response.data) {
          setPlant(response.data);
        } else {
          setError(response.error || "Failed to load plant details");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();

    // Set up polling to refresh growth status every 30 seconds
    const interval = setInterval(fetchPlantDetails, 30000);

    return () => clearInterval(interval);
  }, [plantId]);

  // Handle harvesting a plant
  const handleHarvestPlant = async () => {
    if (!plantId || !plant || !plant.canHarvest) return;

    try {
      setHarvesting(true);
      const response = await harvestPlant(plantId);

      if (response.success && response.data) {
        setHarvestResult(response.data);
      } else {
        setError(response.error || "Failed to harvest plant");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setHarvesting(false);
    }
  };

  // Handle going back to the garden
  const handleBackToGarden = () => {
    navigate("/garden/plots");
  };

  if (loading) {
    return (
      <PageContainer headerText="Plant Details" isLoading={true}>
        <></>
      </PageContainer>
    );
  }

  if (!plantId || !plant) {
    return (
      <PageContainer headerText="Plant Details" isLoading={false}>
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <p>Plant not found. Please go back and try again.</p>
        </div>
        <button
          onClick={handleBackToGarden}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Garden
        </button>
      </PageContainer>
    );
  }

  // Show harvest result screen
  if (harvestResult) {
    return (
      <PageContainer headerText="Harvest Successful!" isLoading={false}>
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-green-100 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Harvest Successful!</h2>

            <div className="flex justify-center mb-4">
              <img
                src="https://storage.googleapis.com/topia-world-assets/garden-game/harvest_success.png"
                alt="Harvest"
                className="w-32 h-32 object-contain"
              />
            </div>

            <p className="text-green-700 mb-4">You harvested your {plant.seedName} and earned:</p>

            <div className="flex justify-center items-center mb-6">
              <img
                src="https://storage.googleapis.com/topia-world-assets/garden-game/coin_icon.png"
                alt="Coins"
                className="w-8 h-8 mr-2"
              />
              <span className="text-2xl font-bold text-amber-600">{harvestResult.coinsEarned} Coins</span>
            </div>

            <div className="text-gray-600 text-sm">
              <p>Total Coins Earned: {harvestResult.totalCoinsEarned}</p>
              <p>Available Coins: {harvestResult.coinsAvailable}</p>
            </div>
          </div>

          <button
            onClick={handleBackToGarden}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Back to Garden
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer headerText={`${plant.seedName} Plant`} isLoading={false}>
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm">
              Dismiss
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackToGarden}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Garden
          </button>

          <div className="text-sm text-gray-600">Plot {plant.plotId + 1}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
            <img src={plant.imageUrl} alt={plant.seedName} className="w-40 h-40 object-contain" />
          </div>

          <div className="md:w-2/3 md:pl-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">{plant.seedName}</h2>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Growth Progress:</div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-600 rounded-full h-4" style={{ width: `${plant.growthPercentage}%` }}></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{plant.growthPercentage}% complete</div>
            </div>

            <div className="mb-2">
              <span className="text-gray-700">Status: </span>
              {plant.isReadyForHarvest ? (
                <span className="text-green-600 font-medium">Ready to harvest!</span>
              ) : (
                <span className="text-amber-600 font-medium">Growing</span>
              )}
            </div>

            <div className="mb-2">
              <span className="text-gray-700">Planted on: </span>
              <span className="text-gray-900">
                {new Date(plant.dateDropped).toLocaleDateString()} at {new Date(plant.dateDropped).toLocaleTimeString()}
              </span>
            </div>

            {plant.canHarvest && (
              <button
                onClick={handleHarvestPlant}
                disabled={harvesting}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {harvesting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Harvesting...</span>
                  </div>
                ) : (
                  "Harvest Plant"
                )}
              </button>
            )}

            {!plant.isOwner && <div className="mt-4 text-gray-600 italic">This plant belongs to another player.</div>}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-blue-800">
          <h3 className="font-medium mb-2">About {plant.seedName} Plants:</h3>
          <p>
            {plant.seedName} plants grow over time and can be harvested when fully grown. Remember to check back on your
            plants regularly!
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default PlantDetails;
