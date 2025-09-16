import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// components
import { PageContainer, DroppedAssetDetails } from "@/components";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

export const Home = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  const [isLoading, setIsLoading] = useState(true);

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
      <DroppedAssetDetails />
      <div className="mt-8 text-center">
        <Link to="/garden" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-lg">
          Go to Garden Game 🌱
        </Link>
      </div>
    </PageContainer>
  );
};

export default Home;
