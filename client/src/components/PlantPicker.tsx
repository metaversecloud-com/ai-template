import { useState } from "react";
import { useContext } from "react";
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { ErrorType } from "@/context/types";
import { backendAPI, setErrorMessage } from "@/utils";

// Define plant image interface
interface PlantImage {
  id: string;
  url: string;
  name: string;
}

// Define 6 plant images
const plantImages: PlantImage[] = [
  {
    id: "plant1",
    url: "https://topia-dev-test.s3.us-east-1.amazonaws.com/pumpkin/body_0_orange.png",
    name: "Fern Plant",
  },
  {
    id: "plant2",
    url: "https://topia-dev-test.s3.us-east-1.amazonaws.com/pumpkin/body_0_orangePurple.png",
    name: "Snake Plant",
  },
  {
    id: "plant3",
    url: "https://topia-dev-test.s3.us-east-1.amazonaws.com/pumpkin/body_0_teal.png",
    name: "Pothos Plant",
  },
  {
    id: "plant4",
    url: "https://topia-dev-test.s3.us-east-1.amazonaws.com/pumpkin/body_1_amber.png",
    name: "Succulent Plant",
  },
  {
    id: "plant5",
    url: "https://topia-dev-test.s3.us-east-1.amazonaws.com/pumpkin/body_2_mint.png",
    name: "Monstera Plant",
  },
  {
    id: "plant6",
    url: "https://topia-dev-test.s3.us-east-1.amazonaws.com/pumpkin/body_2_purple.png",
    name: "Spider Plant",
  },
];

export const PlantPicker = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [isDropping, setIsDropping] = useState(false);

  const handlePlantClick = async (plant: PlantImage) => {
    if (!hasInteractiveParams || isDropping) {
      return;
    }

    setSelectedPlant(plant.id);
    setIsDropping(true);

    try {
      // Call the server to drop the plant
      const response = await backendAPI.post("/drop-plant", {
        imageUrl: plant.url,
        plantName: plant.name,
      });

      if (response.data && response.data.success) {
        // Update state with the new dropped asset if needed
        console.log("Plant dropped successfully:", response.data.droppedAsset);
      }
    } catch (error) {
      setErrorMessage(dispatch, error as ErrorType);
    } finally {
      setIsDropping(false);
    }
  };

  return (
    <div>
      <h2 className="h2">Choose a plant to add to your world:</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {plantImages.map((plant) => (
          <div
            key={plant.id}
            onClick={() => handlePlantClick(plant)}
            className={`card ${selectedPlant === plant.id ? "card-selected" : ""}`}
            style={{
              cursor: !hasInteractiveParams || isDropping ? "not-allowed" : "pointer",
              opacity: !hasInteractiveParams || isDropping ? 0.5 : 1,
            }}
          >
            <div
              className="card-image"
              style={{ height: "160px", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <img src={plant.url} alt={plant.name} style={{ maxHeight: "140px", objectFit: "contain" }} />
            </div>
            <div className="card-details">
              <p className="card-title">{plant.name}</p>
              {selectedPlant === plant.id && <div className="chip chip-success">Selected</div>}
            </div>
          </div>
        ))}
      </div>
      {!hasInteractiveParams && (
        <p className="p3 text-error" style={{ marginTop: "1rem" }}>
          Interactive parameters are required to drop plants. Please open this page from a Topia world.
        </p>
      )}
      {isDropping && (
        <div className="timer" style={{ marginTop: "1rem" }}>
          ⌛ Dropping your plant into the world...
        </div>
      )}
    </div>
  );
};

export default PlantPicker;
