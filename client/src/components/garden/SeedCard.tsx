/**
 * SeedCard component
 * Displays information about a seed for selection or purchase
 */
import { useContext } from "react";

// context
import { GlobalDispatchContext } from "@/context/GlobalContext";

// utils
import { formatCurrency } from "@/utils/garden";
import { Seed } from "@/utils/garden/seedsData";

/**
 * Props for the SeedCard component
 */
interface SeedCardProps {
  seed: Seed;
  isPurchased: boolean;
  isSelected: boolean;
  canAfford: boolean;
  onSelect: () => void;
  onPurchase: () => void;
}

export const SeedCard = ({ seed, isPurchased, isSelected, canAfford, onSelect, onPurchase }: SeedCardProps) => {
  // Access global dispatch for error handling
  const dispatch = useContext(GlobalDispatchContext);

  const { id, name, cost, reward, growthTime, imageUrl } = seed;

  const isFreeSeed = cost === 0;
  const isLocked = !isPurchased && !isFreeSeed && !canAfford;

  const handleClick = () => {
    if (!isLocked && (isPurchased || isFreeSeed)) {
      onSelect();
    }
  };

  return (
    <div className={`card small ${isSelected ? "selected" : ""} ${isLocked ? "text-muted" : ""}`} onClick={handleClick}>
      <div className="card-image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="card-details">
        <h3 className="card-title h3">{name}</h3>

        <div className="flex items-center justify-between mt-1">
          <div>
            <p className="p3 text-muted">Cost: {isFreeSeed ? "Free" : formatCurrency(cost)}</p>
            <p className="p3 text-muted">Reward: {formatCurrency(reward)}</p>
            <p className="p3 text-muted">Growth: {Math.round(growthTime / 60)}m</p>
          </div>

          <div>
            {isPurchased || isFreeSeed ? (
              <div className="badge badge-success">{isFreeSeed ? "Free" : "Owned"}</div>
            ) : (
              <button
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (canAfford) onPurchase();
                }}
                disabled={!canAfford}
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedCard;
