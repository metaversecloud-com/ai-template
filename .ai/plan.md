# Gardening Game Plan

Read `.ai/rules.md` first. Do not propose any code yet.

## PLAN REQUEST

I want to use this repo as a starting point to create a new app with the following functionality:

## Game Overview

A relaxing, loop-based gardening game where players plant seeds, grow crops, and harvest them to earn rewards.

This version focuses on core mechanics only: planting, growing, and harvesting. Future updates may include trading, crafting, pests, weather cycles, and cross-player co-op.

## Core Gameplay Loop

1. Plant a seed from the seed menu
2. Wait for growth time (real time or simulated)
3. Harvest when plant is ready
4. Earn coins or points
5. Use rewards to unlock new seed types or decor

## Important Terminology

The "Key Asset" refers to a dropped asset that is already in world that when clicked will open this app in an iframe. All necessary credentials will be passed to that iframe by default. Note that this is separate from all plant dropped assets and will be the only dropped asset that is clickable in this version of the app.

## Data Object setup

### World Data Object

The World's data object should contain an object keyed by `sceneDropId` with the value set to `assetId` (both pulled from req.query, see example usage of getCredentials in existing controllers). This should only be updated if the World data object does not already contain a value for the `sceneDropId`.

Example output:

```ts
{
  "exampleSceneDropId1": "exampleAssetId1",
  "exampleSceneDropId2": "exampleAssetId2"
}
```

### Visitor Data Object

The Visitors' data objects should be updated when actions outlined in the users stories are taken.

Example output:

```ts
{
  "coinsAvailable": 20,
  "totalCoinsEarned": 10,
  "availablePlots": {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
  },
  "seedsPurchased": {
    1: {
      id: 1,
      datePurchased: "2025-09-17T00:00:00.000Z"
    },
    4: {
      id: 4,
      datePurchased: "2025-09-17T00:00:00.000Z"
    }
  },
  "plants": {
    "exampleDroppedAssetId1": {
      "dateDropped": "2025-09-17T00:00:00.000Z",
      "seedId": 1,
      "growLevel": 4,
      "plotId": 0,
      "wasHarvested": false
    },
    "exampleDroppedAssetId2": {
      "dateDropped": "2025-09-17T00:00:00.000Z",
      "seedId": 2,
      "growLevel": 10,
      "plotId": 2,
      "wasHarvested": true
    }
  }
}
```

## 🧑‍💻 User Stories & Acceptance Criteria

Epic 1: Home Page

User Story 1.1 - Clicking on a key asset to get instructions for how to play

As a player I want to view details about the app so I better understand how to play

✅ Acceptance Criteria:

- User opens app by clicking on the key asset with a link to the homepage of the app `${req.hostname}`
- Home page should show basic instructions for how to claim a plot, purchase seeds, plant seeds, and harvest plants.

Epic 2: Claiming a Plot

User Story 2.1 - Clicking on an plot to open the app

As a player I want to claim a plot so that I can plant seeds, watch my garden grow, and harvest plants

✅ Acceptance Criteria:

- User opens app by clicking on a Plot asset with a default link of `${req.hostname}/plot` which should navigate them to a Plot page in the UI
- If `ownerId` is not in url search query the have the ability to click a button that Says Claim This Plot.
  - if `ownerId` exist but doesn't match url query param `profileId` then plot is already owned by another player and UI should render the following details:
    - Owner name (from query param)
  - if `ownerId` exist and DOES match url query param `profileId` then plot is owned by current player and UI should display cards with details for all seeds that they currently own and a button to open the Seed Menu so that they can purchase additional seeds (outlined in Epic 3)
  - if available the DroppedAsset's clickable link should be updated to `${req.hostname}/plot?ownerName=${displayName}&ownerProfileId=${profileId}`

Epic 3: Planting Seeds

Assumptions
All image variations for all plants are stored in an object keyed by plant id with a child object keyed by `growLevel` with value set to image source url

User Story 3.1 – Seed Selection

