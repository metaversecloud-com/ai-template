import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// components
import { PageContainer } from "@/components";

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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Topia Interactive App</h2>
          <p className="text-gray-700 mb-4">
            This is a demonstration of interactive functionality in Topia virtual worlds.
          </p>

          <div className="bg-green-50 p-6 rounded-lg my-6">
            <h3 className="text-xl font-semibold text-green-800 mb-3">🌱 Try the Garden Game!</h3>
            <p className="text-green-700 mb-4">
              Plant seeds, watch them grow, and harvest plants to earn coins in our virtual garden.
            </p>
            <Link
              to="/garden"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Enter Garden
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
