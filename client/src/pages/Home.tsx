import { useContext, useEffect, useState } from "react";

// components
import { PageContainer, DroppedAssetDetails } from "@/components";
import PlantSelector from "@/components/PlantSelector";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

export const Home = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  const [isLoading, setIsLoading] = useState(true);

  // New: Track dropped asset response
  const [droppedAsset, setDroppedAsset] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Handler for plant selection
  const handlePlantSelect = async (imageUrl: string) => {
    setError(null);
    setDroppedAsset(null);
    try {
      // Call backend route via fetch (backendAPI.ts cannot be changed)
      const res = await fetch("/api/drop-plant-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setDroppedAsset(data.asset);
      } else {
        setError(data.error || "Failed to drop asset");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  useEffect(() => {
    backendAPI
      .put("/world/fire-toast", { title: "Nice Work!", text: "You've successfully completed the task!" })
      .catch((error) => setErrorMessage(dispatch, error as ErrorType));

    if (hasInteractiveParams) {
      backendAPI
        .get("/game-state")
        .then((response) => {
          setGameState(dispatch, response.data);
        })
        .catch((error) => setErrorMessage(dispatch, error as ErrorType))
        .finally(() => setIsLoading(false));
    }
  }, [hasInteractiveParams]);

  return (
    <PageContainer isLoading={isLoading} headerText="Server side example using interactive parameters">
      <h2 className="text-xl font-bold mb-4">Select a Plant to Drop</h2>
      <PlantSelector onSelect={handlePlantSelect} />
      {droppedAsset && (
        <div className="mt-4 p-2 border rounded bg-green-50">
          <strong>Dropped Asset:</strong>
          <pre>{JSON.stringify(droppedAsset, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 border rounded bg-red-50 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      <DroppedAssetDetails />
    </PageContainer>
  );
};

export default Home;
