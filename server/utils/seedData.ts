import { SeedInterface } from "../types/SeedInterface.js";

export const SEEDS: SeedInterface[] = [
  {
    id: 1,
    name: "Sunflower",
    imageUrl: "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/sunflower_mature.png",
    cost: 0, // Free
    reward: 1,
    growthTime: 1, // 1 minute (for testing)
    growthLevels: 10,
    unlockedByDefault: true,
  },
  {
    id: 2,
    name: "Carrot",
    imageUrl: "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/carrot_mature.png",
    cost: 0, // Free
    reward: 2,
    growthTime: 2, // 2 minutes
    growthLevels: 10,
    unlockedByDefault: true,
  },
  {
    id: 3,
    name: "Tomato",
    imageUrl: "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/tomato_mature.png",
    cost: 0, // Free
    reward: 3,
    growthTime: 3, // 3 minutes
    growthLevels: 10,
    unlockedByDefault: true,
  },
  {
    id: 4,
    name: "Pumpkin",
    imageUrl: "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/pumpkin_mature.png",
    cost: 5,
    reward: 12,
    growthTime: 5, // 5 minutes
    growthLevels: 10,
    unlockedByDefault: false,
  },
  {
    id: 5,
    name: "Strawberry",
    imageUrl: "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/strawberry_mature.png",
    cost: 10,
    reward: 25,
    growthTime: 8, // 8 minutes
    growthLevels: 10,
    unlockedByDefault: false,
  },
  {
    id: 6,
    name: "Golden Rose",
    imageUrl: "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/golden_rose_mature.png",
    cost: 50,
    reward: 150,
    growthTime: 15, // 15 minutes
    growthLevels: 10,
    unlockedByDefault: false,
  },
];

// Growth stage images for each seed
export const GROWTH_IMAGES: Record<number, string[]> = {
  1: [
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/sunflower_seed.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/sunflower_sprout.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/sunflower_growing.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/sunflower_mature.png",
  ],
  2: [
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/carrot_seed.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/carrot_sprout.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/carrot_growing.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/carrot_mature.png",
  ],
  3: [
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/tomato_seed.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/tomato_sprout.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/tomato_growing.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/tomato_mature.png",
  ],
  4: [
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/pumpkin_seed.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/pumpkin_sprout.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/pumpkin_growing.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/pumpkin_mature.png",
  ],
  5: [
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/strawberry_seed.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/strawberry_sprout.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/strawberry_growing.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/strawberry_mature.png",
  ],
  6: [
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/golden_rose_seed.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/golden_rose_sprout.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/golden_rose_growing.png",
    "https://topia-dev-test.s3.us-east-1.amazonaws.com/plants/golden_rose_mature.png",
  ],
};

// Find a seed by ID
export const getSeedById = (seedId: number): SeedInterface | undefined => {
  return SEEDS.find((seed) => seed.id === seedId);
};

// Get the image URL for a specific growth stage
export const getGrowthImage = (seedId: number, growLevel: number): string => {
  const seed = getSeedById(seedId);
  if (!seed) return "";

  const stages = GROWTH_IMAGES[seedId] || [];
  if (stages.length === 0) return seed.imageUrl;

  // Calculate which image to show based on growth level
  const stageIndex = Math.min(Math.floor((growLevel / seed.growthLevels) * stages.length), stages.length - 1);

  return stages[stageIndex];
};
