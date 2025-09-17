import React, { useEffect, useState } from "react";
import { getHomeInstructions } from "../../utils/gardenAPI";
import { PageContainer } from "../PageContainer";
import { useNavigate } from "react-router-dom";

/**
 * GardenHome component displays the garden game homepage with instructions
 * and navigation options
 */
const GardenHome: React.FC = () => {
  const [instructions, setInstructions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        setLoading(true);
        const response = await getHomeInstructions();

        if (response.success && response.data) {
          setInstructions(response.data);
        } else {
          setError(response.error || "Failed to load garden instructions");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, []);

  const handleGoToGarden = () => {
    navigate("/garden/plots");
  };

  if (loading) {
    return (
      <PageContainer headerText="Garden Home" isLoading={true}>
        <></>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer headerText="Garden Home" isLoading={false}>
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer headerText="Virtual Garden" isLoading={false}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Welcome to Your Virtual Garden!</h2>
          <div className="prose prose-green" dangerouslySetInnerHTML={{ __html: instructions }} />
        </div>

        <div className="flex flex-col items-center mb-6">
          <img
            src="https://storage.googleapis.com/topia-world-assets/garden-game/garden_header.png"
            alt="Garden"
            className="w-full max-w-md rounded-lg shadow-md mb-4"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGoToGarden}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-semibold"
          >
            Enter Garden
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default GardenHome;
