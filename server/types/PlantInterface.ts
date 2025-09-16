export interface PlantInterface {
  dateDropped: string; // ISO string
  seedId: number;
  growLevel: number;
  wasHarvested: boolean;
  lastUpdated?: string; // ISO string, when growth was last calculated
}
