#codebase
Read `.claude/rules.md`. Do not propose any code yet.

PLAN REQUEST:
I want to use this repo as starting point to create a new app that does the following.

🎯 Game Overview

A relaxing, loop-based gardening game where players plant seeds, grow crops, and harvest them to earn rewards.

This version focuses on core mechanics only: planting, growing, and harvesting. Future updates may include trading, crafting, pests, weather cycles, and cross-player co-op.

🔁 Core Gameplay Loop
Plant a seed from the seed menu
Wait for growth time (real time or simulated)
Harvest when plant is ready
Earn coins or points
Use rewards to unlock new seed types or decor

Important Terminology
The "Key Asset" refers to a dropped asset that is already in world that when clicked will open this app in an iframe. All necessary credentials will be passed to that iframe by default. Note that this is separate from all plant dropped assets and will be the only dropped asset that is clickable in this version of the app.

Data Object setup
The World's data object should contain an object keyed by `sceneDropId` with the value set to `assetId` (both pulled from req.query, see example usage ofo getCredentials in existing controllers). This should only be updated if the World data object does not already contain a value for the `sceneDropId`. Example output:
{
"exampleSceneDropId1": "exampleAssetId1",
"exampleSceneDropId2": "exampleAssetId2"
}

The Visitors' data objects should be updated when actions outlined in the users stories are taken. Example output:
{
"totalCoinsEarned": 10,
"coinsAvailable": 20,
"plants`: {
"exampleDroppedAssetId1": {
"dateDropped": new Date(),
"seedId": 1,
"growLevel": 4,
"wasHarvested": false
}
"exampleDroppedAssetId2": {
"dateDropped": new Date(),
"seedId": 2,
"growLevel": 10,
"wasHarvested": true
}
}
}

🧑‍💻 User Stories & Acceptance Criteria

Epic 1: Planting and Growing Crops

User Story 1.1 – Seed Selection
As a player, I want to view and select seeds from a menu so I can choose what to grow.
✅ Acceptance Criteria:
Player can open a seed menu
Each seed shows: id, name, image, cost, reward. If the seed has been planted it should also show growth time
There should be several plants that are free and some that cost x coins
Locked seeds are visibly grayed out with unlock info
Selecting a seed highlights it and readies it for planting

User Story 1.2 – Plant a Seed
As a player, I want to click a button to plant a seed in the world (create & drop a new DroppedAsset in the world using the clicked image URL) near where I am currently located (Visitor moveTo position) so that it begins to grow.
✅ Acceptance Criteria:
Upon successfully dropping the new DroppedAsset, the Visitor's data `plants` object should have an object for plants keyed by `droppedAsset.id` and be updated to include the new `droppedAsset.id`, `dateDropped` datetime stamp, seed id, and `growLevel` defaulted to 0
Upon successfully dropping the new DroppedAsset, the

User Story 1.3 – Growth Timer
As a player, I want crops to grow over time so that they feel alive and rewarding to harvest.
✅ Acceptance Criteria:
Each seed has a defined growth time (30s to 5min, depending on crop)
Each time the user opens the app we should verify each of their dropped assets stored in their Visitor's data object still exists in the world and if 1 hour has passed then increment the `growLevel` by one.
Returning to game shows updated growth state

Epic 2: Harvesting and Rewards

User Story 2.1 – Harvest a Crop
As a player, I want to harvest grown crops to earn rewards and use them later.
✅ Acceptance Criteria:
When a plant finishes growing (`growLevel` is >= 10), it visually changes to a mature version
Clicking the crop triggers a particle effect
In the UI a player can select a plant and if it can be harvested they can click on a Harvest button, button should be disabled if `growLevel` < 10
Once harvested the dropped asset should be removed from the world
Player earns coins/XP/reward for harvesting. The Visitor's data object should have a properties called `totalCoinsEarned` and `coinsAvailable` and each should increment by 1 for free seeds and by 2x the cost for seeds that require purchasing
The dropped asset being harvested should have a record in the "plants" object in the Visitor's data object and `wasHarvested` should get updated to true
Already harvested plants should never show in the UI

User Story 2.2 – Use Rewards to Unlock More Seeds
As a player, I want to use my earnings to unlock new types of seeds with higher value.
✅ Acceptance Criteria:
Rewards are tracked as `totalCoinsEarned` in the Visitor's data object
New seed types become unlockable if the Visitor has earned enough coins to purchase them
Buying a seed unlocks it permanently for future use and decreases `coinsAvailable` by the cost

Epic 3: Admin Functionality

User Story 3.1 - Remove all plants from world
As an admin, I should be able to click on a settings icon to view admin only functionality and see a button to Remove All Plants. Clicking on this button should find all dropped assets in the world by `sceneDropId`, filter that list so that it doesn't include any where `droppedAsset.id` is equal to `assetId` from req.query, then remove all remaining dropped asset results from from the world (see WorldFactory's `deleteDroppedAssets` method)

✅ Acceptance Criteria:
Epic 4: Analytics

Analytics should be added when the following happens:
"joins": Any time the user opens the app
"seedsPlanted": Any time the user plants a new seed
"plantsHarvested": Any time the user harvests a plant
"seedsPurchased": Any time the user purchase a seed

Output a PLAN covering:

1. File tree delta (new/modified files)
2. Endpoint signatures (method, path, inputs/outputs, response schema)
3. Data shapes (TS interfaces)
4. Tests to add/modify (names + assertions: status, JSON schema, SDK calls, credentials flow)
5. Risks/assumptions (call out any unclear defaults for data objects)

Respect all constraints in `.claude/rules.md`.
