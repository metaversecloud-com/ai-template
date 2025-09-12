import { useContext, useEffect, useState } from "react";

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
  const [isDroppingPlant, setIsDroppingPlant] = useState(false);

  // Plant images data
  const plantImages = [
    {
      id: 1,
      name: "Rose",
      url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 2,
      name: "Sunflower",
      url: "https://images.unsplash.com/photo-1597848212624-e17eb5d5b0e4?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "Tulip",
      url: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 4,
      name: "Lily",
      url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 5,
      name: "Orchid",
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 6,
      name: "Cactus",
      url: "https://images.unsplash.com/photo-1509423350716-97f2360af5e4?w=400&h=400&fit=crop&crop=center",
    },
  ];

  const handlePlantClick = async (plant: { id: number; name: string; url: string }) => {
    if (!hasInteractiveParams) {
      setErrorMessage(dispatch, new Error("Interactive parameters required to drop plants"));
      return;
    }

    setIsDroppingPlant(true);

    try {
      await backendAPI.post("/drop-plant-asset", {
        imageUrl: plant.url,
        plantName: plant.name,
      });

      // Show success toast
      await backendAPI.put("/world/fire-toast", {
        title: "Plant Dropped!",
        text: `A beautiful ${plant.name} has been added to the world!`,
      });
    } catch (error) {
      setErrorMessage(dispatch, error as ErrorType);
    } finally {
      setIsDroppingPlant(false);
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
  }, [hasInteractiveParams, dispatch]);

  return (
    <PageContainer isLoading={isLoading} headerText="Plant Garden - Click to Drop Plants in the World">
      <div className="max-w-screen-lg">
        {!hasInteractiveParams ? (
          <div className="mb-8">
            <p className="text-lg mb-4">
              Edit an asset in your world and open the Links page in the Modify Asset drawer and add a link to your
              website or use &quot;http://localhost:3000&quot; for testing locally. You can also add assetId,
              interactiveNonce, interactivePublicKey, urlSlug, and visitorId directly to the URL as search parameters to
              use this feature.
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-lg mb-4">
              Interactive parameters found! Click on any plant below to drop it in the world.
            </p>

            {/* Plant Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {plantImages.map((plant) => (
                <div
                  key={plant.id}
                  className="relative group cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  onClick={() => handlePlantClick(plant)}
                >
                  <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-green-400 transition-colors duration-200">
                    <img
                      src={plant.url}
                      alt={plant.name}
                      className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 px-4 py-2 rounded-full">
                        <span className="text-green-600 font-semibold text-sm">
                          {isDroppingPlant ? "Dropping..." : `Drop ${plant.name}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-center mt-2 text-gray-700 font-medium">{plant.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DroppedAssetDetails />
    </PageContainer>
  );
};

export default Home;
