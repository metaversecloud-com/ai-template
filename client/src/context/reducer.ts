import {
  ActionType,
  InitialState,
  SET_ERROR,
  SET_GAME_STATE,
  SET_HAS_INTERACTIVE_PARAMS,
  UPDATE_GARDEN_STATE,
  SET_SELECTED_SEED,
  SET_PLANTING_MODE,
} from "./types";

const globalReducer = (state: InitialState, action: ActionType) => {
  const { type, payload } = action;
  switch (type) {
    case SET_HAS_INTERACTIVE_PARAMS:
      return {
        ...state,
        hasInteractiveParams: true,
      };
    case SET_GAME_STATE:
      return {
        ...state,
        droppedAsset: payload.droppedAsset,
        isAdmin: payload.isAdmin,
        error: "",
      };
    case SET_ERROR:
      return {
        ...state,
        error: payload.error,
      };
    case UPDATE_GARDEN_STATE:
      return {
        ...state,
        gardenState: payload.gardenState,
        error: "",
      };
    case SET_SELECTED_SEED:
      return {
        ...state,
        selectedSeed: payload.selectedSeed,
      };
    case SET_PLANTING_MODE:
      return {
        ...state,
        plantingMode: payload.plantingMode,
      };
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

export { globalReducer };
