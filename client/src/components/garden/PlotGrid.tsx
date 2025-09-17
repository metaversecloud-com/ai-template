import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlotDetails, claimPlot } from "../../utils/gardenAPI";
import { PlotDetails } from "../../types/gardenTypes";
import { PageContainer } from "../PageContainer";

/**
 * PlotGrid component displays a grid of garden plots
 */
const PlotGrid: React.FC = () => {
  const [plots, setPlots] = useState<Record<number, PlotDetails>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingPlot, setClaimingPlot] = useState<number | null>(null);
  const navigate = useNavigate();

  // Define the total number of plots
  const totalPlots = 12; // Must match the number of plots on the server

  // Fetch details for all plots
  useEffect(() => {
    const fetchAllPlots = async () => {
      try {
        setLoading(true);

        // Create an array of plot IDs from 0 to totalPlots-1
        const plotIds = Array.from({ length: totalPlots }, (_, i) => i);

        // Fetch details for each plot in parallel
        const plotDetailsPromises = plotIds.map((plotId) => getPlotDetails(plotId));
        const plotDetailsResponses = await Promise.all(plotDetailsPromises);

        // Create a record of plot details
        const plotsRecord: Record<number, PlotDetails> = {};
        plotDetailsResponses.forEach((response, index) => {
          if (response.success && response.data) {
            plotsRecord[index] = response.data;
          } else {
            console.error(`Error fetching plot ${index}:`, response.error);
          }
        });

        setPlots(plotsRecord);
      } catch (err) {
        setError("Failed to load garden plots");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPlots();
  }, []);

  // Handle claiming a plot
  const handleClaimPlot = async (plotId: number) => {
    try {
      setClaimingPlot(plotId);
      const response = await claimPlot(plotId);

      if (response.success) {
        // Update the plot in our state
        setPlots((prevPlots) => ({
          ...prevPlots,
          [plotId]: {
            ...prevPlots[plotId],
            isAvailable: false,
          },
        }));
      } else {
        setError(response.error || "Failed to claim plot");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setClaimingPlot(null);
    }
  };

  // Handle clicking on a plot
  const handlePlotClick = (plotId: number, plot: PlotDetails) => {
    if (!plot.isAvailable && plot.plantId) {
      // If plot has a plant, navigate to plant details
      navigate(`/garden/plant/${plot.plantId}`);
    } else if (plot.isAvailable) {
      // If plot is available but not claimed, navigate to seed menu
      navigate(`/garden/seeds?plotId=${plotId}`);
    }
  };

  if (loading) {
    return (
      <PageContainer headerText="Garden Plots" isLoading={true}>
        <></>
      </PageContainer>
    );
  }

  return (
    <PageContainer headerText="Your Garden Plots" isLoading={false}>
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm">
              Dismiss
            </button>
          </div>
        )}

        <div className="p-4 bg-green-50 rounded-lg mb-6">
          <p className="text-green-800">
            Select an empty plot to plant seeds or click on a growing plant to check its progress.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(plots).map(([id, plot]) => {
            const plotId = Number(id);
            const isClaiming = claimingPlot === plotId;

            // Determine the plot's status and appearance
            let plotContent;
            let plotClass =
              "flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-transform transform hover:scale-105";

            if (!plot.isAvailable && plot.plantId) {
              // Plot has a plant
              plotClass += " bg-green-100 border-2 border-green-500";
              plotContent = (
                <>
                  <img
                    src="https://storage.googleapis.com/topia-world-assets/garden-game/plant_icon.png"
                    alt="Plant"
                    className="w-16 h-16 object-contain"
                  />
                  <span className="mt-2 text-sm text-green-800 font-medium">Growing</span>
                </>
              );
            } else if (plot.isAvailable) {
              // Empty plot, ready to plant
              plotClass += " bg-amber-50 border-2 border-amber-200";
              plotContent = (
                <>
                  <img
                    src="https://storage.googleapis.com/topia-world-assets/garden-game/plot_icon.png"
                    alt="Empty Plot"
                    className="w-16 h-16 object-contain opacity-70"
                  />
                  <span className="mt-2 text-sm text-amber-800 font-medium">Plant Here</span>
                </>
              );
            } else {
              // Plot is not available and has no plant (something's wrong)
              plotClass += " bg-gray-100 border-2 border-gray-300";
              plotContent = (
                <>
                  <img
                    src="https://storage.googleapis.com/topia-world-assets/garden-game/locked_icon.png"
                    alt="Locked Plot"
                    className="w-16 h-16 object-contain opacity-50"
                  />
                  <span className="mt-2 text-sm text-gray-600 font-medium">Unavailable</span>
                </>
              );
            }

            return (
              <div key={`plot-${id}`} className={plotClass} onClick={() => handlePlotClick(plotId, plot)}>
                {isClaiming ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    <span className="mt-2 text-xs text-green-800">Claiming...</span>
                  </div>
                ) : (
                  <>
                    {plotContent}
                    <span className="mt-1 text-xs text-gray-600">Plot {plotId + 1}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};

export default PlotGrid;