As a player, I want to view and select seeds from a menu so I can choose what to grow. Only available when a player owns the Plot they are interacting with.

✅ Acceptance Criteria:

- Player can open a seed menu
  - Each seed shows: id, name, image, cost, reward. If the seed has been planted it should also show growth time
  - There should be several plants that are free and some that cost x coins
  - Locked seeds are visibly grayed out with unlock info
  - Selecting a seed highlights it and readies it for planting
- Player can chose where to plant seed within their plot
  - Player sees a 4x4 grid of clickable squares
  - Squares that are unavailable should be disabled
  - Clicking on an available square should select and highlight it

User Story 3.2 – Plant a Seed

As a player, I want to click a button to plant a seed in the world (create & drop a new DroppedAsset in the world using the clicked image URL)

✅ Acceptance Criteria:

- Once a seed and a square is selected the Plant Seed button should be enabled
- Clicking Plant Seed drops the new DroppedAsset in the world
  - DroppedAsset `position` is determined by finding the position of the selected square relative to the Plot's dropped asset position (the Plot's dropped asset id will be available in the req.query as `assetId`)
  - DroppedAsset `layer0` should be pulled from the plant image variations object by plant id
  - DroppedAsset should have clickType = "link" and clickableLink = `${req.hostname}/plant?plantId=${plant.id}&ownerProfileId=${profileId}`
- The Visitor's data `plants` object should have an object for plants keyed by `droppedAsset.id` and be updated to include the new `droppedAsset.id`, `dateDropped` datetime stamp, seed id, `growLevel` defaulted to 0, `plotId`, and `wasHarvested` defaulted to false.

User Story 3.3 – Plant Page + Growth Timer

As a player, I want crops to grow over time so that they feel alive and rewarding to harvest.

✅ Acceptance Criteria:

- User opens app by clicking on a Plant asset with a default link of `${req.hostname}/plant` which should navigate them to a Plant page in the UI
- If `ownerProfileId` does not match `profileId` in the url search query parameters then player cannot take action but should see details about the plant and the owner's name pulled from the ownerName query param
- If `ownerProfileId` DOES match `profileId`
  Each seed has a defined growth time (30s to 5min, depending on crop)
  - Each time the user opens the app we should verify each of their dropped assets stored in their Visitor's data object still exists in the world and if growth time has passed then increment the `growLevel` by one and the layer0 of dropped asset for that plant should be updated with the corresponding image url
  - Returning to game shows updated growth state

Epic 4: Harvesting and Rewards

User Story 4.1 – Harvest a Crop

As a player, I want to harvest grown crops to earn rewards and use them later. (Same screen accessed via clicking on a plant dropped asset, see User Story 3.3)

✅ Acceptance Criteria:

- When a plant finishes growing (`growLevel` is >= 10) a particle effect should be triggered on the World and position should be established by getting the DroppedAsset via `assetId in req.query
- In the UI a player can select a plant and if it can be harvested they can click on a Harvest button, button should be disabled if `growLevel` < 10
- Once harvested the dropped asset should be removed from the world and the Visitor's data object should be updated as follows
  - The `availablePlots` object should be updated with [plotId]: true
  - Player earns coins/XP/reward for harvesting. The Visitor's data object should have a properties called `totalCoinsEarned` and `coinsAvailable` and each should increment by 1 for free seeds and by 2x the cost for seeds that require purchasing
  - The dropped asset being harvested should have a record in the "plants" object in the Visitor's data object and `wasHarvested` should get updated to trueAlready harvested plants should never show in the UI

User Story 4.2 – Use Rewards to Unlock More Seeds

As a player, I want to use my earnings to unlock new types of seeds with higher value.

✅ Acceptance Criteria:

- Rewards are tracked as `totalCoinsEarned` in the Visitor's data object
- New seed types become unlockable/enabled if the Visitor has earned enough coins to purchase them
- Buying a seed unlocks it permanently for future use adding it to the `seedsPurchased` object which should be keyed by seed id and include a datetime stamp for `datePurchased` and decreases `coinsAvailable` by the cost
