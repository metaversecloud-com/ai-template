import { useContext, useState } from "react";
import { GlobalStateContext } from "@/context/GlobalContext";
import SeedPicker from "./SeedPicker";

interface GardenControlsProps {
  onRefresh: () => void;
  onRemoveAll?: () => void;
}

const GardenControls = ({ onRefresh, onRemoveAll }: GardenControlsProps) => {
  const { gardenState, isAdmin } = useContext(GlobalStateContext);
  const [showSeedPicker, setShowSeedPicker] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <button
            onClick={() => setShowSeedPicker(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Plant a Seed
          </button>

          <button onClick={onRefresh} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-2">
            Refresh Garden
          </button>
        </div>

        {isAdmin && (
          <div>
            <button onClick={onRemoveAll} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
              Remove All Plants
            </button>
          </div>
        )}
      </div>

      {/* Garden Stats */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Your Coins</h3>
            <p className="text-2xl font-bold">{gardenState?.visitorData.coins || 0} 🪙</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Unlocked Seeds</h3>
            <p className="text-2xl font-bold">{gardenState?.visitorData.unlockedSeeds.length || 0} 🌱</p>
          </div>
        </div>
      </div>

      {/* Seed Picker Modal */}
      {showSeedPicker && <SeedPicker onClose={() => setShowSeedPicker(false)} />}
    </div>
  );
};

export default GardenControls;
