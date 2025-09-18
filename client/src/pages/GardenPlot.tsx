import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// components
import { PageContainer } from "@/components";
import { PlotGrid } from "@/components/PlotGrid";
import { SeedMenu } from "@/components/SeedMenu";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

export const GardenPlot = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);
  console.log("🚀 ~ GardenPlot.tsx:19 ~ gameState:", gameState);
  const { hasInteractiveParams } = gameState;
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [showSeedMenu, setShowSeedMenu] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const ownerId = searchParams.get("ownerProfileId");
  console.log("🚀 ~ GardenPlot.tsx:27 ~ ownerId:", ownerId);
  const ownerName = searchParams.get("ownerName");
  const profileId = searchParams.get("profileId");
  console.log("🚀 ~ GardenPlot.tsx:30 ~ profileId:", profileId);

  const isOwnedByCurrentUser = ownerId === profileId;
  const isOwnedByOtherUser = ownerId && ownerId !== profileId;

  useEffect(() => {
    if (hasInteractiveParams) loadGameState();
  }, [hasInteractiveParams]);

  const loadGameState = async () => {
    backendAPI
      .get("/game-state")
      .then((response) => {
        console.log("🚀 ~ GardenPlot.tsx:42 ~ response.data:", response.data);
        setGameState(dispatch, response.data);
      })
      .catch((error) => setErrorMessage(dispatch, error as ErrorType))
      .finally(() => setIsLoading(false));
  };

  const handleClaimPlot = async () => {
    try {
      setIsClaiming(true);
      await backendAPI.post("/plot/claim");
      // Reload game state after claiming
      await loadGameState();
    } catch (error) {
      setErrorMessage(dispatch, error as ErrorType);
    } finally {
      setIsClaiming(false);
    }
  };

  // Show seed menu overlay
  if (showSeedMenu && gameState) {
    return <SeedMenu gameState={gameState} onClose={() => setShowSeedMenu(false)} onStateUpdate={loadGameState} />;
  }

  return (
    <PageContainer isLoading={isLoading} headerText="Garden Plot">
      <div className="container">
        {/* Plot owned by another user */}
        {isOwnedByOtherUser && (
          <div className="card">
            <div className="card-details">
              <h2 className="h2">Plot Owned by {ownerName}</h2>
              <p className="p2">
                This plot belongs to another player. You can view their garden but cannot make changes.
              </p>

              {gameState?.ownedPlot && (
                <div className="flex-col">
                  <p className="p3 text-muted">
                    Claimed on: {new Date(gameState.ownedPlot.claimedDate).toLocaleDateString()}
                  </p>
                  <PlotGrid
                    plotSquares={gameState.ownedPlot.plotSquares}
                    plants={gameState.plants || {}}
                    isReadOnly={true}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current user doesn't own any plot - show claim option */}
        {!isOwnedByOtherUser && !gameState?.ownedPlot && (
          <div className="card">
            <div className="card-details">
              <h2 className="h2">Claim This Plot</h2>
              <p className="p2">This plot is available! Claim it to start your garden.</p>
              <p className="p3 text-muted">Note: You can only claim one plot per account.</p>

              <button className="btn" onClick={handleClaimPlot} disabled={isClaiming}>
                {isClaiming ? "Claiming..." : "Claim This Plot"}
              </button>
            </div>
          </div>
        )}

        {/* Current user already owns a different plot */}
        {!isOwnedByOtherUser && gameState?.ownedPlot && !isOwnedByCurrentUser && (
          <>
            <h2 className="h2">Cannot Claim Plot</h2>
            <p className="p2">You already own a plot! Each player can only claim one plot.</p>
            <p className="p3">Your plot ID: {gameState.ownedPlot.plotAssetId}</p>
          </>
        )}

        {/* Current user's plot */}
        {isOwnedByCurrentUser && gameState?.ownedPlot && (
          <div className="card">
            <div className="card-details">
              <h2 className="h2">Your Garden Plot</h2>

              <div className="flex items-center justify-center">
                <div className="card small">
                  <div className="card-details">
                    <h3 className="card-title">💰 {gameState.coinsAvailable} Coins</h3>
                    <p className="card-description p3">Total Earned: {gameState.totalCoinsEarned}</p>
                  </div>
                </div>
              </div>

              <PlotGrid
                plotSquares={gameState.ownedPlot.plotSquares}
                plants={gameState.plants || {}}
                isReadOnly={false}
                onStateUpdate={loadGameState}
              />

              <div className="flex items-center justify-center">
                <button className="btn btn-outline" onClick={() => setShowSeedMenu(true)}>
                  🌱 Open Seed Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default GardenPlot;
