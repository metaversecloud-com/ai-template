import { useContext, useEffect, useState } from "react";
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { plantSeed, harvestPlant, updateGrowthLevels } from "@/utils/gardenAPI";
import { updateGardenState, setSelectedSeed, setPlantingMode } from "@/utils/setGardenState";
import { getGameState } from "@/utils/gardenAPI";
import { setErrorMessage } from "@/utils/setErrorMessage";
import { ErrorType } from "@/context/types";
import { PlantInterface } from "@/utils/types";

const GardenView = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { gardenState, selectedSeed, plantingMode } = useContext(GlobalStateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);

  // Fetch garden state on mount and periodically update growth
  useEffect(() => {
    // Initial fetch
    fetchGardenState();

    // Set up interval to check for plant growth updates
    const growthInterval = setInterval(() => {
      handleUpdateGrowth();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(growthInterval);
  }, []);

  // Fetch garden state from API
  const fetchGardenState = async () => {
    setIsLoading(true);
    try {
      const response = await getGameState();
      if (response.success) {
        updateGardenState(dispatch!, response);
      }
    } catch (error) {
      setErrorMessage(dispatch!, error as ErrorType);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle planting a seed
  const handlePlant = async (x: number, y: number) => {
    if (!selectedSeed || !plantingMode) return;

    try {
      await plantSeed(selectedSeed, { x, y });
      // Refresh garden state
      await fetchGardenState();
      // Reset planting mode
      setPlantingMode(dispatch!, false);
      setSelectedSeed(dispatch!, null);
    } catch (error) {
      setErrorMessage(dispatch!, error as ErrorType);
    }
  };

  // Handle harvesting a plant
  const handleHarvest = async (plantId: string) => {
    if (isHarvesting) return;
    setIsHarvesting(true);

    try {
      await harvestPlant(plantId);
      // Refresh garden state
      await fetchGardenState();
    } catch (error) {
      setErrorMessage(dispatch!, error as ErrorType);
    } finally {
      setIsHarvesting(false);
    }
  };

  // Handle growth updates
  const handleUpdateGrowth = async () => {
    try {
      const response = await updateGrowthLevels();
      if (response.success && response.updatedPlants.length > 0) {
        // Plants were updated, refresh the garden state
        await fetchGardenState();
      }
    } catch (error) {
      console.error("Error updating growth:", error);
      // Don't show errors to the user for automatic updates
    }
  };

  // Cancel planting mode
  const handleCancelPlanting = () => {
    setPlantingMode(dispatch!, false);
    setSelectedSeed(dispatch!, null);
  };

  // Render a single plant
  const renderPlant = (plant: PlantInterface) => {
    const { id, seedType, growLevel, position, wasHarvested } = plant;

    // Skip rendering harvested plants
    if (wasHarvested) return null;

    // Find the seed info
    const seedInfo = gardenState?.availableSeeds.find((seed) => seed.type === seedType);
    if (!seedInfo) return null;

    // Determine if plant is ready to harvest (growLevel 10 is fully grown)
    const isReadyToHarvest = growLevel >= 10;

    return (
      <div
        key={id}
        className={`absolute ${isReadyToHarvest ? "animate-pulse" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`w-16 h-16 flex items-center justify-center cursor-pointer
            ${isReadyToHarvest ? "hover:scale-110 transition-transform" : ""}`}
          onClick={() => (isReadyToHarvest ? handleHarvest(id) : null)}
        >
          <img
            src={seedInfo.imageUrl}
            alt={seedInfo.name}
            className="w-full h-full object-contain"
            style={{
              filter: `brightness(${0.5 + growLevel * 0.05})`, // Brighten as it grows
              transform: `scale(${0.4 + growLevel * 0.06})`, // Grow in size
            }}
          />
          {!isReadyToHarvest && (
            <div className="absolute bottom-0 w-full">
              <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${growLevel * 10}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading || !gardenState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="relative border-2 border-brown-600 bg-amber-100 h-[500px] w-full overflow-hidden">
      {/* Garden Background */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="border border-amber-200"></div>
        ))}
      </div>

      {/* Plants */}
      {gardenState.plants && Object.values(gardenState.plants).map(renderPlant)}

      {/* Planting overlay */}
      {plantingMode && (
        <div
          className="absolute inset-0 bg-green-500 bg-opacity-10 cursor-crosshair"
          onClick={(e) => {
            // Get click coordinates relative to the garden
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handlePlant(x, y);
          }}
        >
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              handleCancelPlanting();
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Garden Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 flex justify-between items-center">
        <div>
          <span className="font-bold">Coins: {gardenState.visitorData.coins} 🪙</span>
        </div>
        <div>
          <span className="text-sm">High Score: {gardenState.worldData.highScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GardenView;
