import { PlantInterface, SeedInterface } from "../utils/types";

export const SET_HAS_INTERACTIVE_PARAMS = "SET_HAS_INTERACTIVE_PARAMS";
export const SET_GAME_STATE = "SET_GAME_STATE";
export const SET_ERROR = "SET_ERROR";
export const UPDATE_GARDEN_STATE = "UPDATE_GARDEN_STATE";
export const SET_SELECTED_SEED = "SET_SELECTED_SEED";
export const SET_PLANTING_MODE = "SET_PLANTING_MODE";

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

export interface InitialState {
  isAdmin?: boolean;
  droppedAsset?: { assetName: string; bottomLayerURL: string; id: string; topLayerURL: string };
  error?: string;
  hasInteractiveParams?: boolean;
  gardenState?: {
    visitorData: {
      coins: number;
      unlockedSeeds: string[];
    };
    worldData: {
      highScore: number;
    };
    plants: Record<string, PlantInterface>;
    availableSeeds: SeedInterface[];
  };
  selectedSeed?: string | null;
  plantingMode?: boolean;
}

export type ActionType = {
  type: string;
  payload: InitialState;
};

export type ErrorType =
  | string
  | {
      message?: string;
      response?: { data?: { error?: { message?: string }; message?: string } };
    };
