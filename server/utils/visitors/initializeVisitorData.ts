import { Visitor } from "../index.js";
import { Credentials } from "../../types/Credentials.js";
import { VisitorDataObject } from "../../types/VisitorDataTypes.js";
import { DEFAULT_VISITOR_DATA } from "../../constants/gameConstants.js";

/**
 * Initialize visitor data object with default values if it doesn't exist or is missing properties
 */
export const initializeVisitorData = async (credentials: Credentials): Promise<VisitorDataObject> => {
  const { urlSlug, visitorId } = credentials;

  try {
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    await visitor.fetchDataObject();

    let visitorData = visitor.dataObject as VisitorDataObject;

    // Check if visitor data needs initialization
    const needsInitialization =
      !visitorData ||
      typeof visitorData.coinsAvailable === 'undefined' ||
      typeof visitorData.totalCoinsEarned === 'undefined' ||
      typeof visitorData.ownedPlot === 'undefined' ||
      !visitorData.seedsPurchased ||
      !visitorData.plants;

    if (needsInitialization) {
      // Merge existing data with defaults
      visitorData = {
        ...DEFAULT_VISITOR_DATA,
        ...visitorData,
        seedsPurchased: visitorData?.seedsPurchased || {},
        plants: visitorData?.plants || {},
      };

      // Set the initialized data object
      await visitor.setDataObject(visitorData, {
        analytics: [{ analyticName: "visitor_initialized" }],
      });
    }

    return visitorData;
  } catch (error: any) {
    throw new Error(`Failed to initialize visitor data: ${error.message}`);
  }
};