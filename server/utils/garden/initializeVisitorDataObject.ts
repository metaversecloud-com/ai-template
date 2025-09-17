import { Visitor } from '@rtsdk/topia';
import { DEFAULT_VISITOR_DATA, VisitorDataObject } from '../../types/GardenTypes';

/**
 * Check if a data object has the required properties for garden data
 * @param data - The data object to check
 * @returns True if the data has all required garden properties
 */
function hasGardenDataProperties(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    'coinsAvailable' in data &&
    'totalCoinsEarned' in data &&
    'availablePlots' in data &&
    'seedsPurchased' in data &&
    'plants' in data
  );
}

/**
 * Initialize a visitor's garden data object if it doesn't exist
 * @param visitor - The visitor to initialize data for
 * @returns The current visitor data object
 */
export const initializeVisitorDataObject = async (visitor: Visitor): Promise<VisitorDataObject> => {
  try {
    const visitorData = await visitor.fetchDataObject();
    
    // If the visitor doesn't have garden data, initialize it
    if (!visitorData ||
        !hasGardenDataProperties(visitorData)) {
      
      await visitor.setDataObject(DEFAULT_VISITOR_DATA);
      return DEFAULT_VISITOR_DATA;
    }
    
    return visitorData as VisitorDataObject;
  } catch (error) {
    console.error('Error initializing visitor data object:', error);
    throw new Error('Failed to initialize visitor data object');
  }
}
  } catch (error) {
    console.error('Error initializing visitor data object:', error);
    throw new Error('Failed to initialize visitor data object');
  }
};