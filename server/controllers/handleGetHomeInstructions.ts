import { Response } from "express";
import { GardenRequest } from "../types/GardenTypes";

/**
 * Handle getting the home page instructions
 * @param req - The request object
 * @param res - The response object
 */
export const handleGetHomeInstructions = async (req: GardenRequest, res: Response) => {
  try {
    const instructions = `
# Welcome to the Garden Game!

In this relaxing gardening game, you can plant seeds, watch them grow, and harvest crops to earn rewards.

## How to Play:
1. **Claim a Plot**: Find an empty plot and claim it to start your garden.
2. **Purchase Seeds**: Use coins to buy seeds from the seed menu.
3. **Plant Seeds**: Select a seed and a spot in your plot to plant it.
4. **Watch Plants Grow**: Check back regularly to see your plants grow over time.
5. **Harvest Plants**: When plants are fully grown, harvest them to earn coins.
6. **Unlock More Seeds**: Use your earnings to unlock new and rare seed types.

Happy gardening!
    `;

    return res.json({
      success: true,
      data: { instructions },
    });
  } catch (error) {
    console.error("Error getting home instructions:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get home instructions",
    });
  }
};
