# Garden Game Feature Implementation

## Changes Summary

This PR implements a virtual garden game in the Topia interactive app. Users can claim plots, plant seeds, watch them grow, and harvest plants to earn coins.

## Files Changed

### Server-side

#### New Types

- `/server/types/GardenTypes.ts` - Defines types for garden game entities

#### New Controllers

- `/server/controllers/handleGetHomeInstructions.ts` - Garden instructions controller
- `/server/controllers/handleClaimPlot.ts` - Plot claiming controller
- `/server/controllers/handleGetPlotDetails.ts` - Plot details controller
- `/server/controllers/handleGetSeedMenu.ts` - Seed menu controller
- `/server/controllers/handlePurchaseSeed.ts` - Seed purchase controller
- `/server/controllers/handlePlantSeed.ts` - Seed planting controller
- `/server/controllers/handleGetPlantDetails.ts` - Plant details controller
- `/server/controllers/handleHarvestPlant.ts` - Plant harvesting controller

#### New Utilities

- `/server/utils/garden/calculatePlantPosition.ts` - Calculate plant position in plots
- `/server/utils/garden/getPlantData.ts` - Plant growth utilities
- `/server/utils/garden/getSeedData.ts` - Seed data utilities
- `/server/utils/garden/gardenCredentialsMiddleware.ts` - Middleware for garden routes
- `/server/utils/garden/initializeVisitorDataObject.ts` - Initialize visitor data
- `/server/utils/garden/initializeWorldDataObject.ts` - Initialize world data
- `/server/utils/garden/index.ts` - Export garden utilities

#### Modified Files

- `/server/controllers/index.ts` - Added exports for garden controllers
- `/server/utils/index.ts` - Added export for garden utilities
- `/server/routes.ts` - Added garden routes

#### New Tests

- `/server/tests/handleGetHomeInstructions.test.ts` - Test home instructions controller
- `/server/tests/handleClaimPlot.test.ts` - Test plot claiming controller
- `/server/tests/gardenRoutes.test.ts` - Test garden routes

### Client-side

#### New Types

- `/client/src/types/gardenTypes.ts` - Client-side types for garden game

#### New API Utilities

- `/client/src/utils/gardenAPI.ts` - API calls for garden endpoints

#### New Components

- `/client/src/components/garden/GardenHome.tsx` - Garden home component
- `/client/src/components/garden/PlotGrid.tsx` - Plot grid component
- `/client/src/components/garden/SeedMenu.tsx` - Seed menu component
- `/client/src/components/garden/PlantDetails.tsx` - Plant details component
- `/client/src/components/garden/index.ts` - Export garden components

#### New Pages

- `/client/src/pages/GardenHome.tsx` - Garden home page
- `/client/src/pages/GardenPlots.tsx` - Garden plots page
- `/client/src/pages/GardenSeeds.tsx` - Seed menu page
- `/client/src/pages/GardenPlant.tsx` - Plant details page

#### Modified Files

- `/client/src/utils/index.ts` - Added export for garden API
- `/client/src/components/index.ts` - Added export for garden components
- `/client/src/pages/index.ts` - Added export for garden pages
- `/client/src/App.tsx` - Added routes for garden pages
- `/client/src/pages/Home.tsx` - Added link to garden game

#### New Documentation

- `/docs/garden-game.md` - Garden game documentation

## Feature Description

The garden game allows users to:

1. **Claim Plots**: Users can claim plots of land in a virtual garden
2. **Purchase Seeds**: Users can buy seeds with coins they've earned
3. **Plant Seeds**: Users can plant seeds in their plots
4. **Watch Growth**: Plants grow over time based on the seed type
5. **Harvest Plants**: Users can harvest mature plants to earn coins

Seeds have different properties (cost, growth time, reward) and plants visually progress through growth stages.

## Technical Implementation

- **Data Storage**: Uses Topia SDK's Visitor and World data objects
- **Visual Representation**: Uses DroppedAsset for plant visualization
- **State Management**: Tracks player progress and plant growth over time
- **Responsive UI**: Mobile-friendly interface with Tailwind CSS

## Testing

All server-side controllers and routes have corresponding Jest tests. Client-side components rely on TypeScript for type safety.

## Running Instructions

1. Server:

```
cd server
npm run dev
```

2. Client:

```
cd client
npm run dev
```

3. Access at http://localhost:5173
