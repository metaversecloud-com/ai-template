import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSeedMenu, purchaseSeed, plantSeed } from "../../utils/gardenAPI";
import { Seed } from "../../types/gardenTypes";
import { PageContainer } from "../PageContainer";

/**
 * SeedMenu component displays available seeds for planting
 */
const SeedMenu: React.FC = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [coinsAvailable, setCoinsAvailable] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get plotId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const plotId = Number(queryParams.get("plotId"));

  // Fetch available seeds
  useEffect(() => {
    const fetchSeeds = async () => {
      try {
        setLoading(true);
        const response = await getSeedMenu();

        if (response.success && response.data) {
          setSeeds(response.data.seeds);
          setCoinsAvailable(response.data.coinsAvailable);
        } else {
          setError(response.error || "Failed to load seeds");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeeds();
  }, []);

  // Handle selecting a seed
  const handleSelectSeed = (seedId: number) => {
    setSelectedSeed(seedId === selectedSeed ? null : seedId);
  };

  // Handle purchasing and planting a seed
  const handlePlantSeed = async () => {
    if (selectedSeed === null) {
      setError("Please select a seed first");
      return;
    }

    try {
      setProcessing(true);

      // Get the selected seed
      const seed = seeds.find((s) => s.id === selectedSeed);

      if (!seed) {
        setError("Invalid seed selected");
        return;
      }

      // Check if we need to purchase the seed
      if (seed.cost > 0) {
        const purchaseResponse = await purchaseSeed(selectedSeed);

        if (!purchaseResponse.success) {
          setError(purchaseResponse.error || "Failed to purchase seed");
          return;
        }

        // Update available coins
        if (purchaseResponse.data) {
          setCoinsAvailable(purchaseResponse.data.coinsAvailable);
        }
      }

      // Plant the seed
      const plantResponse = await plantSeed(selectedSeed, plotId);

      if (plantResponse.success && plantResponse.data) {
        // Navigate to the plant details page
        navigate(`/garden/plant/${plantResponse.data.plantId}`);
      } else {
        setError(plantResponse.error || "Failed to plant seed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // Handle going back to the garden
  const handleBackToGarden = () => {
    navigate("/garden/plots");
  };

  if (loading) {
    return (
      <PageContainer headerText="Seed Menu" isLoading={true}>
        <></>
      </PageContainer>
    );
  }

  if (isNaN(plotId)) {
    return (
      <PageContainer headerText="Seed Menu" isLoading={false}>
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <p>Invalid plot selected. Please go back and try again.</p>
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

  return (
    <PageContainer headerText="Seed Menu" isLoading={false}>
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

          <div className="bg-amber-100 px-4 py-2 rounded-md flex items-center">
            <img
              src="https://storage.googleapis.com/topia-world-assets/garden-game/coin_icon.png"
              alt="Coins"
              className="w-6 h-6 mr-2"
            />
            <span className="font-medium text-amber-800">{coinsAvailable} Coins</span>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg mb-6">
          <p className="text-green-800">
            Select a seed to plant in Plot {plotId + 1}. Some seeds cost coins to purchase.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {seeds.map((seed) => {
            const isSelected = selectedSeed === seed.id;
            const canAfford = seed.cost <= coinsAvailable;
            const seedClass = `p-4 border-2 rounded-lg cursor-pointer transition-all ${
              isSelected ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
            } ${!canAfford && seed.cost > 0 ? "opacity-50 cursor-not-allowed" : ""}`;

            return (
              <div key={`seed-${seed.id}`} className={seedClass} onClick={() => canAfford && handleSelectSeed(seed.id)}>
                <div className="flex flex-col items-center">
                  <img src={seed.imageUrl} alt={seed.name} className="w-20 h-20 object-contain mb-2" />
                  <h3 className="font-medium text-lg">{seed.name}</h3>

                  <div className="mt-2 flex items-center">
                    {seed.cost > 0 ? (
                      <>
                        <img
                          src="https://storage.googleapis.com/topia-world-assets/garden-game/coin_icon.png"
                          alt="Cost"
                          className="w-4 h-4 mr-1"
                        />
                        <span className={`text-sm ${canAfford ? "text-amber-700" : "text-red-600"}`}>
                          {seed.cost} coins
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-green-600">Free</span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center">
                    <img
                      src="https://storage.googleapis.com/topia-world-assets/garden-game/reward_icon.png"
                      alt="Reward"
                      className="w-4 h-4 mr-1"
                    />
                    <span className="text-sm text-green-700">{seed.reward} coin reward</span>
                  </div>

                  <div className="mt-1 text-xs text-gray-600">
                    Grows in {Math.round(seed.growthTimeSeconds / 60)} minutes
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handlePlantSeed}
            disabled={selectedSeed === null || processing}
            className={`px-6 py-3 rounded-md text-white font-semibold ${
              selectedSeed === null ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {processing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Plant Selected Seed"
            )}
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default SeedMenu;
