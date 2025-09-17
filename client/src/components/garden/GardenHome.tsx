/**
 * GardenHome component
 * Displays the garden game homepage with instructions and navigation options
 */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import { PageContainer } from "@/components";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage } from "@/utils";

export const GardenHome = () => {
  // Access global state and dispatch
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  const [instructions, setInstructions] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        setIsLoading(true);
        const response = await backendAPI.get("/garden/instructions");

        if (response.data) {
          setInstructions(response.data);
        }
      } catch (err) {
        setErrorMessage(dispatch, err as ErrorType);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasInteractiveParams) {
      fetchInstructions();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, hasInteractiveParams]);

  const handleGoToGarden = () => {
    navigate("/garden/plots");
  };

  return (
    <PageContainer isLoading={isLoading} headerText="Garden Home">
      <div className="container">
        <div className="card">
          <div className="card-details">
            <h2 className="card-title h2">Welcome to the Garden Game!</h2>

            <div className="prose" dangerouslySetInnerHTML={{ __html: instructions }} />

            <div className="actions mt-4">
              <button className="btn" onClick={handleGoToGarden}>
                Start Gardening
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
