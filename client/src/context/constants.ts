export const initialState = {
  error: "",
  gameState: {},
  hasInteractiveParams: false,
  gardenState: {
    visitorData: {
      coins: 0,
      unlockedSeeds: [],
    },
    worldData: {
      highScore: 0,
    },
    plants: {},
    availableSeeds: [],
  },
  selectedSeed: null,
  plantingMode: false,
};
