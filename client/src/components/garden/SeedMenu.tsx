/**
 * SeedMenu component
 * Displays available seeds for planting in a selected plot
 */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// components
import { PageContainer } from "@/components";
import { SeedCard } from "./SeedCard";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage } from "@/utils";
import { formatCurrency } from "@/utils/garden";
import { Seed } from "@/utils/garden/seedsData";

export const SeedMenu = () => {
  // Access global state and dispatch
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [purchasedSeeds, setPurchasedSeeds] = useState<Record<number, boolean>>({});
  const [coinsAvailable, setCoinsAvailable] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSeedId, setSelectedSeedId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get plotId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const plotId = Number(queryParams.get("plotId"));

  // Fetch available seeds
  useEffect(() => {
    const fetchSeeds = async () => {
      try {
        setIsLoading(true);
        const response = await backendAPI.get("/garden/seeds");

        if (response.data) {
          setSeeds(response.data.seeds);
          setPurchasedSeeds(response.data.purchasedSeeds || {});
          setCoinsAvailable(response.data.coinsAvailable);
        }
      } catch (err) {
        setErrorMessage(dispatch, err as ErrorType);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasInteractiveParams) {
      fetchSeeds();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, hasInteractiveParams]);

  // Handle selecting a seed
  const handleSelectSeed = (seedId: number) => {
    setSelectedSeedId(seedId === selectedSeedId ? null : seedId);
  };

  // Handle purchasing a seed
  const handlePurchaseSeed = async (seedId: number) => {
    try {
      const seed = seeds.find((s) => s.id === seedId);
      if (!seed) return;

      const response = await backendAPI.post(`/garden/seeds/${seedId}/purchase`);

      if (response.data) {
        // Update purchased seeds and available coins
        setPurchasedSeeds((prev) => ({ ...prev, [seedId]: true }));
        setCoinsAvailable(response.data.coinsAvailable);
      }
    } catch (err) {
      setErrorMessage(dispatch, err as ErrorType);
    }
  };

  // Handle planting a seed
  const handlePlantSeed = async () => {
    if (selectedSeedId === null || isNaN(plotId)) return;

    try {
      setIsProcessing(true);
      const response = await backendAPI.post(`/garden/plots/${plotId}/plant`, {
        seedId: selectedSeedId,
      });

      if (response.data) {
        // Navigate to the plant details page
        navigate(`/garden/plant/${response.data.plantId}`);
      }
    } catch (err) {
      setErrorMessage(dispatch, err as ErrorType);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle going back to the garden
  const handleBackToGarden = () => {
    navigate("/garden/plots");
  };

  if (isNaN(plotId)) {
    return (
      <PageContainer headerText="Seed Menu" isLoading={false}>
        <div className="container">
          <div className="card card-error">
            <div className="card-details">
              <p className="p2">Invalid plot selected. Please go back and try again.</p>
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
    <PageContainer headerText="Seed Menu" isLoading={isLoading}>
      <div className="container">
        <div className="toolbar">
          <button className="btn btn-secondary" onClick={handleBackToGarden}>
            Back to Garden
          </button>

          <div className="coin-display">
            <img
              src="https://storage.googleapis.com/topia-world-assets/garden-game/coin_icon.png"
              alt="Coins"
              className="icon-sm"
            />
            <span className="p2 text-highlight">{formatCurrency(coinsAvailable)} Coins</span>
          </div>
        </div>

        <div className="card card-info mb-4">
          <div className="card-details">
            <p className="p2">Select a seed to plant in Plot {plotId + 1}. Some seeds cost coins to purchase.</p>
          </div>
        </div>

        <div className="grid-container">
          {seeds.map((seed) => (
            <SeedCard
              key={`seed-${seed.id}`}
              seed={seed}
              isPurchased={!!purchasedSeeds[seed.id]}
              isSelected={selectedSeedId === seed.id}
              canAfford={seed.cost <= coinsAvailable}
              onSelect={() => handleSelectSeed(seed.id)}
              onPurchase={() => handlePurchaseSeed(seed.id)}
            />
          ))}
        </div>

        <div className="actions mt-4 flex-center">
          <button
            className="btn btn-primary"
            onClick={handlePlantSeed}
            disabled={selectedSeedId === null || isProcessing}
          >
            {isProcessing ? "Planting..." : "Plant Selected Seed"}
          </button>
        </div>
      </div>
    </PageContainer>
  );
};
