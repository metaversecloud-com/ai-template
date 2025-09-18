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

interface SeedMenuProps {
  gameState: any;
  onClose: () => void;
  onStateUpdate: () => void;
}

const SEED_CONFIGS: SeedConfig[] = [
  { id: 1, name: "Carrot", cost: 0, reward: 2, growthTime: 60, icon: "🥕" },
  { id: 2, name: "Lettuce", cost: 0, reward: 3, growthTime: 90, icon: "🥬" },
  { id: 3, name: "Tomato", cost: 5, reward: 8, growthTime: 120, icon: "🍅" },
  { id: 4, name: "Pumpkin", cost: 10, reward: 25, growthTime: 300, icon: "🎃" },
];

export const SeedMenu = ({ gameState, onClose, onStateUpdate }: SeedMenuProps) => {
  const dispatch = useContext(GlobalDispatchContext);
  const [purchasingSeeds, setPurchasingSeeds] = useState<Set<number>>(new Set());

  const handlePurchaseSeed = async (seedId: number) => {
    try {
      setPurchasingSeeds(prev => new Set([...prev, seedId]));

      await backendAPI.post("/seed/purchase", { seedId });

      // Update parent state
      onStateUpdate();
    } catch (error) {
      setErrorMessage(dispatch, error as ErrorType);
    } finally {
      setPurchasingSeeds(prev => {
        const updated = new Set(prev);
        updated.delete(seedId);
        return updated;
      });
    }
  };

  const canAfford = (cost: number) => gameState.coinsAvailable >= cost;
  const isPurchased = (seedId: number) => gameState.seedsPurchased[seedId] || false;
  const isFree = (cost: number) => cost === 0;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2 className="h2">🌱 Seed Menu</h2>

        <div className="card small">
          <div className="card-details text-center">
            <h3 className="card-title">💰 {gameState.coinsAvailable} Coins Available</h3>
            <p className="p3">Total Earned: {gameState.totalCoinsEarned}</p>
          </div>
        </div>

        <div className="flex-col">
          {SEED_CONFIGS.map((seed) => {
            const purchased = isPurchased(seed.id);
            const affordable = canAfford(seed.cost);
            const free = isFree(seed.cost);
            const isPurchasing = purchasingSeeds.has(seed.id);

            return (
              <div key={seed.id} className={`card ${!affordable && !free && !purchased ? "opacity-50" : ""}`}>
                <div className="card-details">
                  <div className="flex items-center">
                    <div style={{ fontSize: "2rem", marginRight: "1rem" }}>
                      {seed.icon}
                    </div>
                    <div className="flex-col" style={{ flex: 1 }}>
                      <h3 className="card-title">{seed.name}</h3>
                      <div className="flex">
                        <div className="flex-col" style={{ marginRight: "1rem" }}>
                          <p className="p3">
                            Cost: {seed.cost === 0 ? "Free" : `${seed.cost} coins`}
                          </p>
                          <p className="p3">
                            Reward: {seed.reward} coins
                          </p>
                        </div>
                        <div className="flex-col">
                          <p className="p3">
                            Growth: {formatTime(seed.growthTime)}
                          </p>
                          <p className="p3">
                            Profit: +{seed.reward - seed.cost} coins
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    {free ? (
                      <span className="p3 text-success">✓ Available</span>
                    ) : purchased ? (
                      <span className="p3 text-success">✓ Purchased</span>
                    ) : affordable ? (
                      <button
                        className="btn btn-outline"
                        onClick={() => handlePurchaseSeed(seed.id)}
                        disabled={isPurchasing}
                      >
                        {isPurchasing ? "Purchasing..." : `Buy ${seed.cost} coins`}
                      </button>
                    ) : (
                      <span className="p3 text-muted">Need {seed.cost - gameState.coinsAvailable} more coins</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="actions">
          <button className="btn" onClick={onClose}>
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeedMenu;