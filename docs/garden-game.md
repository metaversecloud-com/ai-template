# Garden Game Implementation

This document outlines the implementation details for the Virtual Garden game in the Topia interactive app.

## Overview

The Virtual Garden is a simple game where users can:

- Claim plots of land in a virtual garden
- Purchase seeds with different growth times and rewards
- Plant seeds in their plots
- Watch plants grow over time
- Harvest mature plants to earn coins

## Technical Implementation

### Server-side Components

#### Types

- Created `GardenTypes.ts` with interfaces for:
  - Seed
  - Plant
  - PurchasedSeed
  - VisitorDataObject
  - WorldDataObject
  - GardenCredentials
  - GardenRequest
  - Seed and plant image configuration

#### Controllers

- Created 8 controllers for the garden game:
  - `handleGetHomeInstructions.ts`: Returns game instructions
  - `handleClaimPlot.ts`: Claims a plot for the user
  - `handleGetPlotDetails.ts`: Gets details about a plot
  - `handleGetSeedMenu.ts`: Returns available seeds and user's coins
  - `handlePurchaseSeed.ts`: Purchases a seed with coins
  - `handlePlantSeed.ts`: Plants a seed in a plot
  - `handleGetPlantDetails.ts`: Gets details about a plant
  - `handleHarvestPlant.ts`: Harvests a mature plant and gives coins

#### Utilities

- Created utility functions in `server/utils/garden/`:
  - `calculatePlantPosition.ts`: Calculates position for planting
  - `getPlantData.ts`: Functions for plant growth and images
  - `getSeedData.ts`: Functions for seed data
  - `gardenCredentialsMiddleware.ts`: Middleware for garden routes
  - `initializeVisitorDataObject.ts`: Initializes visitor data
  - `initializeWorldDataObject.ts`: Initializes world data

#### Routes

- Updated `routes.ts` to add endpoints for garden game:
  - GET `/garden/home-instructions`
  - POST `/garden/claim-plot`
  - GET `/garden/plot-details`
  - GET `/garden/seed-menu`
  - POST `/garden/purchase-seed`
  - POST `/garden/plant-seed`
  - GET `/garden/plant-details`
  - POST `/garden/harvest-plant`

### Client-side Components

#### Types

- Created `gardenTypes.ts` with interfaces for client-side data

#### API Utilities

- Created `gardenAPI.ts` with functions for calling garden endpoints

#### Components

- Created 4 React components in `components/garden/`:
  - `GardenHome.tsx`: Welcome page with instructions
  - `PlotGrid.tsx`: Grid of garden plots to claim and plant
  - `SeedMenu.tsx`: Menu for purchasing and planting seeds
  - `PlantDetails.tsx`: Details about a specific plant

#### Pages

- Created 4 pages in `pages/`:
  - `GardenHome.tsx`: Main garden welcome page
  - `GardenPlots.tsx`: Garden plot grid page
  - `GardenSeeds.tsx`: Seed selection page
  - `GardenPlant.tsx`: Plant details page

#### Routes

- Updated `App.tsx` to add routes for garden pages:
  - `/garden`
  - `/garden/plots`
  - `/garden/seeds`
  - `/garden/plant/:plantId`

### Tests

- Created tests for controllers and routes:
  - `handleGetHomeInstructions.test.ts`
  - `handleClaimPlot.test.ts`
  - `gardenRoutes.test.ts`

## Data Flow

1. User starts at the Home page, which links to the Garden Home
2. User goes to Garden Plots to see available plots
3. User claims a plot and is directed to the Seed Menu
4. User selects and plants a seed
5. Plant grows over time based on seed type
6. User can harvest mature plants to earn coins
7. Coins can be used to purchase premium seeds

## Game State Management

- Player progress is stored in the VisitorDataObject, which includes:

  - Available coins
  - Total coins earned
  - Available plots
  - Purchased seeds
  - Planted plants

- World state is stored in the WorldDataObject, which maps:
  - Plot locations to plant assets

## Running the Application

1. Install dependencies:

   ```
   npm install
   ```

2. Start the server:

   ```
   cd server
   npm run dev
   ```

3. Start the client:

   ```
   cd client
   npm run dev
   ```

4. Access the application at: http://localhost:5173

## Testing

Run the tests with:

```
cd server
npm test
```
