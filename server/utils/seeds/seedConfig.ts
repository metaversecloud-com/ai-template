export interface SeedConfig {
  id: number;
  name: string;
  cost: number; // 0 for free seeds
  reward: number; // coins earned when harvested
  growthTime: number; // total time in seconds to reach level 10
  imageVariations: {
    [growLevel: number]: string; // URL to image for each growth stage (0-10)
  };
}

// Plant image variations for each growth level (0-10)
export const PLANT_IMAGES = {
  1: {
    // Carrot
    0: "https://cdn.topia.io/assets/plants/carrot/carrot-0.png",
    1: "https://cdn.topia.io/assets/plants/carrot/carrot-1.png",
    2: "https://cdn.topia.io/assets/plants/carrot/carrot-2.png",
    3: "https://cdn.topia.io/assets/plants/carrot/carrot-3.png",
    4: "https://cdn.topia.io/assets/plants/carrot/carrot-4.png",
    5: "https://cdn.topia.io/assets/plants/carrot/carrot-5.png",
    6: "https://cdn.topia.io/assets/plants/carrot/carrot-6.png",
    7: "https://cdn.topia.io/assets/plants/carrot/carrot-7.png",
    8: "https://cdn.topia.io/assets/plants/carrot/carrot-8.png",
    9: "https://cdn.topia.io/assets/plants/carrot/carrot-9.png",
    10: "https://cdn.topia.io/assets/plants/carrot/carrot-10.png",
  },
  2: {
    // Lettuce
    0: "https://cdn.topia.io/assets/plants/lettuce/lettuce-0.png",
    1: "https://cdn.topia.io/assets/plants/lettuce/lettuce-1.png",
    2: "https://cdn.topia.io/assets/plants/lettuce/lettuce-2.png",
    3: "https://cdn.topia.io/assets/plants/lettuce/lettuce-3.png",
    4: "https://cdn.topia.io/assets/plants/lettuce/lettuce-4.png",
    5: "https://cdn.topia.io/assets/plants/lettuce/lettuce-5.png",
    6: "https://cdn.topia.io/assets/plants/lettuce/lettuce-6.png",
    7: "https://cdn.topia.io/assets/plants/lettuce/lettuce-7.png",
    8: "https://cdn.topia.io/assets/plants/lettuce/lettuce-8.png",
    9: "https://cdn.topia.io/assets/plants/lettuce/lettuce-9.png",
    10: "https://cdn.topia.io/assets/plants/lettuce/lettuce-10.png",
  },
  3: {
    // Tomato
    0: "https://cdn.topia.io/assets/plants/tomato/tomato-0.png",
    1: "https://cdn.topia.io/assets/plants/tomato/tomato-1.png",
    2: "https://cdn.topia.io/assets/plants/tomato/tomato-2.png",
    3: "https://cdn.topia.io/assets/plants/tomato/tomato-3.png",
    4: "https://cdn.topia.io/assets/plants/tomato/tomato-4.png",
    5: "https://cdn.topia.io/assets/plants/tomato/tomato-5.png",
    6: "https://cdn.topia.io/assets/plants/tomato/tomato-6.png",
    7: "https://cdn.topia.io/assets/plants/tomato/tomato-7.png",
    8: "https://cdn.topia.io/assets/plants/tomato/tomato-8.png",
    9: "https://cdn.topia.io/assets/plants/tomato/tomato-9.png",
    10: "https://cdn.topia.io/assets/plants/tomato/tomato-10.png",
  },
  4: {
    // Pumpkin
    0: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-0.png",
    1: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-1.png",
    2: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-2.png",
    3: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-3.png",
    4: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-4.png",
    5: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-5.png",
    6: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-6.png",
    7: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-7.png",
    8: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-8.png",
    9: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-9.png",
    10: "https://cdn.topia.io/assets/plants/pumpkin/pumpkin-10.png",
  },
};

export const SEED_CONFIGS: Record<number, SeedConfig> = {
  1: {
    id: 1,
    name: "Carrot",
    cost: 0, // Free
    reward: 2,
    growthTime: 60, // 60 seconds
    imageVariations: PLANT_IMAGES[1],
  },
  2: {
    id: 2,
    name: "Lettuce",
    cost: 0, // Free
    reward: 3,
    growthTime: 90, // 90 seconds
    imageVariations: PLANT_IMAGES[2],
  },
  3: {
    id: 3,
    name: "Tomato",
    cost: 5,
    reward: 8,
    growthTime: 120, // 2 minutes
    imageVariations: PLANT_IMAGES[3],
  },
  4: {
    id: 4,
    name: "Pumpkin",
    cost: 10,
    reward: 25,
    growthTime: 300, // 5 minutes
    imageVariations: PLANT_IMAGES[4],
  },
};

export const getSeedConfig = (seedId: number): SeedConfig | null => {
  return SEED_CONFIGS[seedId] || null;
};

export const getAllSeedConfigs = (): SeedConfig[] => {
  return Object.values(SEED_CONFIGS);
};

export const getPlantImageUrl = (seedId: number, growLevel: number): string => {
  const seedConfig = getSeedConfig(seedId);
  return seedConfig?.imageVariations[growLevel] || "";
};