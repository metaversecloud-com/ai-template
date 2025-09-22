import { useContext, useState } from "react";

// context
import { GlobalDispatchContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

// types
import { VisitorDataObject } from "@shared/types/VisitorData";
import { SEED_CONFIGS } from "@shared/types/SeedConfig";

interface SeedMenuProps {
  gameState: VisitorDataObject;
  onClose: () => void;
}

export const SeedMenu = ({ gameState, onClose }: SeedMenuProps) => {
  const dispatch = useContext(GlobalDispatchContext);
  const [purchasingSeeds, setPurchasingSeeds] = useState<Set<number>>(new Set());

  const handlePurchaseSeed = async (seedId: number) => {
    setPurchasingSeeds((prev) => new Set([...prev, seedId]));
    await backendAPI
      .post("/seed/purchase", { seedId })
      .then((response) => {
        setGameState(dispatch, response.data);
      })
      .catch((error) => setErrorMessage(dispatch, error as ErrorType))
      .finally(() => {
        setPurchasingSeeds((prev) => {
          const updated = new Set(prev);
          updated.delete(seedId);
          return updated;
        });
      });
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
          <div className="card-details">
            <h4 className="card-title">💰 {gameState.coinsAvailable} Coins Available</h4>
            <p className="p3">Total Earned: {gameState.totalCoinsEarned}</p>
          </div>
        </div>

        <div className="grid gap-2">
          {Object.values(SEED_CONFIGS).map((seed) => {
            const purchased = isPurchased(seed.id);
            const affordable = canAfford(seed.cost);
            const free = isFree(seed.cost);
            const isPurchasing = purchasingSeeds.has(seed.id);

            return (
              <div key={seed.id} className={`card ${!affordable && !free && !purchased ? "opacity-50" : ""}`}>
                <div className="card-details text-center">
                  <h4 className="card-title flex justify-center">
                    <img className="mr-2" src={seed.icon} />
                    {seed.name}
                  </h4>
                  <div className="flex justify-center mt-2">
                    <div className="flex-col mr-2">
                      <p className="p3">Cost: {seed.cost === 0 ? "Free" : `${seed.cost} coins`}</p>
                      <p className="p3">Reward: {seed.reward} coins</p>
                    </div>
                    <div className="flex-col">
                      <p className="p3">Growth: {formatTime(seed.growthTime)}</p>
                      <p className="p3">Profit: +{seed.reward - seed.cost} coins</p>
                    </div>
                  </div>

                  <div className="card-actions justify-center">
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
