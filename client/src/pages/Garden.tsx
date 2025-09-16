import { useContext, useEffect, useState } from "react";
import { PageContainer } from "@/components";
import GardenView from "@/components/GardenView";
import GardenControls from "@/components/GardenControls";
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { getGameState, removeAllPlants } from "@/utils/gardenAPI";
import { updateGardenState } from "@/utils/setGardenState";
import { setErrorMessage } from "@/utils/setErrorMessage";
import { ErrorType } from "@/context/types";

const Garden = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasInteractiveParams) {
      fetchGardenState();
    }
  }, [hasInteractiveParams]);

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

  const handleRemoveAllPlants = async () => {
    if (!confirm("Are you sure you want to remove all plants? This cannot be undone.")) return;

    setIsLoading(true);
    try {
      await removeAllPlants();
      fetchGardenState();
    } catch (error) {
      setErrorMessage(dispatch!, error as ErrorType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer isLoading={isLoading} headerText="🌱 Topia Garden">
      <div className="max-w-4xl mx-auto space-y-6">
        <GardenControls onRefresh={fetchGardenState} onRemoveAll={handleRemoveAllPlants} />
        <GardenView />
      </div>
    </PageContainer>
  );
};

export default Garden;
