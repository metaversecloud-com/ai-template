/**
 * Seed data types and constants for the garden game
 */

export interface Seed {
  id: number;
  name: string;
  cost: number;
  reward: number;
  growthTime: number; // in seconds
  imageUrl: string;
}

export const AVAILABLE_SEEDS: Seed[] = [
  {
    id: 1,
    name: "Carrot",
    cost: 0, // Free seed
    reward: 1,
    growthTime: 60, // 1 minute
    imageUrl: "https://example.com/seeds/carrot.png",
  },
  {
    id: 2,
    name: "Tomato",
    cost: 0, // Free seed
    reward: 1,
    growthTime: 120, // 2 minutes
    imageUrl: "https://example.com/seeds/tomato.png",
  },
  {
    id: 3,
    name: "Corn",
    cost: 5,
    reward: 10,
    growthTime: 180, // 3 minutes
    imageUrl: "https://example.com/seeds/corn.png",
  },
  {
    id: 4,
    name: "Strawberry",
    cost: 10,
    reward: 20,
    growthTime: 240, // 4 minutes
    imageUrl: "https://example.com/seeds/strawberry.png",
  },
  {
    id: 5,
    name: "Golden Melon",
    cost: 20,
    reward: 45,
    growthTime: 300, // 5 minutes
    imageUrl: "https://example.com/seeds/golden-melon.png",
  },
];
