import { useContext, useState } from "react";
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { SeedInterface } from "@/utils/types";
import { setSelectedSeed, setPlantingMode } from "@/utils/setGardenState";
import { purchaseSeed } from "@/utils/gardenAPI";
import { ErrorType } from "@/context/types";
import { setErrorMessage } from "@/utils/setErrorMessage";

interface SeedPickerProps {
  onClose: () => void;
}

const SeedPicker = ({ onClose }: SeedPickerProps) => {
  const dispatch = useContext(GlobalDispatchContext);
  const { gardenState } = useContext(GlobalStateContext);
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!gardenState) return null;

  const { availableSeeds, visitorData } = gardenState;

  // Helper to check if a seed is unlocked
  const isSeedUnlocked = (seed: SeedInterface) => {
    return !seed.isPremium || visitorData.unlockedSeeds.includes(seed.type);
  };

  // Handle seed selection
  const handleSelectSeed = (seed: SeedInterface) => {
    if (isSeedUnlocked(seed)) {
      setSelectedSeed(dispatch, seed.type);
      setPlantingMode(dispatch, true);
      onClose();
    }
  };

  // Handle seed purchase
  const handlePurchaseSeed = async (seed: SeedInterface) => {
    if (isPurchasing) return;
    if (visitorData.coins < seed.cost) {
      setErrorMessage(dispatch, `Not enough coins! You need ${seed.cost} coins to purchase this seed.`);
      return;
    }

    setIsPurchasing(true);
    try {
      await purchaseSeed(seed.type);
      // We'll update the garden state via the game state API
      setErrorMessage(dispatch, `Successfully purchased ${seed.name} seed!`);
    } catch (error) {
      setErrorMessage(dispatch, error as ErrorType);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select a Seed</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {availableSeeds.map((seed) => (
            <div
              key={seed.type}
              className={`border rounded-lg p-3 ${
                isSeedUnlocked(seed)
                  ? "border-green-500 cursor-pointer hover:bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex justify-center mb-2">
                <img src={seed.imageUrl} alt={seed.name} className="h-16 w-16 object-contain" />
              </div>
              <div className="text-center">
                <h3 className="font-bold">{seed.name}</h3>
                <p className="text-sm text-gray-600">{seed.description}</p>
                <div className="mt-2">
                  {isSeedUnlocked(seed) ? (
                    <button
                      onClick={() => handleSelectSeed(seed)}
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Select
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchaseSeed(seed)}
                      disabled={isPurchasing || visitorData.coins < seed.cost}
                      className={`px-3 py-1 rounded-full text-sm ${
                        visitorData.coins < seed.cost
                          ? "bg-gray-300 text-gray-500"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isPurchasing ? "Buying..." : `Buy ${seed.cost} 🪙`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">Your Coins: {visitorData.coins} 🪙</div>
      </div>
    </div>
  );
};

export default SeedPicker;
