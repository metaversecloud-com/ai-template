import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// components
import { PageContainer } from "@/components";
import { PlantDetails } from "@/components/PlantDetails";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

export const GardenPlant = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams, visitorData } = useContext(GlobalStateContext);
  const { plants } = visitorData || {};

  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const ownerProfileId = searchParams.get("ownerProfileId");
  const profileId = searchParams.get("profileId");
  const assetId = searchParams.get("assetId");

  const isOwnedByCurrentUser = ownerProfileId === profileId;

  useEffect(() => {
    if (hasInteractiveParams) loadGameState();
  }, [hasInteractiveParams]);

  const loadGameState = async () => {
    backendAPI
      .get("/game-state")
      .then((response) => {
        setGameState(dispatch, response.data);
      })
      .catch((error) => setErrorMessage(dispatch, error as ErrorType))
      .finally(() => setIsLoading(false));
  };

  // Find the specific plant data
  const plant = assetId && plants ? plants[assetId] : null;

  if (isLoading) {
    return (
      <PageContainer isLoading={true} headerText="Loading Plant...">
        <></>
      </PageContainer>
    );
  }

  if (!plant) {
    return (
      <PageContainer isLoading={false} headerText="Plant Not Found">
        <div className="container">
          <div className="card danger">
            <div className="card-details">
              <h2 className="h2">Plant Not Found</h2>
              <p className="p2">This plant doesn't exist or may have been harvested.</p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer isLoading={false} headerText="Garden Plant">
      <div className="container">
        {/* Plant owned by another user */}
        {!isOwnedByCurrentUser && (
          <div className="card">
            <div className="card-details">
              <h2 className="h2">Plant Details</h2>
              <p className="p2">This plant belongs to another player.</p>
              <PlantDetails plant={plant} isReadOnly={true} onStateUpdate={loadGameState} />
            </div>
          </div>
        )}

        {/* Current user's plant */}
        {isOwnedByCurrentUser && (
          <PlantDetails plant={plant} plantAssetId={assetId || ""} isReadOnly={false} onStateUpdate={loadGameState} />
        )}
      </div>
    </PageContainer>
  );
};

export default GardenPlant;
