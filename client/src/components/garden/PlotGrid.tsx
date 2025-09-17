/**
 * PlotGrid component
 * Displays a grid of garden plots that users can interact with
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

// types
interface PlotDetails {
  plotId: number;
  isAvailable: boolean;
  plantId?: string;
  seedName?: string;
  growthLevel?: number;
}

export const PlotGrid = () => {
  // Access global state and dispatch
  const dispatch = useContext(GlobalDispatchContext);
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  const [plots, setPlots] = useState<Record<number, PlotDetails>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch details for all plots
  useEffect(() => {
    const fetchAllPlots = async () => {
      try {
        setIsLoading(true);
        const response = await backendAPI.get("/garden/plots");

        if (response.data) {
          setPlots(response.data);
        }
      } catch (err) {
        setErrorMessage(dispatch, err as ErrorType);
      } finally {
        setIsLoading(false);
      }
    };

    if (hasInteractiveParams) {
      fetchAllPlots();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, hasInteractiveParams]);

  // Handle clicking on a plot
  const handlePlotClick = (plotId: number, plot: PlotDetails) => {
    if (!plot.isAvailable && plot.plantId) {
      // If plot has a plant, navigate to plant details
      navigate(`/garden/plant/${plot.plantId}`);
    } else if (plot.isAvailable) {
      // If plot is available, navigate to seed menu
      navigate(`/garden/seeds?plotId=${plotId}`);
    }
  };

  return (
    <PageContainer headerText="Your Garden Plots" isLoading={isLoading}>
      <div className="container">
        <div className="card card-info mb-4">
          <div className="card-details">
            <p className="p2">Select an empty plot to plant seeds or click on a growing plant to check its progress.</p>
          </div>
        </div>

        <div className="grid-container">
          {Object.entries(plots).map(([id, plot]) => {
            const plotId = Number(id);

            // Determine the plot's status and appearance
            let plotContent;
            let plotClassName = "plot-item";

            if (!plot.isAvailable && plot.plantId) {
              // Plot has a plant
              plotClassName += " plot-planted";
              plotContent = (
                <>
                  <img
                    src="https://storage.googleapis.com/topia-world-assets/garden-game/plant_icon.png"
                    alt="Plant"
                    className="plot-icon"
                  />
                  <span className="plot-label text-success">Growing</span>
                </>
              );
            } else if (plot.isAvailable) {
              // Empty plot, ready to plant
              plotClassName += " plot-available";
              plotContent = (
                <>
                  <img
                    src="https://storage.googleapis.com/topia-world-assets/garden-game/plot_icon.png"
                    alt="Empty Plot"
                    className="plot-icon"
                  />
                  <span className="plot-label text-highlight">Plant Here</span>
                </>
              );
            } else {
              // Plot is not available and has no plant
              plotClassName += " plot-unavailable";
              plotContent = (
                <>
                  <img
                    src="https://storage.googleapis.com/topia-world-assets/garden-game/locked_icon.png"
                    alt="Locked Plot"
                    className="plot-icon"
                  />
                  <span className="plot-label text-muted">Unavailable</span>
                </>
              );
            }

            return (
              <div key={`plot-${id}`} className={plotClassName} onClick={() => handlePlotClick(plotId, plot)}>
                {plotContent}
                <span className="p3 text-muted">Plot {plotId + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
