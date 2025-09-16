export interface SeedInterface {
  id: number;
  name: string;
  imageUrl: string;
  cost: number;
  reward: number;
  growthTime: number; // Time in minutes to reach full growth
  growthLevels: number; // Total number of growth levels (default: 10)
  unlockedByDefault: boolean;
}
