import { useContext, useEffect, useState } from "react";

// components
import { PageContainer, Accordion } from "@/components";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

type ItemsType = {
  id: string;
  name: string;
  thumbnail: string;
};

export const Home = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  const [items, setItems] = useState<ItemsType[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemsType | null>(null);
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
          setItems(response.data.items || []);
        })
        .catch((error) => setErrorMessage(dispatch, error as ErrorType))
        .finally(() => setIsLoading(false));
    }
  }, [hasInteractiveParams]);

  return (
    <PageContainer isLoading={isLoading} headerText="Page Header">
      <div className="grid gap-4 text-center">
        <p className="pt-4">Update the configuration.</p>
        <Accordion title="Settings">
          {items?.map((item) => (
            <div
              key={item.id}
              className={`mb-2 ${selectedItem === item ? "selected" : ""}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="card small">
                <div className="card-image" style={{ height: "auto" }}>
                  <img src={item?.thumbnail} alt={item.name} />
                </div>
                <div className="card-details">
                  <h4 className="card-title h4">{item.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </Accordion>
      </div>
    </PageContainer>
  );
};

export default Home;
