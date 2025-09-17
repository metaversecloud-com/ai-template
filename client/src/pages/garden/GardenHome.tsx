/**
 * GardenHome component
 * Main home page for the gardening game showing instructions and stats
 */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import { PageContainer } from "@/components";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { fetchGameState } from "@/utils/garden/gardenAPI";
import { setErrorMessage } from "@/utils/setErrorMessage";
import { setGameState } from "@/utils/setGameState";

export const GardenHome = () => {
  // Access global state and dispatch
  const dispatch = useContext(GlobalDispatchContext);
  const state = useContext(GlobalStateContext);
  const { coinsAvailable, totalCoinsEarned, plants } = state;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load game state when component mounts
    const loadGameState = async () => {
      try {
        if (!state.hasInteractiveParams) {
          setIsLoading(false);
          return;
        }

        const response = await fetchGameState();

        if (response.success) {
          setGameState(dispatch, response.data);
        }
      } catch (error) {
        setErrorMessage(dispatch, error as ErrorType);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, [dispatch, state.hasInteractiveParams]);

  // Count active plants (not harvested)
  const activePlantsCount = plants ? Object.values(plants).filter((p) => !p.wasHarvested).length : 0;

  return (
    <PageContainer isLoading={isLoading} headerText="Garden Game">
      <div className="container">
        <div className="card mb-6">
          <div className="card-details">
            <h2 className="card-title h2">How to Play</h2>
            <p className="p2 mb-4">
              Welcome to the Garden Game! Grow plants, harvest crops, and earn rewards in this relaxing gardening
              simulator.
            </p>

            <div className="mb-4">
              <h3 className="h3 mb-2">Getting Started</h3>
              <ol className="list-decimal pl-5 mb-4">
                <li className="p2 mb-2">Claim a plot of land for your garden</li>
                <li className="p2 mb-2">Choose seeds to plant from the seed menu</li>
                <li className="p2 mb-2">Wait for your plants to grow over time</li>
                <li className="p2 mb-2">Harvest fully grown plants to earn coins</li>
                <li className="p2">Use coins to unlock new seed types</li>
              </ol>
            </div>

            <div className="actions">
              <button className="btn" onClick={() => navigate("/garden/plots")}>
                View Plots
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/garden/seeds")}>
                Seed Menu
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-details">
            <h2 className="card-title h2">Your Stats</h2>
            <div className="flex justify-between mb-4">
              <div>
                <p className="p2 text-muted">Available Coins</p>
                <p className="h3">{coinsAvailable || 0}</p>
              </div>
              <div>
                <p className="p2 text-muted">Total Earned</p>
                <p className="h3">{totalCoinsEarned || 0}</p>
              </div>
              <div>
                <p className="p2 text-muted">Plants Growing</p>
                <p className="h3">{activePlantsCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default GardenHome;
