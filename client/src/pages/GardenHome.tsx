import { useContext } from "react";

// components
import { PageContainer } from "@/components";

// context
import { GlobalStateContext } from "@/context/GlobalContext";

export const GardenHome = () => {
  const { hasInteractiveParams } = useContext(GlobalStateContext);

  return (
    <PageContainer isLoading={!hasInteractiveParams} headerText="Welcome to Garden Game">
      <div className="container">
        <div className="card">
          <div className="card-details">
            <h2 className="h2">How to Play</h2>
            <div className="flex-col">
              <p className="p2">Welcome to the relaxing garden game! Here's how to get started:</p>

              <div className="card small">
                <div className="card-details">
                  <h3 className="card-title">1. Claim a Plot</h3>
                  <p className="card-description p3">
                    Find an empty plot in the world and click on it. Then click "Claim This Plot" to make it yours.
                    You can only own one plot per account.
                  </p>
                </div>
              </div>

              <div className="card small">
                <div className="card-details">
                  <h3 className="card-title">2. Get Seeds</h3>
                  <p className="card-description p3">
                    Some seeds are free (Carrot, Lettuce) while others cost coins (Tomato, Pumpkin).
                    You start with 10 coins to buy premium seeds.
                  </p>
                </div>
              </div>

              <div className="card small">
                <div className="card-details">
                  <h3 className="card-title">3. Plant & Wait</h3>
                  <p className="card-description p3">
                    Plant seeds in your 4x4 plot grid. Plants grow automatically over time -
                    from 1 minute (Carrot) to 5 minutes (Pumpkin).
                  </p>
                </div>
              </div>

              <div className="card small">
                <div className="card-details">
                  <h3 className="card-title">4. Harvest & Earn</h3>
                  <p className="card-description p3">
                    When plants are fully grown, click on them and harvest for coins!
                    Use your earnings to unlock more expensive seeds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card success">
          <div className="card-details">
            <h3 className="card-title">Ready to Start?</h3>
            <p className="card-description p2">
              Look for plot assets in the world - they look like empty garden plots.
              Click on one to claim it and start your gardening journey!
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default GardenHome;