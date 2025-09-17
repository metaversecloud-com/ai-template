import { Seed } from "../utils/garden/seedsData";

export const SET_HAS_INTERACTIVE_PARAMS = "SET_HAS_INTERACTIVE_PARAMS";
export const SET_GAME_STATE = "SET_GAME_STATE";
export const SET_ERROR = "SET_ERROR";
export const SET_SELECTED_PLOT = "SET_SELECTED_PLOT";
export const SET_SELECTED_SEED = "SET_SELECTED_SEED";
export const SET_AVAILABLE_SEEDS = "SET_AVAILABLE_SEEDS";
export const SET_PROFILE_ID = "SET_PROFILE_ID";

export type InteractiveParams = {
  assetId: string;
  displayName: string;
  identityId: string;
  interactiveNonce: string;
  interactivePublicKey: string;
  profileId: string;
  sceneDropId: string;
  uniqueName: string;
  urlSlug: string;
  username: string;
  visitorId: string;
};

export interface Plant {
  dateDropped: string;
  seedId: number;
  growLevel: number;
  plotId: number;
  wasHarvested: boolean;
}

export interface PurchasedSeed {
  id: number;
  datePurchased: string;
}

export interface InitialState {
  isAdmin?: boolean;
  error?: string;
  hasInteractiveParams?: boolean;

  // Garden game properties
  coinsAvailable?: number;
  totalCoinsEarned?: number;
  availablePlots?: Record<number, boolean>;
  seedsPurchased?: Record<number, PurchasedSeed>;
  plants?: Record<string, Plant>;
  selectedPlotId?: number | null;
  selectedSeedId?: number | null;
  availableSeeds?: Seed[];
  profileId?: string | null;
}

export type ActionType = {
  type: string;
  payload: any;
};

export type ErrorType =
  | string
  | {
      message?: string;
      response?: { data?: { error?: { message?: string }; message?: string } };
    };
